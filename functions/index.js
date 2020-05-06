const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Logging } = require('@google-cloud/logging');
const { PubSub } = require(`@google-cloud/pubsub`);

// TODO
const credential_json_file = ['file_name.json']  // provide file path of credential file e.g. './serviceKey.json'
const projectId = ['Project ID']
const topicName = ['Topic Name']
// End TODO

const logging = new Logging({projectId: projectId});
const serviceAccount = require(credential_json_file);
const pubsub = new PubSub({projectId: projectId});

const stripe = require('stripe')(functions.config().stripe.secret);
const currency = functions.config().stripe.currency || 'USD';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.addFileDetailsAndCreatePubsub = functions.firestore.document('/stripe_customers/{userId}/files/{fileId}').onCreate(async (snap, context) => {
     const val = snap.data();
     const filesNames = val.fileNames
     const url = val.url
     const email = val.email
     if (val === null){
       return null;
     }
   
     try {
       const data = JSON.stringify({
         userId: context.params.userId,
         bucket: val.bucket,
         fileName: filesNames,
         url: val.fullPaths,
         currentTime: val.currentTime,
         time: val.time,
         date: val.date,
         path: val.path
       });
       const dataBuffer = Buffer.from(data);
       await pubsub
       .topic(topicName)
       .publish(dataBuffer)
       .then(messageId => {
         db.collection('stripe_customers').doc(context.params.userId).set({messageId: messageId}, { merge: true });
       })
       .catch(err => {
       });
       await db.collection('stripe_customers').doc(context.params.userId).set({resultId: val.currentTime}, { merge: true });
     } catch (error) {
       await snap.ref.set({error: userFacingMessage(error)}, { merge:true });
       await snap.ref.set({status: 'Error'}, { merge: true });
       return reportError(error, {user: context.params.userId});
     }
   });

// [START retriveStripeCoupon]
exports.retriveStripeCoupon = functions.firestore.document('stripe_customers/{userId}/coupons/{id}').onCreate(async (snap, context) => {
    const val = snap.data();
    try {
      // Look up the Stripe customer id written in createStripeCustomer
      const snapshot = await admin.firestore().collection(`stripe_customers`).doc(context.params.userId).get();
      const snapval = snapshot.data();

      const coupon = val.coupon;

      let respFinal;
      let errFinal;

      await stripe.coupons.retrieve(
        coupon,
        function (err, response) {
          respFinal = response
          errFinal = err
          // asynchronously called
           // If the result is successful, write it back to the database
           if (respFinal != undefined){
            snap.ref.set({status: 'valid'}, { merge: true });
            snap.ref.set(respFinal, { merge: true });
            return;
          }else{
            snap.ref.set({status: 'invalid'}, { merge: true });
            return snap.ref.set({errFinal: userFacingMessage(errFinal)}, { merge: true });
          }
        }
      );
      
    } catch(error) {
      // We want to capture errors and render them in a user-friendly way, while
      // still logging an exception with StackDriver
      await snap.ref.set({error: userFacingMessage(error)}, { merge: true });
      await snap.ref.set({status: 'invalid'}, { merge: true });
      return reportError(error, {user: context.params.userId});
    }
  });
// [END retriveStripeCoupon]

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is created in Cloud Firestore
exports.createStripeCharge = functions.firestore.document('stripe_customers/{userId}/charges/{id}').onCreate(async (snap, context) => {
      const val = snap.data();
      try {
        // Look up the Stripe customer id written in createStripeCustomer
        const snapshot = await admin.firestore().collection(`stripe_customers`).doc(context.params.userId).get();
        const snapval = snapshot.data();
        // const customer = snapval.customer_id
        // Create a charge using the pushId as the idempotency key
        // protecting against double charges
        const amount = val.amount;
        const token = val.token;

        const response = await stripe.charges.create({
          amount: amount * 100,
          currency: 'usd',
          source: token,
          description: 'Chest X-Ray COVID-19 prediction'
        });

        // If the result is successful, write it back to the database
        await snap.ref.set({status: 'succeeded'}, { merge: true });
        return snap.ref.set(response, { merge: true });
      } catch(error) {
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with StackDriver
        await snap.ref.set({error: userFacingMessage(error)}, { merge: true });
        await snap.ref.set({status: 'error'}, { merge: true });
        return reportError(error, {user: context.params.userId});
      }
    });
// [END chargecustomer]

// When a user is created, register them with Stripe
exports.createStripeCustomer = functions.auth.user().onCreate(async (user) => {
  const customer = await stripe.customers.create({email: user.email});
  return admin.firestore().collection('stripe_customers').doc(user.uid).set({customer_id: customer.id});
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete(async (user) => {
  const snapshot = await admin.firestore().collection('stripe_customers').doc(user.uid).get();
  const customer = snapshot.data();
  await stripe.customers.del(customer.customer_id);
  return admin.firestore().collection('stripe_customers').doc(user.uid).delete();
});

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: {function_name: process.env.FUNCTION_NAME},
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function',
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
       return reject(error);
      }
      return resolve();
    });
  });
}
// [END reporterror]

function userFacingMessage(error) {
  return error.type ? error.message : 'An error occurred, developers have been alerted';
}