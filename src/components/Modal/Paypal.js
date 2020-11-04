import React, { Component } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { firebase } from '@firebase/app';
import RenderFailed from './renderFailed';
import PaymentSuccess from './paymentSuccess';
import moment from 'moment-timezone';
import PaymentModal from './PaymentModal';

class Paypal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 3,
            succeeded: false,
            paymentStatus: "",
            processing: true,
            resultShow:false,
            loading:false,
            disabled: false,
        };
    }

    handlefailed = async (ev) => {

    };

    handleResult = async (ev) => {
        ev.preventDefault();
        setTimeout(() => {
            this.setState({ resultShow: true, loading: ev });
        }, 3000);
    };

    onSuccess = async (payment) => {
        this.setState({
            succeeded: true,
            disabled: true,
        });
        let uid = firebase.auth().currentUser.uid;
        let val = await firebase.firestore().collection('stripe_customers').doc(uid).get();
        let resultId = val.data().resultId
        let currentTime = moment().tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss');
        let time = currentTime.split("_")[1]
        let date = currentTime.split("_")[0]
        let firstName = payment.payer.name.given_name
        let surName = payment.payer.name.surname
        await firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultId).update({
            payment: "succeeded",
            paymentSource: 'Paypal'
        });
        await firebase.firestore().collection('stripe_customers').doc(uid).collection('charges').doc(currentTime).set({
            paymentSource: 'Paypal',
            status: 'succeeded',
            resultId: resultId,
            amount: this.state.amount * 100,
            payerName: firstName + " " + surName,
            balance_transaction: payment.id,
            payment
        });
       
        this.props.handlePaypalSuccess();
    }

    onCancel = (data) => {
        this.setState({
            paymentCancle: true
        });
    }

    onButtonReady = () => {
        console.log('onButtonReady');
    }

    onError = async (err) => {
        // The main Paypal's script cannot be loaded or somethings block the loading of that script!
        console.log("Error!", err);
        // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
        // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        let uid = firebase.auth().currentUser.uid;
        let val = await firebase.firestore().collection('stripe_customers').doc(uid).get();
        let resultId = val.data().resultId
        let currentTime = moment().tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss');
        let time = currentTime.split("_")[1]
        let date = currentTime.split("_")[0]
        this.setState({
            paymentStatus: "error"
        });
        firebase.firestore().collection('stripe_customers').doc(uid).collection('results').doc(resultId).update({
            payment: "error",
            paymentSource: 'Paypal'
        });
        await firebase.firestore().collection('stripe_customers').doc(uid).collection('charges').doc(currentTime).set({
            paymentSource: 'Paypal',
            status: 'error',
            err
        });
    }

    renderForm(props) {
        const { t, i18n, resultid } = this.props;
        return (
            <div className="makeStyles-paper-202" style={{ padding: '5 %'}}>
                <div className="modalTitle"> {t("NeuraCovid")}</div>
                <button className="payclose" disabled={this.state.disabled} onClick={props.handleClose} > x </button>
                <div className="modalMakepayemnt">
                    {t("Make Payment of $3 to view result.")}
                </div>
                <PayPalButton
                    amount={this.state.amount}
                    style={{
                        shape: 'pill',
                        color: 'blue',
                        layout: 'vertical',
                        label: 'subscribe'
                    }}
                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                    onError={this.onError}
                    onSuccess={this.onSuccess}
                    onCancel={this.onCancel}
                    onButtonReady={this.onButtonReady}
                    disabled={this.state.disabled}
                    onClick={()=>this.setState({disabled: true})}
                />
            </div>
        );
    }

    renderSuccess(props) {
        const { t, i18n, resultid } = this.props;
        this.props.setDisabled(false);
        return (
          <PaymentSuccess
            resultid={resultid}
            t={t}
            i18n={i18n}
            lang={this.props}
            resultShow={this.state.resultShow}
            loading={this.state.loading}
            handleResult={() => this.handleResult}
            handleClose={props.handleClose}
          />
        );
      }
      
      renderFailed(props) {
        const { t, i18n, resultid } = this.props;
        this.props.setDisabled(false);
        return (
          <RenderFailed
            t={t}
            i18n={i18n}
            lang={this.props}
            handlefailed={this.handlefailed}
            resultShow={this.state.resultShow}
            paymentStatus={this.state.paymentStatus}
          />
        );
      }

      renderCancle(props) {
        const { t, i18n, resultid } = this.props;
        this.props.setDisabled(false);
        return (
            <PaymentModal 
            t={t} 
            i18n={i18n} 
            open={props.handleClose}
            resultid={resultid} 
            resultShow={this.state.resultShow} 
            source= "home" />
        );
      }
    
    render() {
        const { t, i18n, resultid } = this.props;
        return (
            <div className="checkout-form">
                <div className="sr-payment-form">
                    {this.state.succeeded && this.renderSuccess(this.props)}
                    {!this.state.succeeded &&
                        this.state.paymentStatus === "" &&
                        this.renderForm(this.props)}
                    {this.state.paymentCancle &&
                    this.renderCancle(this.props)}
                    {/* {this.state.paymentStatus === "error" && this.renderFailed(this.props)} */}
                    {this.state.paymentStatus === "error" &&
                        this.renderFailed(this.props)}
                </div>
            </div>
        );
    }
}

export default Paypal