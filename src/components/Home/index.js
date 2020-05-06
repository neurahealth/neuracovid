import React, { Component } from 'react'
import { Container,  } from 'react-bootstrap';
import './home.css'
import Header from "../Headers/Header";
import Footer from '../Headers/Footer';
import PropTypes from 'prop-types';
import { AppBar,Tabs,Tab,Typography,Box } from "@material-ui/core";
import Uploads from "../Uploads/";
import Payments from "../Payments/";
import Inferences from "../Inferences/";
import Faq from "../Faq/";

import Home from './Home';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { withTranslation, Trans } from "react-i18next";

const appTokenKey = "appToken";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={5}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export class index extends Component {
  
    constructor(props){
        super(props)
        this.state={
            value:0,
        }
        if (localStorage.getItem('lang')) {
            var lang = localStorage.getItem('lang')
            this.props.i18n.changeLanguage(lang);
        }
    }
componentDidMount(){
    
}
    handleChange = (event, newValue)=>{
        this.setState({ value: newValue})
    }

    render() {
        const { t, i18n } = this.props;
        const {value} = this.state.value
        return (
            <Container fluid="true">
                <Header t={t} i18n={i18n}/>
                <div className={localStorage.getItem('lang') == 'es' ? "imageSliderHome-sp" : "imageSliderHome"}>
                    <div className="slideHeadingHome">{t("Fight Against")}  </div>
                    <div className="slideSubHeadingHome"> {t("Coronavirus [COVID-19] with Technology")}</div>
                </div>
                <div className="tabBarWrapper">
                    <AppBar position="static">
                        <Tabs value={this.state.value} onChange={this.handleChange} aria-label="simple tabs example" indicatorColor="primary">
                            <Tab label={t("Home")} {...a11yProps(0)} className={this.state.value === 0 ? "tabIndicator" :""} />
                            <Tab label={t("Uploads")} {...a11yProps(1)} className={this.state.value===1 ? "tabIndicator" : ""}/>
                                <Tab label={t("Payments")} {...a11yProps(2)} className={this.state.value===2 ? "tabIndicator" : ""}/>
                                <Tab label={t("Inferences")} {...a11yProps(3)} className={this.state.value===3 ? "tabIndicator" : ""}/>
                            <Tab label={t("FAQ's")} {...a11yProps(4)} className={this.state.value === 4 ? "tabIndicator" : ""} />

                            </Tabs>
                        </AppBar>
                        
                        <TabPanel value={this.state.value} index={0}>
                            <div className="tabswrapp">    
                            <Home t={t} i18n={i18n}/>   
                            </div>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={1}>
                            <div className="tabswrapp"> 
                            <Uploads t={t} i18n={i18n}/>
                            </div>
                        </TabPanel>
                        <TabPanel value={this.state.value} index={2}>
                            <div className="tabswrapp">   
                            <Payments t={t} i18n={i18n}/> 
                            </div>
                        </TabPanel>
                       <TabPanel value={this.state.value} index={3}>
                            <div className="tabswrapp">  
                            <Inferences t={t} i18n={i18n}/> 
                            </div>
                        </TabPanel>
                    <TabPanel value={this.state.value} index={4}>
                        <div className="tabswrapp">
                            <Faq t={t} i18n={i18n}/>
                        </div>
                    </TabPanel>
                 
                </div>
                <Footer t={t} i18n={i18n}/>
            </Container>
        )
    }
}

export default (withTranslation("translations")(index))
