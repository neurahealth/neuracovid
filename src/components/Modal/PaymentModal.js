import React, { useState, useEffect } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { Modal, Backdrop, TextField} from '@material-ui/core';
import { render } from 'react-dom';
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from './CheckoutForm';

const apiKey = ['YOUR_STRIPE_PUBLIC_KEY']     // Set Publishable key from Stripe account

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '550px',
        margin:'auto',
        borderRadius:'5px',
        border:'none'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: 'auto',
    },
    head:{
        backgroundColor:'#41B2CC',
        color: '#fff',
        height:60,
        width:'100%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        fontWeight: "500",
       
        borderRadius: '8px 8px 0 0'
    },
    paymentSelectWrap:{
        width: 400,
        borderRadius: 8
    },
    paymentSelectBody:{
        padding:'5%'
    },
    cardpay:{
        margin: "10px 15px",
        flexDirection: "row",
        display: "flex",
        '&:hover': {
            boxShadow: "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
            transition: "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            cursor:'pointer'
        },  
    },
    cardpaycontent:{
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        paddingBottom: "16px !important"
    },
    carddesc:{
        marginLeft:15,
        textAlign: 'center'
    },
    cardDisabled:{
        backgroundColor: "rgba(245, 245, 245, 1)", 
        opacity: "0.4" ,
        '&:hover': {
            boxShadow: "none",
            transition: "none",
            cursor: 'not-allowed'
        }, 
    }
}));


function PaymentModal(props){
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const { t, i18n, resultid, source, planid, details} = props;
    const [disabled, setDisabled] = React.useState(false)
    const [showFedback, setshowFedback] = useState(false)

    const [stripe, setstripe] = useState(false)
    const [paypal, setpaypal] = useState(false)
    const [paypalSubscription, setpaypalSubscription] = useState(false)


    const handlefeedback = () => {
        setshowFedback(true)
    }

    const handlePaypalSubscriptionSuccess =()=>{
      setpaypalSubscription(true)
    }

    const handlePaypalSuccess =()=>{
      setpaypal(true)
    }

   const handleClose = () => {
       setOpen(false)
        props.open(false)
    };

    return (
           
        <Modal
        disableBackdropClick
        disableAutoFocus
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.paper} id="checkout">
          <div
            className={classes.paymentSelectWrap}
            style={{ display: stripe || paypal || props.resultShow? "none" : "block" }}
          >
            <div style={{ display: paypalSubscription || source == "subscribe"  ? 'none' : 'block' }}>
              <div className={classes.head}>
                <Typography variant="h6">Select Payment Method</Typography>
              </div>


              <button
                className="payclose"
                onClick={handleClose}
                style={{ marginRight: "20px", marginTop: "-45px" }}
              >
                x
              </button>
           </div>
            

            <div className="paymentSelectBodyWrap" style={{ display: paypalSubscription || source == "subscribe" ?'none':'block'}}>
              <div className={classes.paymentSelectBody}>
                <Typography variant="subtitle1" gutterBottom>
                  Select any one method to make payment of $3 covid result.
                </Typography>
              </div>

              <Card
                className={classes.cardpay}
                variant="outlined"
                onClick={() => setstripe(true)}
                style={{ display: source =="subscribe" ? 'none':'block'}}
              >
                <CardContent className={classes.cardpaycontent}>
                  <img
                    src={require("../../assets/images/stripe.png")}
                    width="120"
                    height="60"
                  />
                  <div className={classes.carddesc}>
                    <Typography
                      variant="caption"
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Stripe is simple to set-up payment method that supports
                      all credit, debit cards over 100 countries.
                    </Typography>
                  </div>
                </CardContent>
              </Card>

              <Card 
                  className={classes.cardpay} 
                  variant="outlined"
                  style={{ display: source == "subscribe" ? 'none' : 'block' }}
                >
                <CardContent
                  className={classes.cardpaycontent}
                  onClick={handlePaypalSuccess}
                >
                  <div>
                    <img
                      src={require("../../assets/images/paypal.jpg")}
                      width="120"
                      height="60"
                    />
                  </div>
                  <div className={classes.carddesc}>
                    <Typography
                      variant="caption"
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Paypal credit payment with a completely customizable
                      checkout.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
              <div style={{textAlign:'center',margin:'10px 0'}}> Save money by Subscribing  </div>
              <Card className={classes.cardpay} variant="outlined">
                <CardContent
                  className={classes.cardpaycontent}
                  onClick={handlePaypalSubscriptionSuccess}
                >
                  <div>
                    <img
                      src={require("../../assets/images/paypalSubscription.png")}
                      width="120"
                      height="60"
                    />
                  </div>
                  <div className={classes.carddesc}>
                    <Typography
                      variant="caption"
                      className={classes.title}
                      color="textSecondary"
                      gutterBottom
                    >
                      Paypal subscription with a completely customizable
                      checkout.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>  

            <button className="close" disabled={disabled} hidden={true} onClick={handleClose} >x</button>
            <div style={{ display: paypal ? "block" : "none" }}>
              <div className="paypal-checkout-form">
                <div className="sr-payment-form">
                  <Paypal
                    t={t}
                    i18n={i18n}
                    resultid={resultid}
                    setDisabled={setDisabled}
                    handleClose={handleClose}
                  />
                </div>
              </div>
            </div>

          <div style={{ display: paypalSubscription && !props.resultShow || source == "subscribe" ? "block" : "none" }}>
              <div className="paypal-checkout-form">
                <div className="sr-payment-form">
                  <PaypalSubscription
                    t={t}
                    i18n={i18n}
                    resultid={resultid}
                    setDisabled={setDisabled}
                    handleClose={handleClose}
                    planid={planid}
                    details={details}
                    source={source}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: stripe ? "block" : "none" }}>
              <StripeProvider apiKey={apiKey}>
                <Elements>
                  <CheckoutForm
                    t={t}
                    i18n={i18n}
                    resultid={resultid}
                    setDisabled={setDisabled}
                    handleClose={handleClose}
                  />
                </Elements>
              </StripeProvider>
            </div>
            <div style={{ display: props.resultShow ? "block" : "none" }}>
              <button
                className={!props.resultShow ? "payclose closeSuccess" : "payclose payresult"}
              onClick={showFedback ? handleClose:handlefeedback}
              style={{ display:showFedback?'none':'block'}}
              >
                x
              </button>
            <Result t={t} i18n={i18n} resultid={resultid} source={source} showFedback={showFedback} handleClose={handleClose}  />
            </div>
          </div>
          
      
      </Modal>
    )
}

export default PaymentModal
