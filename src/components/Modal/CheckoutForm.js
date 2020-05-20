import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import { firebase } from '@firebase/app';
import moment from 'moment-timezone'; 
import './modal.css';
import { Button, CircularProgress } from "@material-ui/core";
import Result from "./Result";
import { Spinner, ProgressBar } from 'react-bootstrap';

let status;

class CheckoutForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount:3,
      currency: "",
      name: "",
      clientSecret: null,
      error: null,
      metadata: null,
      disabled: false,
      succeeded: false,
      processing: false,
      currentUser: null,
      paymentStatus: "",
      stripeCustomerInitialized: false,
      loading:false,
      resultShow:false,
      resultId:"",
      apply: "Apply",
      couponDisabled: false
    };
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleResult = this.handleResult.bind(this);
    // this.setPaymentStatus = this.setPaymentStatus.bind(this);
  }

  handleCoupon = async(ev) => {
    const { t, i18n} = this.props;
   
    ev.preventDefault();
    const { amount } = this.state
    this.setState({
      apply: t("Applying"),
      couponDisabled: false
    });

    var coupon = this.refs.coupon.value
    let uid = firebase.auth().currentUser.uid;
    let val = await firebase.firestore().collection('stripe_customers').doc(uid).get();
    let resultId = val.data().resultId
    let currentTime = moment().tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss');
    if (coupon === ""){
      this.setState({
        error: t('Please enter Coupon Code'),
        apply: t("Apply")
      });
      return;
    }
    else{
      await firebase.firestore().collection('stripe_customers').doc(uid).collection('coupons').doc(currentTime).set({
        coupon: coupon,
        resultId: resultId
      });
      await firebase.firestore().collection("stripe_customers").doc(uid).collection('coupons').doc(currentTime)
          .onSnapshot(doc =>  {            
                var status = doc.data().status
                
                if (status === 'valid'){
                  var valid = doc.data().valid
                  var amount_off = doc.data().amount_off
                  var max_redemptions = doc.data().max_redemptions
                  var times_redeemed = doc.data().times_redeemed
                  var id = doc.data().id
                  if (max_redemptions == null || (times_redeemed < max_redemptions)){
                    if (amount_off != undefined){
                      const val1 = parseFloat(amount) * 100;
                      const val2 = amount_off;
                      var amountVal = ((val1 - amount_off)/100)
                      this.refs.amount.placeholder = "$" + parseFloat(amountVal)
                      this.setState({
                        amount: parseFloat(amountVal),
                        apply: t("Applied"),
                        error: "",
                        couponDisabled: true
                     });
                    }
                  }else{
                    this.setState({
                      error: t("Coupon is expired"),
                   });
                  }
                }
                else if(status === 'invalid'){
                  this.setState({
                    error: t('Please enter valid Coupon Code'),
                    apply: t("Apply"),
                    couponDisabled: false
                  });
                  return;
                }
        });
    }
  }
 
  handleResult = async(ev) => {
    ev.preventDefault();
    this.setState({ resultShow: true })

  }
  handlefailed = async (ev) => {
    ev.preventDefault();
    const { t, i18n } = this.props;

    this.setState({
      paymentStatus: "", processing: false,
      disabled: false,
      apply: t("Apply"),
      couponDisabled: false,
      amount:3
     })

  }
  
  handleSubmit = async(ev)=> {
    ev.preventDefault();
    const { t, i18n, resultid } = this.props;
    this.props.setDisabled(true)
    if (this.props.stripe) {
      let email = firebase.auth().currentUser.email;
      let uid = firebase.auth().currentUser.uid;
      let userName = this.refs.name.value
      let amount = this.state.amount
      let val = await firebase.firestore().collection('stripe_customers').doc(uid).get();
      let resultId = val.data().resultId
      this.setState({resultId:resultId});
      let currentTime = moment().tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss');
      let time = currentTime.split("_")[1]
      let date = currentTime.split("_")[0]
      if (userName === "" || amount === ""){
        this.setState({
          processing: false,
          error: t('Please fill all details')
        });
        this.props.setDisabled(false)
        return;
      }
      const { error, token } = await this.props.stripe.createToken({name: userName});
      this.setState({
        processing: true,
        disabled: true,
      });
      
      if (error){
        this.setState({
          processing: false,
          disabled: false,
          error: `Payment failed: ${error.message}`
        });
        this.props.setDisabled(false)
        return;
      }
     
       firebase.firestore().collection('stripe_customers').doc(uid).onSnapshot(snapshot => {
        this.stripeCustomerInitialized = (snapshot.data() !== null);
      }, () => {
        this.stripeCustomerInitialized = false;
      });
            firebase.firestore().collection('stripe_customers').doc(uid).collection('charges').onSnapshot(snapshot => {
            let newCharges = {};
             snapshot.forEach(doc => {
               const id = currentTime;
               newCharges[id] = doc.data();
             })
             this.charges = newCharges;
            }, () => {
              this.charges = {};
            });

      try {
        await firebase.firestore().collection('stripe_customers').doc(uid).collection('charges').doc(currentTime).set({
          token: token.id,
          amount: parseFloat(amount),
          resultId: resultId,
          currentTime: currentTime
        });

        await firebase.firestore().collection("stripe_customers").doc(uid).collection('charges').doc(currentTime)
          .onSnapshot(doc =>  {            
                 status = doc.data().status
                if (status === "succeeded"){
                  this.setState({
                     succeeded:true
                  });

                  firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultid).update({
                      payment: "succeeded"
                  });
                }
                else if (status === "error"){
                  this.setState({
                    paymentStatus: t("error")
                  });

                  firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultId).update({
                    payment: "error"
                  });
                  return;
                }
  });

      } catch (error) {
        this.setState({
          processing: false,
          error: `Payment failed: ${error}`
        });
      }
      
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
    
  }


  renderSuccess() {
    const { t, i18n, resultid } = this.props;
    this.props.setDisabled(false)
    return (
      <div className="successModal">
        
        <div style={{ display:!this.state.resultShow?'block':'none'}}> 
        <img src={require('../../assets/images/payment_success.png')}/>
        <div className="paymentSuccWrap">
          <div className="paymentSuccTitle">{t("Payment Successful")} </div>
          <div className="paymentSuccDesc">{t("Your payment was Successful! You can now view the result")}</div>
        </div>
       
        <div className="paymentSuccBtnWrap">
          <Button className="payBtn" onClick={this.handleResult} > {t("View Result")} {this.state.loading && <CircularProgress size={24} className="buttonProgress" />}</Button>
        </div>
      </div>
        {/* <pre className="sr-callout">
          <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
        </pre> */}
        {this.state.resultShow && 
          <Result t={t} i18n={i18n} resultid={resultid} />
        }
        
      </div>
    );
  }

  renderFailed() {
    const { t, i18n, resultid } = this.props;
    this.props.setDisabled(false)
    return (
      <div className="successModal">

        <div style={{ display: !this.state.resultShow ? 'block' : 'none' }}>
          <img src={require('../../assets/images/payment_failed.png')} style={{ width:'100%'}} />
          <div className="paymentSuccWrap">
            <div className="paymentSuccTitle">{t("Payment failed")} </div>
            <div className="paymentSuccDesc">{t("Your payment was failed! Please try again.")}</div>
          </div>

          <div className="paymentSuccBtnWrap">
            <Button className="payBtn" onClick={this.handlefailed} > {t("Retry Payemnt")}</Button>
          </div>
        </div>
        {/* <pre className="sr-callout">
          <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
        </pre> */}
        {this.state.resultShow &&
          <Result resultid={resultid} />
        }

      </div>
    );
  }
 
 
  renderForm() {
    const { t, i18n, resultid } = this.props;
    var style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    };
    
    return (
      <div className="makeStyles-paper-202">
        <div className="modalTitle"> {t("NeuraCovid")}</div>
        <div className="modalMakepayemnt">{t("Make Payment of $3 to view result.")}</div>
        <form onSubmit={this.handleSubmit}>
          <div className="">
            <div className="sr-combo-inputs paymentInputWrapper ">
              <div className="sr-combo-inputs-row mt10">
                <input type="text" id="name" ref="name" placeholder={t("Name")} autoComplete="cardholder" className="inputBoxCard" />
              </div>
              <div className="sr-combo-inputs-row">
                <input type="number" id="amount" ref="amount" placeholder="$3" autoComplete="cardholder" className="inputBoxCard" disabled={true} style={{ background: 'rgb(247, 247, 247)',padding:'10px' }} />
              </div>
              <div className="sr-combo-inputs-row">
                <CardElement className="inputBoxCard" onReady={(c) => this._element = c} style={style} />
              </div>
            </div>
            <div className="sr-combo-inputs-row couponmt">
                <input type="text" id="coupon" ref="coupon" placeholder={t("Coupon Code")} autoComplete="cardholder" disabled={this.state.couponDisabled} className="inputBoxCard w50" style={{fontSize:'12px' }} />
              <button className="btnPayemnt payBtn coupon" onClick={this.handleCoupon} disabled={this.state.couponDisabled}> 
              <Spinner
                as="span"
                animation="border"
                role="status"
                variant="light"
                aria-hidden="true"
                hidden={this.state.apply ==="Applying" ? false :true}
              />{t(this.state.apply)}</button>
            </div>
            <div className="message sr-field-error" >{this.state.error ? <div style={{ color: "red" }}>{t(this.state.error)} </div> : <div style={{ color: 'black' }}> * {t("All fields are mandatory")}</div>}</div>

            {!this.state.succeeded && (
              <div className="payBtnWrapper">
              <button className="btnPayemnt payBtn" disabled={this.state.disabled}>
                  <Spinner
                    as="span"
                    animation="border"
                    role="status"
                    variant="light"
                    aria-hidden="true"
                    hidden={this.state.processing ? false : true}
                  />
                 
                {this.state.processing ? t("Processing") : t("Make Payment")}
              </button>
              </div>
            )}

          </div>
        </form>
      </div>
      
    );
  }

  render() {
    
    return (
     
      <div className="checkout-form">
        
        <div className="sr-payment-form">
          <div className="sr-form-row" />
            {this.state.succeeded && this.renderSuccess()}
          {!this.state.succeeded && this.state.paymentStatus === "" && this.renderForm()}
          {this.state.paymentStatus === "error" && this.renderFailed()}


         
        </div>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);