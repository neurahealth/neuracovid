import React, { Component } from "react";
import { PayPalButton } from "react-paypal-button-v2";
import { firebase } from '@firebase/app';
import RenderFailed from './renderFailed';
import PaymentSuccess from './paymentSuccess';
import moment from 'moment-timezone';
import SubscriptionSuccess from './SubscriptionSuccess';
import PaymentModal from './PaymentModal';

let planId;
let plan_name;
let plan_desc; 
let plan_price;
let list = [];
class PaypalSubscription extends Component {
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
            activeClass:this.props.planid,
            plan:[],
            resultid:this.props.resultid,
            source: this.props.source,
            paymentCancle: false
        };
        this.selectPlan = this.selectPlan.bind(this);
    }

    handlefailed = async (ev) => {

    };

    handleResult = async (ev) => {
        ev.preventDefault();
        setTimeout(() => {
            this.setState({ resultShow: true, loading: ev });
        }, 3000);
    };

    onApprove = async (data, actions) => {
      var that = this;
     
       return actions.subscription.get().then(function (details) {
        let userId = firebase.auth().currentUser.uid;
        let scans
        list.map(Plans => {
          if (Plans.Plan_ID == details.plan_id){
            scans = Plans.Total_scans
          }
        })
        let dt = new Date(details.start_time);
        dt.setDate( dt.getDate() + 30 );
        firebase.firestore().collection('stripe_customers').doc(userId).collection('subscription').doc('details').set({
          subscription: "success",
          status: details.status,
          plan_id: details.plan_id,
          start_time: details.start_time,
          status_update_time: details.status_update_time,
          total_scans: scans,
          remaining_scans: scans,
          plan_name: plan_name,
          plan_description: plan_desc,
          price_per_item: plan_price,
          expiry_date: moment(dt).tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss')
        });
        // alert("Subscription completed");
         
         that.setState({
           succeeded: true,
           disabled: true
         });
        console.log("subscriptions done");
      });
     
      
    }

    onCancel = (data) => {
        console.log('The payment was cancelled!', data);
        if (this.props.source === "home"){
          this.setState({
            paymentCancle: true
          });
        }
        // window.location.reload();
    }

    onError = async (err) => {
        console.log("Error!", err);
        alert("Please select the Subscription Plan");
        // this.setState({
        //   paymentStatus: "error"
        // });
    }

    selectPlan = (planid, name, desc, price)=>{
      this.setState({ activeClass: planid})
      planId = planid
      plan_name = name
      plan_desc = desc
      plan_price = price
    }

   _fetchData = async () => {
     planId = this.props.planid
     let details = this.props.details
     if (details != undefined){
      plan_name = details.name
      plan_desc = details.desc
      plan_price = details.price
    }
    const subp = firebase.firestore().collection('subscription_plans');
    const snapshot = await subp.get();
    if (snapshot.empty) {
      console.log('No matching documents.');
      return;
    }
    snapshot.forEach(doc => {
      list = [...this.state.plan];
      let items = doc.data();
      items = JSON.stringify(items);
      list.push(JSON.parse(items))
      this.setState({ plan: list })
    });
     //this.setState({plan: list.reverse()})
    // setplan(list.reverse())
  }
     componentDidMount(){
       this._fetchData()
     }

    renderForm(props) {
      const { t, i18n, resultid, planid} = this.props;
      
        return (
          <div className="makeStyles-paper-202" >
            {/* <div className="modalTitle"> {t("NeuraCovid")}</div> */}
            
            <div className="modalMakepayemnt" style={{ padding: "5 %" }}>
              {t("Subscription plan ")}
              <button className="payclose" disabled={this.state.disabled} onClick={props.handleClose} style={{marginTop:0}} > x </button>
            </div>
           
            <div>
             
              {this.state.plan.map((Plans) => (
               

                <div className={this.state.activeClass  == Plans.Plan_ID  ? 'plan_card active' : 'plan_card'} onClick={() => this.selectPlan(Plans.Plan_ID,Plans.Plan_name,Plans.Plan_description,Plans.Price_per_item)}>
                  <div className="row row_2 clearfix" >
                    
                    <span className="_lt year">
                      <span className="status">
                        
                      </span>
                      <span className="plan_title"> {Plans.Plan_name} </span>
                        <span style={{fontSize:14}}> {Plans.Total_scans} Scans includes</span>  
                    </span>
                      <strong className="_rt"> ${Plans.Price_per_item}</strong>
                  </div>
                </div>
    
              ))}
            </div>
            <PayPalButton
              options={{ vault: true }}
              style= {{
                shape: 'pill',
                color: 'blue',
                layout: 'vertical',
                label: 'subscribe'
              }}
              createSubscription={(data, actions) => {
                return actions.subscription.create({
                  plan_id: planId,
                });
              }}
              onApprove={this.onApprove}
              onError={this.onError}
              onCancel={this.onCancel}
            />
          </div>
        );
    }

    renderSuccess1(props) {
      const { t, i18n, resultid, source } = this.props;
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
          source={source}
        />
         
      );
    }
    
  renderSuccess2(props) {
    const { t, i18n, resultid, source } = this.props;
    this.props.setDisabled(false);
    return (
      
        
          <SubscriptionSuccess
            resultid={resultid}
            t={t}
            i18n={i18n}
            lang={this.props}
            resultShow={this.state.resultShow}
            loading={this.state.loading}
            handleResult={() => this.handleResult}
            handleClose={props.handleClose}
            source={source}
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
      const { t, i18n, resultid, source } = this.props;
      this.props.setDisabled(false);
      return (
        <PaymentModal 
        t={t} 
        i18n={i18n} 
        open={props.handleClose}
        resultid={resultid} 
        resultShow={this.state.resultShow} 
        source={source}/>
      );
    }
    
    render() {
      const { t, i18n, resultid, source } = this.props;
        return (
            <div className="checkout-form">
                <div className="sr-payment-form">
                    {/* {this.state.succeeded && this.renderSuccess(this.props)} */}
                    {this.state.succeeded && source === "home" &&
                    this.renderSuccess1(this.props)}
                    {this.state.succeeded && source === "subscribe" &&
                      this.renderSuccess2(this.props)}

                    {this.state.paymentCancle && source === "home" &&
                    this.renderCancle(this.props)}

                    {!this.state.succeeded &&
                        this.state.paymentStatus === "" &&
                        this.renderForm(this.props)}
                    {/* {this.state.paymentStatus === "error" && this.renderFailed(this.props)} */}
                    {this.state.paymentStatus === "error" &&
                        this.renderFailed(this.props)}
                </div>
            </div>
        );
    }
}

export default PaypalSubscription