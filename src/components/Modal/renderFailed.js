import React from 'react'
import { Button, CircularProgress } from "@material-ui/core";

    function renderFailed(props) {

         const { t, i18n, resultid } = props.lang;
      const { resultShow, paymentStatus } = props;
       
        
        const handlefailed =()=>{
           let status = ""
          props.handlefailed(status)
        }
        
        return (
          <div className="successModal">
           
            <div style={{display: !resultShow ? "block" : "none", width: 400 }}>
              <img
                src={require("../../assets/images/payment_failed.png")}
                style={{ width: "100%" }}
              />
              <div className="paymentSuccWrap">
                <div className="paymentSuccTitle">{t("Payment failed")} </div>
                <div className="paymentSuccDesc">
                  {t("Your payment was failed! Please try again.")}
                </div>
              </div>

              <div className="paymentSuccBtnWrap">
                <Button className="payBtn" onClick={handlefailed}>
                  {t("Retry Payemnt")}
                </Button>
              </div>
            </div>
            {/* <pre className="sr-callout">
          <code>{JSON.stringify(this.state.metadata, null, 2)}</code>
        </pre> */}
            {/* {this.state.resultShow &&
                    <Result resultid={resultid} />
                } */}
          </div>
        );
    
}

export default renderFailed
