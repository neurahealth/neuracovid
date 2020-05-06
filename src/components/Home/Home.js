import React, { Component } from 'react'
import Dropzone from "react-dropzone";
import { AppBar, Tabs, Tab, Typography, Box, TextField, Checkbox, FormControlLabel, Radio, RadioGroup, FormLabel } from "@material-ui/core";
import { Container,  Row, Col, Card, Button, ProgressBar,Spinner } from 'react-bootstrap';
import './home.css'
import PaymentModal from '../Modal/PaymentModal';
import { firebase } from '@firebase/app';
import 'firebase/auth';        // for authentication
import 'firebase/storage';     // for storage
import 'firebase/firestore'; 
import moment from 'moment-timezone'; 
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

let url = "";

export class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: 0,
            file: "",
            fileName: "",
            filepath: "",
            open:false,
            fileRef: '',
            filenames: "",
            downloadURLs: "",
            fullPaths: "",
            currentTime:"",
            fileSuccess: false,
            patientName: "",
            gender: "male",
            age: "",
            email: "",
            checked: false,
            fileuploaded: false,
            progress:false
        }

        this.getInitial = this.getInitial.bind(this); 
        this.onDrop = this.onDrop.bind(this);
        this.handlePatientDetails = this.handlePatientDetails.bind(this);
        // this.handleGender = this.handleGender.bind(this);
        // this.notify = this.notify.bind(this)
    }

    componentDidMount() {
        this.getInitial();
    }

    getInitial() {

        // alert("Before uploading Images please agree to the disclaimers");
        firebase.auth().onAuthStateChanged(user => {
          let userId = user.uid;
          // var currentDate = moment().format("YYYY-MM-DD");
          let currentTime = moment().tz("America/New_York").format('YYYY-MM-DD_HH:mm:ss');
          let time = currentTime.split("_")[1]
          let date = currentTime.split("_")[0]
          let fileRef = `images/${userId}/${date}/${time}`;
          this.setState({ fileRef, currentTime});
          firebase.firestore().collection('stripe_customers').doc(userId).onSnapshot(snapshot => {
                this.stripeCustomerInitialized = (snapshot.data() !== null);
              }, () => {
                this.stripeCustomerInitialized = false;
              });
              firebase.firestore().collection('stripe_customers').doc(userId).collection('files').onSnapshot(snapshot => {
              let newCharges = {};
               snapshot.forEach(doc => {
                 const id = currentTime;
                 newCharges[id] = doc.data();
               })
               this.charges = newCharges;
              }, () => {
                this.charges = {};
              });
        });
      }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    handleGender = (event) => {
        this.setState({ gender: event.target.value })
    };

    async handlePatientDetails(event) {
        await this.setState({
           [event.target.name]: event.target.value
         });
    }

    checkAge=(e)=>{
        const { t, i18n } = this.props;
        var toastId = null;
        this.notifyAge = () => this.toastId = toast.error(t("Please enter valid Age"), {  autoClose: 3000 });
        if(e.target.value != "" && (isNaN(e.target.value) || e.target.value <1 || e.target.value.length > 3 || e.target.value > 120)){
        // alert("Enter valid age");
        e.target.value=""
        return this.notifyAge();
        }
    }

    onChange(ev) {
        this.setState({checked: ev.target.checked});
    }

    // toastId = null;
    // notify = () => this.toastId = toast.error("Please accept disclaimers by checking the checkboxes", {  autoClose: 3000 });

    async validateDetails() {  
        const { t, i18n } = this.props;
        var toastId = null;
        this.notifyDetails = () => this.toastId = toast.error(t("Please fill the patient details properly"), {  autoClose: 3000 });
        this.notifyEmail = () => this.toastId = toast.error(t("Please enter valid Email"), {  autoClose: 3000 });
        this.notifyFileUpload = () => this.toastId = toast.error(t("Please upload File"), {  autoClose: 3000 });
        this.notifyDisclaimer = () => this.toastId = toast.error(t("Please accept disclaimer by checking the checkbox"), {  autoClose: 3000 });
        if (this.state.patientName === "" || this.state.age === ""){
            return this.notifyDetails();
        }else if(this.state.email != "" && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))){
            return this.notifyEmail();
        }else if(this.state.fileuploaded == false){
            return this.notifyFileUpload();
        }else if(this.state.checked == false){
            return this.notifyDisclaimer();
        }else{
            this.setState({ progress:true})
            this.SaveImage();
            setTimeout(() => {
                this.setState({ progress: false })
                this.setState({ open: !this.state.open })
            }, 5000);
        }
    }  

    async SaveImage(){
        let userId = await firebase.auth().currentUser.uid;
        let currentTime = this.state.currentTime
        let fileName = this.state.fileName
        const patientName = this.state.patientName
        const email = this.state.email
        const age = this.state.age
        const gender = this.state.gender
        let time = currentTime.split("_")[1]
        let date = currentTime.split("_")[0]
        // firebase.firestore().collection('stripe_customers').doc(userId).collection('results').doc(currentTime).set({
        //     payment: "pending",
        //     userDetails: { patient_name:this.state.patientName, patient_age: this.state.age, patient_mail:this.state.email },
        //     date_time_userId:{
        //       date:this.state.currentTime,
        //       userId:userId,
        //     }
        // });
        let fileRef = `images/${userId}/${date}/${time}`;
        let storageRef = firebase.storage().ref(`images/${userId}/${date}/${time}/` + this.state.fileName);
        // storageRef.put(file);

        storageRef.put(this.state.file).then(function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // this.setState({
            //     progress: progress
            // });
        }).then(function () {
            // Upload completed successfully, now we can get the download URL
            storageRef.getDownloadURL().then(function (downloadURL) {
                url = downloadURL
            });
            storageRef.getMetadata().then(function (val) {
                var path = val.fullPath.split(fileName)[0]
                let data = {
                    fileNames: fileName,
                    url: url,
                    bucket: val.bucket,
                    fullPaths: val.fullPath,
                    currentTime: currentTime,
                    time: time,
                    date: date,
                    path: path,
                    patient_name: patientName,
                    email: email,
                    age: age,
                    gender: gender
                }
                firebase.firestore().collection('stripe_customers').doc(userId).collection('results').doc(currentTime).set({
                    payment: "pending",
                    userDetails: { patient_name:patientName, patient_age: age, patient_mail:email },
                    date_time_userId:{
                      date:currentTime,
                      userId:userId,
                    }
                });
                let filesAdded2 = firebase.firestore().collection('stripe_customers').doc(userId).collection('files').doc(currentTime).set(data);
            });

        });
    }
    async onDrop(acceptedFiles){
        acceptedFiles.forEach(file => {
            this.setState({
                file: file,
                fileName:file.name,
                fileuploaded: true,
                filepath: URL.createObjectURL(file)
            });
        })
    }

    handlePayment = () => {
         this.validateDetails();
        //this.setState({ open: !this.state.open })
        
    }
     handleClose = () => {
         this.setState({ open: false })
        // props.open=false
         window.location.reload();
    };
    render() {
        const { t, i18n } = this.props;
        return (
            <div className="uploadWrapper">
                <ToastContainer />
                <Row>
                    <Col xs={12} sm={12} md={4}>
                    <div>
                            <iframe width="100%" height="215" src="https://www.youtube.com/embed/9erwBwCPPzU" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                        <h3>{t("Upload Chest X-ray Image JPEG Format")} </h3>
                        <div>
                            {t("Upon entering Patient details and image upload, you will be prompted to make payment. Upon successful payment, results will be displayed.")}

                            </div>
                    </Col>
                    <Col xs={12} sm={12} md={8}>
                        <Row>
                            <Col xs={12} sm={12} md={6}>
                                <div className="patientDetails">
                                    <TextField id="standard-basic" autoComplete="off" name="patientName" label={t("Name of Patient")} className="inputBox" onChange={this.handlePatientDetails} />
                                    <Row className="inputGroup">
                                        {/* <TextField id="standard-basic" autoComplete="off" name="gender" label="Gender" className="inputBoxHalf" onChange={this.handlePatientDetails}/> */}
                                        <Col xs={12} sm={12} md={5}>
                                            <TextField id="standard-basic" autoComplete="off" name="age" label={t("Age")} type="number" className="inputBoxHalf" onBlur={this.checkAge} onChange={this.handlePatientDetails} />
                                        </Col>
                                        <Col xs={12} sm={12} md={7} style={{ display: "flex", alignItems: "center", marginTop: '10px', marginRight: '-40px' }}>
                                            {/* <div className="radioBox">Gender</div> */}
                                            <RadioGroup row style={{ width: '100%' }} aria-label="gender" name="gender1" value={this.state.gender} onChange={this.handleGender}>
                                                <FormControlLabel value="male" control={<Radio />} label={t("Male")} />
                                                <FormControlLabel value="female" control={<Radio />} label={t("Female")} />
                                            </RadioGroup>
                                        </Col>
                                    </Row>
                                    <TextField id="standard-basic" autoComplete="off" name="email" label={t("Email address")} className="inputBox" onChange={this.handlePatientDetails} />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6}>
                                <Dropzone onDrop={this.onDrop} accept='image/jpeg' multiple={false} className="mt5">
                                    {({ getRootProps, getInputProps }) => (
                                        <section className="container">
                                            <div {...getRootProps({ className: "dropzone" })}>
                                                <input {...getInputProps()} />
                                                <p style={{ textAlign: 'center' }}> {t("Click here Upload Image")} {t("Drag 'n' drop file here")}</p>

                                                <aside>
                                                    <img alt="" src={this.state.filepath} className="imgPreview" alt={this.state.fileName} />
                                                   
                                                </aside>
                                            </div>

                                        </section>
                                    )}
                                </Dropzone>
                            </Col>
                        </Row>
                       
                        <Row style={{marginBottom:'10%'}}>
                            <Col xs={12} sm={12} md={6}>
                                <div className="aggree">
                                    <FormControlLabel
                                        control={<Checkbox name="checkedA" />}
                                        label={t("I agree Neura Health to run AI prediction on my provided Chest X-Ray Image. Please note that the inference/result is provided by running Inference using AI Model and not by any Doctor, Physician or Radiologist.")}
                                        checked={this.state.checked}
                                        onChange={this.onChange.bind(this)}
                                        className="termText"
                                    />
                                </div>
                                <Button variant="contained" className="paymentBtn" onClick={this.handlePayment}>{t("Proceed to payment")} 
                                
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        role="status"
                                        variant="light"
                                        aria-hidden="true"
                                        hidden={this.state.progress ? false : true }
                                    />

                                 </Button>
                                {this.state.open ? <PaymentModal t={t} i18n={i18n} open={this.handleClose} resultid={this.state.currentTime} /> : ''}

                            </Col>
                            <Col xs={12} sm={12} md={6}>
                               
                            </Col>
                        </Row>

                            
                            
                          
                    </Col>
                    {/* <Col xs={12} sm={12} md={4}>

                       
                    </Col> */}
                </Row>
            </div>
        )
    }
}

export default Home

