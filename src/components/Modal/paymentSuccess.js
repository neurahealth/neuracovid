import React, { useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import Result from "./Result";
import Feedback from "./Feedback";

function PaymentSuccess(props) {
  const { t, i18n, resultid } = props;
 
  const [resultShow, setresultShow] = useState(false);
  const [showFedback, setshowFedback] = useState(false)
  const handleResult = () => {
    setresultShow(true);
    props.handleResult(resultShow);
  };

  // props.setDisabled(false)

  const handlefeedback = ()=>{
    setshowFedback(true)
  }
  return (
    <div className="successModal">
      <button
        className={!resultShow ? "payclose closeSuccess" : "payclose payresult"}
        onClick={showFedback ? props.handleClose : handlefeedback}
        style={{ display: showFedback ? 'none' : 'block' }}
      >
        x
      </button>

      <div style={{ display: !resultShow ? "block" : "none", width: 400 }}>
        <div className="suucessBg" />
        {/* <img src={require("../../assets/images/payment_success.png")} /> */}
        <div className="paymentSuccWrap">
          <div className="paymentSuccTitle">{t("Payment Successful")} </div>
          <div className="paymentSuccDesc">
            {t("Your payment was Successful! You can now view the result")}
          </div>
        </div>

        <div className="paymentSuccBtnWrap">
          <Button className="payBtn" onClick={handleResult}>
            {t("View Result")}
            {props.loading && (
              <CircularProgress size={24} className="buttonProgress" />
            )}
          </Button>
        </div>
      </div>
      {/* <pre className="sr-callout">
              <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
            </pre> */}
      {resultShow && <Result t={t} i18n={i18n} resultid={resultid} showFedback={showFedback} handleClose={props.handleClose} />}

      
    </div>
  );
}

export default PaymentSuccess;
