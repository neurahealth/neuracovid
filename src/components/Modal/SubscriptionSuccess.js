import React, { useState } from "react";
import { Button, CircularProgress } from "@material-ui/core";
import Result from "./Result";

function SubscriptionSuccess(props) {
  const { t, i18n, resultid } = props;
 
  const [resultShow, setresultShow] = useState(false);

  const handleResult = () => {
      props.handleResult()
  };

  const goBack = () => {
    window.location.reload();
};

  // props.setDisabled(false)
  return (
    <div className="successModal">
      
      <div style={{  width: 400 }}>
        <div className="suucessBg" />
        {/* <img src={require("../../assets/images/payment_success.png")} style={{ width: 285, height:208 }} /> */}
        <div className="paymentSuccWrap">
          <div className="paymentSuccTitle">{t("Payment Successful")} </div>
          <div className="paymentSuccDesc">
            {t("Thank you for Subscribing, enjoy your Subscription !")}
          </div>
        </div>

        <div className="paymentSuccBtnWrap">
          <Button className="payBtn" onClick={goBack}>
            
            {t("Go Back ")}
            
          </Button>
        </div>
      </div>
      
    </div>
  );
}

export default SubscriptionSuccess;
