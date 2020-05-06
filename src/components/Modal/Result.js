import React, { Component } from 'react'
import { Button, CircularProgress, TableRow, LinearProgress, Table, TableBody, TableCell, TableContainer, } from "@material-ui/core";
import { firebase } from '@firebase/app';

let file;
export class Result extends Component {
    constructor(props) {
        super(props)
        this.state = ({
            user: '',
            result:[],
            resultid:this.props.resultid,
            patientName:'',
            patientAge:'',
            patientMail:'',
            normal:'',
            pneumonia:'',
            covid:'',
            prediction:'',



        })
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user.uid })
            this._fetchData(this.state.user)
        })

    }
    _fetchData = async (user) => {
        try {
            await firebase.firestore().collection('stripe_customers').doc(user).collection('results').onSnapshot(snapshot => {
                snapshot.forEach(doc => {

                    if (doc.id == this.state.resultid){
                        file = JSON.stringify(doc.data())
                        
                        this.setState({ result: JSON.parse(file)})
                        this.setState({
                            patientName: this.state.result.userDetails.patient_name,
                            patientAge: this.state.result.userDetails.patient_age,
                            patientMail: this.state.result.userDetails.patient_mail
                        })

                        if (this.state.result.detections != undefined)  {
                            if (this.state.result.detections && this.state.result.detections.confidence) {
                                this.setState({
                                    normal: this.state.result.detections.confidence.normal,
                                    pneumonia: this.state.result.detections.confidence.pneumonia,
                                    covid: this.state.result.detections.confidence.covid
                                })
                            }


                            if (this.state.result.detections && this.state.result.detections.prediction) {
                                this.setState({
                                    prediction: this.state.result.detections.prediction
                                })
                            }
                        }
                        
                        
                    }
                    
                })
            })


        }
        catch (error) {
            console.error(error);

        }



    }
    render() {
        const { t, i18n } = this.props;
        return (
            <div className="resultWrapp">
                <img src={require('../../assets/images/report_data.png')} />
                <div className="paymentSuccWrap">
                    <div className="paymentSuccTitle">{t("Inference/Report")} </div>
                    <hr/>
                    <div className="patientDetailsWrapp"> 
                        <div className="paymentSuccDesc">{t("Patient Name")} : {this.state.patientName}({this.state.patientAge})</div>
                        <div className="paymentSuccDesc">{t("Email")} : {this.state.patientMail} </div>
                        <hr/>
                    </div>
                    <div className="resultStat">

                        <table className="tbleresult">
                            <tbody>
                                <tr tabIndex={-1} >
                                    <td> {t("Normal")} </td>
                                    <td> <LinearProgress variant="determinate" value={Number(this.state.normal)} className="nomal" /> </td>
                                    <td> {this.state.normal} %</td>
                                </tr>
                                <tr tabIndex={-1} >
                                    <td> {t("Pneumonia")} </td>
                                    <td> <LinearProgress variant="determinate" value={Number(this.state.pneumonia)} className="pneumonia" /> </td>
                                    <td> {this.state.pneumonia} %</td>
                                </tr>
                                <tr tabIndex={-1} >
                                    <td> COVID-19  </td>
                                    <td> <LinearProgress variant="determinate" value={Number(this.state.covid)} color="secondary" className="covid" /> </td>
                                    <td> {this.state.covid} %</td>
                                </tr>
                            </tbody>
                        </table>
                       <hr/>
                    </div>
                    <h3 style={{textTransform:'capitalize'}}> {t("Prediction")}: {this.state.prediction} </h3>
                   
                       
                    
                </div>

                
            </div>
        )
    }
}

export default Result
