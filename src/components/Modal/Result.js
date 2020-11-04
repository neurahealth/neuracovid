import React, { Component } from 'react'
import { Button, CircularProgress, TableRow, LinearProgress, Table, TableBody, TableCell, TableContainer, } from "@material-ui/core";
import { firebase } from '@firebase/app';
import { Row, Col} from 'react-bootstrap';
import Lightbox from "react-image-lightbox";
import Skeleton from 'react-loading-skeleton';
import Feedback from './Feedback';
let file;
let remaining_scans;
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
            geograph:{},
            isOpen: false,
            photoIndex: "",
            priview:"",
            status: "",
            totalScans: "",
            scanUpdate: false
        })
        firebase.auth().onAuthStateChanged(user => {
            this.setState({ user: user.uid })
            this._fetchData(this.state.user)
        })

    }

     componentWillUpdate(nextProps, nextState) {
        if (this.state.status == "success" && this.state.scanUpdate == false){
            this.setState({ scanUpdate: true })
            if (this.state.totalScans == "unlimited"){
                firebase.firestore().collection('stripe_customers').doc(this.state.user).collection('subscription').doc('details').update({
                    remaining_scans: "unlimited"
                });
            }else{
                firebase.firestore().collection('stripe_customers').doc(this.state.user).collection('subscription').doc('details').update({
                    remaining_scans: parseInt(remaining_scans)
                });
            }
        }
     }

    _fetchData = async (user) => {
        try {
            let subStatus
            const usersRef = firebase.firestore().collection('stripe_customers').doc(user).collection('subscription').doc('details')
                usersRef.get()
                .then((docSnapshot) => {
                  if (docSnapshot.exists) {
                    usersRef.onSnapshot((doc) => {
                        // do stuff with the data
                        let details = JSON.stringify(doc.data())
                        subStatus = JSON.parse(details).subscription
                        let totalScans = JSON.parse(details).total_scans
                        if (subStatus == "success" && this.props.source == 'home'){
                            this.setState({ status: subStatus, totalScans: totalScans });
                            firebase.firestore().collection('stripe_customers').doc(user).collection('results').doc(this.state.resultid).update({
                                subscription: "succeeded"
                            });
                            if(totalScans != "unlimited"){
                                remaining_scans = JSON.parse(details).remaining_scans
                                remaining_scans = parseInt(remaining_scans) - 1
                            }
                        }
                    });
                  } 
                  else {
                     // create the document
                    firebase.firestore().collection('stripe_customers').doc(user).collection('subscription').doc('details').set({
                        subscription: "pending"
                    });
                  }
              });

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
                        if (this.state.result.Geograph_and_Opacity != undefined){
                            this.setState({
                                geograph: this.state.result.Geograph_and_Opacity
                            })
                        }

                        if(this.state.result.heatmap_path != undefined){
                            firebase.storage().ref(this.state.result.heatmap_path).getDownloadURL()
                                .then((url) => {
                                    // let imgURL = JSON.parse(url)
                                    this.setState({ photoIndex: url });
                                });
                        }

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

    updateDetails = async (user, subStatus, remaining_scans) => {
        if (subStatus == "success"){
            await firebase.firestore().collection('stripe_customers').doc(user).collection('subscription').doc('details').update({
                remaining_scans: parseInt(remaining_scans)
            });
        }
    }

     handleClick = (e) => {
     
        this.setState({ isOpen: true, priview:e})

    }
    render() {
        const { t, i18n, showFedback, handleClose, handlefeedback } = this.props;
        return (
            <div className="resultWrapp">
                {showFedback && <Feedback handleClose={handleClose} resultid={this.props.resultid} />}
                {!showFedback &&
                <Row style={{ margin: 0}}>
                    <Col> 
                        <div className="paymentSuccWrap">
                            <div className="paymentSuccTitle">{t("Inference/Report")} </div>
                            <hr />
                            <div className="patientDetailsWrapp">
                                <div className="paymentSuccDesc" > 
                                    <div style={styles.head}>{t("Patient Name")} </div>  
                                    : {this.state.patientName ? this.state.patientName : <Skeleton />}({this.state.patientAge ? this.state.patientAge : <Skeleton />})
                                </div>
                                <div className="paymentSuccDesc"> 
                                    <div style={styles.head}>{t("Email")}</div> 
                                    : {this.state.patientMail ? this.state.patientMail : "not mention"} 
                                </div>
                                <hr />
                            </div>
                            <div className="resultStat">

                                <table className="tbleresult">
                                    <tbody>
                                        <tr tabIndex={-1} >
                                            <td style={styles.head}> {t("Normal")} </td>
                                            <td style={{width:'60%'}}> <LinearProgress variant="determinate" value={Number(this.state.normal)} className="nomal" /> </td>
                                            <td style={{ width: '100%', textAlign: 'center' }}> {this.state.normal ? this.state.normal : <Skeleton />} {this.state.normal ? "% " : <Skeleton />}     </td>
                                        </tr>
                                        <tr tabIndex={-1} >
                                            <td style={styles.head}> {t("Pneumonia")} </td>
                                            <td> <LinearProgress variant="determinate" value={Number(this.state.pneumonia)} className="pneumonia" /> </td>
                                            <td style={{ width: '100%', textAlign: 'center' }}> {this.state.pneumonia ? this.state.pneumonia : <Skeleton />} {this.state.pneumonia ? "% " : <Skeleton />}</td>
                                        </tr>
                                        <tr tabIndex={-1} >
                                            <td style={styles.head}> COVID-19  </td>
                                            <td> <LinearProgress variant="determinate" value={Number(this.state.covid)} color="secondary" className="covid" /> </td>
                                            <td style={{ width: '100%', textAlign: 'center' }}> {this.state.covid ? this.state.covid : <Skeleton />} {this.state.covid ? "% " : <Skeleton />}   </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <hr />
                                {this.state.result.Geograph_and_Opacity ?

                                    <div style={styles.detailRessult}>
                                        <div style={styles.head}> {t("Geographic and Opacity Severity")}  </div>
                                        <table className="tbleresult">
                                            <tbody>
                                                <tr tabIndex={-1} >
                                                    <td className="descTitle" style={{width: '75%'}}> {t("Geographic extent score for right + left lung (0 - 8)")}  </td>
                                                    <td >  {this.state.geograph.Geographic_extent_score ? this.state.geograph.Geographic_extent_score : <Skeleton /> } </td>

                                                </tr>
                                                <tr>
                                                    <td className="descTitle"> {t("Geographic severity")}  </td>
                                                    <td>  {this.state.geograph.Geographic_severity ? this.state.geograph.Geographic_severity : <Skeleton /> } % </td>
                                                </tr>
                                                <tr>
                                                    <td className="descTitle"> {t("Opacity extent score for right + left lung (0 - 6)")}  </td>
                                                    <td>  {this.state.geograph.Opacity_extent_score ? this.state.geograph.Opacity_extent_score : <Skeleton />} </td>
                                                </tr>

                                                <tr tabIndex={-1} >
                                                    <td className="descTitle"> {t("Opacity severity")} </td>
                                                    <td> {this.state.geograph.Opacity_severity ? this.state.geograph.Opacity_severity : <Skeleton />} %</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <hr />
                                        <table className="tbleresult">
                                            <tbody>
                                                <tr tabIndex={-1} >
                                                    <td style={styles.head} > {t("Prediction Heatmap")}  (<span style={{fontSize:10}}>{t("Click to preview")}</span>) </td>
                                                    <td style={{ cursor: 'pointer' }}> <div className="cursor" style={{ textAlign: 'end', width: 80 }} onClick={() => this.handleClick(this.state.photoIndex)}> {this.state.photoIndex ? <img className="cursor" src={this.state.photoIndex} style={{ height: '50px', width: '80px', borderRadius: 5 }} /> : <Skeleton/>}
                                                       
                                                    </div>
                                                       {this.state.isOpen ?
                                                            <Lightbox
                                                                mainSrc={this.state.priview}
                                                                onCloseRequest={() => this.setState({ isOpen: false })}
                                                            />
                                                            :''
                                                       }
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <hr />
                                        </div>
                                    : ''}
                                </div>
                            <h4 style={{ textTransform: 'capitalize' }}> {t("Prediction")}: {this.state.prediction ? this.state.prediction : <Skeleton />} </h4>
                            {this.state.result.Geograph_and_Opacity ?
                            <div style={styles.noteWrapper}>
                                <div style={styles.head}> {t("Note")}:</div>
                                <div style={styles.note}>
                                    {("Geographic Extend Score: For each lung:  0 = no involvement, 1 = Less than 25%, 2 = 25-50%, 3 = 50-75%, 4 = Greate than 75% involvement.")}
                                </div>
                                <div style={styles.note}>
                                    {("Opacity extent score: For each lung: 0 = no opacity, 1 = ground glass opacity, 2 =consolidation, 3 = white-out.")}
                                </div>
                            </div>
                            :''}
                        </div>
                    </Col>
                </Row>
                }
            </div>
        )
    }
}

export default Result

const styles = {

    noteWrapper:{
        textAlign:'start'
    },
    note:{
        fontSize:10
    },
head:{
    fontWeight:'600',
    color:'#000',

}
}