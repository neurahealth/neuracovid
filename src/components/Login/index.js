import React, { Component } from 'react'
import { Container, Row, Col, Card, Button, } from 'react-bootstrap';
import { loginWithGoogle } from '../../helpers/auth';
import './login.css'
import { withRouter } from "react-router-dom";
import Header from "../Headers/Header";
import Footer from '../Headers/Footer';
import Loader from '../../loader/Loader';
import { firebase } from '@firebase/app';
import 'firebase/auth';
import { withTranslation, Trans } from "react-i18next";
import PropTypes from "prop-types";

const firebaseAuthKey = 'firebaseAuthInProgress';
const appTokenKey = 'appToken';
const user ="";
var lang="";
const options = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
];
   class index extends Component {
    constructor(props) {
        super(props);
        this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
       
        this.state = {
            selectedOption:'en'
        };
        lang = this.state.selectedOption
    }
    

       handleChange = async(selectedOption) => {

           localStorage.setItem('lang', selectedOption);
            lang = selectedOption;
           this.props.i18n.changeLanguage(selectedOption);
           await this.setState({selectedOption})
       };

    handleGoogleLogin() {
        loginWithGoogle()
        .catch(err => {
            localStorage.removeItem(firebaseAuthKey)
        });
        // this will set the splashscreen until its overridden by the real firebaseAuthKey
        localStorage.setItem(firebaseAuthKey, '1');
    }

    componentDidMount() {
        this.setState({ selectedOption:localStorage.getItem('lang')})
        this.props.i18n.changeLanguage(localStorage.getItem('lang'));

        if (localStorage.getItem(appTokenKey)) {
            this.props.history.push('/home');
            return;
        }       
           
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                localStorage.removeItem(firebaseAuthKey);
                localStorage.setItem(appTokenKey, user.uid);
                this.props.history.push('/home')
            }else{
                localStorage.removeItem(firebaseAuthKey);
                this.props.history.push('/login');
            }
        });
    }

    render() {
        const { t, i18n } = this.props;
        const { selectedOption } = lang
        if (localStorage.getItem(firebaseAuthKey) === '1') 
        return <Splashscreen t={t} i18n={i18n}/>;
        return <LoginPage handleGoogleLogin={this.handleGoogleLogin} t={t} i18n={i18n} options={options} handleChange={this.handleChange} selectedOption={selectedOption} selectedOptionState={this.state.selectedOption}/>;
    }
}

const LoginPage = ({ handleGoogleLogin, t, i18n, handleChange, selectedOption, selectedOptionState }) => (
    
            <Container fluid="true" className="h100">
        <Header t={t} i18n={i18n} options={options} handleChange={handleChange}/>
        <div className={lang === 'es' || localStorage.getItem('lang')==='es'? "imageSlider-sp" :"imageSlider"}>
                    <Row className="sliderWrapper">
                        <Col> 
                    <div className="slideHeading">

                        {lang === 'es' || localStorage.getItem('lang') === 'es'? 
                            <a href="https://prevencionydeteccion.mx/" target="_blank"> <img src={require('../../assets/images/pdeLogo-sp.jpg')} style={{ width: '110px', height: '110px', display: 'block', borderRadius: '5px', display: lang === 'es' || localStorage.getItem('lang') === 'es' ?'block':'none'}}/></a> 
                        :''}
                        
                        {t("Fight Against")}  </div>
                            <div className="slideSubHeading"> {t("Coronavirus [COVID-19] with Technology")}</div>
                             <div className="loginCardWrapp"> 
                                <Card style={{ width: '20rem', height: '18rem' }}>
                                    <Card.Body style={{ display: "grid"}}>
                                        <Card.Title className="cardTitle primaryColor">NeuraCovid</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted subw">{t("Built using open source")} <a href="https://github.com/lindawangg/COVID-Net" target="_blank">COVID-Net</a> {t("AI Model")} </Card.Subtitle>
                                        {/* <div className="text-dark welcomeText">Welcome back</div> */}
                                        <div className="primaryColor">
                                            {t("Use for Investigational purpose only. Not for Diagnosis.")}
                                            {/* {t("Get Covid-19 prediction in realtime using Artificial Intelligence by uploading Chest X-ray")} */}
                                        </div>
                                      
                                        <Button className="googleBtn"  onClick={handleGoogleLogin}>   
                                        <img src={require('../../assets/images/google_icon.png')} width="25" /> 
                                        {t("Login with Google")}</Button>
                                    </Card.Body>
                                </Card>

                            </div>
                        </Col>
                        
                    </Row>
               </div>
               
                {/* <div className="loginDesc">
                    <h3>CT Image Analytics for COVID-19</h3>
                </div> */}
                <Footer t={t} i18n={i18n}/>
            </Container>
        )

const Splashscreen = ({t ,i18n}) => (<Loader t={t} i18n={i18n}/>);

export default (withTranslation("translations")(index));
