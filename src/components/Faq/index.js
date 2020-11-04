import React, { Component} from 'react'
import { ExpansionPanel, Typography, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import { IoIosArrowDown } from "react-icons/io";
import { withTranslation, Trans } from "react-i18next";
import PropTypes from "prop-types";
 class index extends Component {
        constructor(props){
            super(props)
            this.state={
                expanded:false
            }

            var lang = localStorage.getItem('lang');
            this.props.i18n.changeLanguage(lang);
        }
       
     handleChange = (panel) => (event, isExpanded) => {
         this.setState({ expanded :isExpanded? panel : false});
    };
    render(){
        const { t, i18n } = this.props;
        const expanded = this.state.expanded
        return (
          <div>
            <h4 className="title"> {t("FAQ's")} </h4>
            <div style={{ marginTop: 15 }}>
              <ExpansionPanel
                expanded={expanded === "panel1"}
                onChange={this.handleChange("panel1")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography className="heading">
                    {t("What is NeuraCovid?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "The NeuraCovid is a web application used to detect COVID-19 from chest X-ray image. This web application is used to increase  productivity for Health Professionals and reduce time and cost for the patients. By using NeuraCovid,  the patient will detect the result from the chest X-ray image. The prediction results could be across three possibilities; Normal, Pneumonia or COVID-19."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === "panel2"}
                onChange={this.handleChange("panel2")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("How easy is it to use the NeuraCovid application?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "NeuraCovid application is very simple to use. Anyone who has existing google account can upload a chest X-ray and get the prediction for COVID-19 with confidence score. If you do not have google account, you can sign up at google.com website."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === "panel3"}
                onChange={this.handleChange("panel3")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("Are there enrollment fees to use NeuraCovid?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "No, there are no enrollment fees for using the application."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === "panel4"}
                onChange={this.handleChange("panel4")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t(
                      "What's the fee to get COVID-19 prediction using NeuraCovid application?"
                    )}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "There are 3 Monthly Subscription Plans available for Users to subscribe "
                    )}
                    : <br />
                    {t("1. Basic($25 / month for 20 X-ray or CT scans)")}
                    <br />
                    {t("2. Pro ($100/month for 100 X-ray or CT scans)")}
                    <br />
                    {t(
                      "3. Enterprise ($250/month for Unlimited X-ray or CT scans)"
                    )}
                    <br />
                    {t(
                      "If the user does not want to subscribe then User can just pay $3 per scan."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel5"}
                onChange={this.handleChange("panel5")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("How do I pay?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "You can pay using PayPal Subscription, PayPal account, Credit/Debit card."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === "panel6"}
                onChange={this.handleChange("panel6")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("How do I sign in for NeuraCovid?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t("User can sign in using Google account")}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === "panel7"}
                onChange={this.handleChange("panel7")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("What are the privacy and Security concers?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "The data is securly stored, it is saved in secure google cloud storage. The image is not shared to any other vendor or agency or used internally for any othe rpurpose other than to run an AI inference on it."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel8"}
                onChange={this.handleChange("panel8")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("How much time it takes to get result?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "Result will be display immediately upon payment in 5 seconds."
                    )}{" "}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel
                expanded={expanded === "panel9"}
                onChange={this.handleChange("panel9")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("How accurate the the NeuraCovid Prediction Results?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "The prediction results along with confidence score are based on the open source COVID-NET AI model. The results are 92.4 percent accurate."
                    )}{" "}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel10"}
                onChange={this.handleChange("panel10")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t(
                      "What are the Sensitivity and positive predictive value for the AI model?"
                    )}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "Sensitivity values are 94, 90, 90 and Positive Predictive Values are 90.4, 93.8, 90.0 for Normal, Pneumonia, COVID-19 respectively."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel11"}
                onChange={this.handleChange("panel11")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t(
                      "Where can I find more details about how AI model is built?"
                    )}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t("COVID-Net AI model details are publicly available at")}{" "}
                    https://arxiv.org/pdf/2003.09871.pdf
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel12"}
                onChange={this.handleChange("panel12")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t(
                      "Is chest X-ray looked by any physician or clinical radiologist?"
                    )}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "No, the results are based on inference obtained by AI model"
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel13"}
                onChange={this.handleChange("panel13")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("Can I use NeuraCovid to do my self diagnosis?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "Absolutely not. Please do not use NeuraCovid for self-diagnosis and seek help from your local health authorities."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel14"}
                onChange={this.handleChange("panel14")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("Is NeuraCovid approved by Regulatory agency?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t(
                      "NeuraCovid is not yet approved by Food and Drug Administration (FDA) or any other Regulatory body. We are currently looking into the product’s regulatory requirements."
                    )}
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>

              <ExpansionPanel
                expanded={expanded === "panel15"}
                onChange={this.handleChange("panel15")}
              >
                <ExpansionPanelSummary
                  expandIcon={<IoIosArrowDown />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography className="heading">
                    {t("If the question is not listed here, who to contact?")}
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Typography className="faqDesc">
                    {t("You can contact")}
                    <a
                      href="mailto:contacto@prevencionydeteccion.mx"
                      style={{
                        display:
                          localStorage.getItem("lang") === "es"
                            ? "block"
                            : "none",
                      }}
                    >
                      {" "}
                      contacto@prevencionydeteccion.mx{" "}
                    </a>
                    <a
                      href="mailto:gvarela@prevencionydeteccion.mx"
                      style={{
                        display:
                          localStorage.getItem("lang") === "es"
                            ? "block"
                            : "none",
                      }}
                    >
                      {" "}
                      gvarela@prevencionydeteccion.mx
                    </a>
                    <a
                      href="mailto:help@neurahealth.ai"
                      style={{
                        display:
                          localStorage.getItem("lang") === "es"
                            ? "none"
                            : "block",
                      }}
                    >
                      {" "}
                      help@neurahealth.ai
                    </a>
                  </Typography>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </div>
        );
    }
}
export default (withTranslation("translations")(index));
