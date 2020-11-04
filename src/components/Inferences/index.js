import React, { Component } from 'react'
import { Container } from 'react-bootstrap';
import { makeStyles,Modal, Backdrop,Table,TableBody,TableCell,TableContainer,TableHead,TablePagination,TableRow,Button} from '@material-ui/core';
import Skeleton from 'react-loading-skeleton';
import { firebase } from '@firebase/app';
import Result from '../Modal/Result';
import PaymentModal from '../Modal/PaymentModal';

const columns = [
    { id: 'srno', label: 'Sr.No.', minWidth: 50 },
    {
        id: 'date',
        label: 'Date_Time',
        minWidth: 70,
        // align: 'right',
        // format: (value) => value.toLocaleString(),
    },
    { id: 'pname', label: 'Patient Name', minWidth: 100 },
    {
        id: 'age',
        label: 'Age',
        minWidth: 100,
        // align: 'right',
        // format: (value) => value.toLocaleString(),
    },
    {
        id: 'imageType',
        label: 'X-Ray/CT Scan',
        minWidth: 100,
    },
    {
        id: 'prediction',
        label: 'Predictions',
        minWidth: 170,
        // align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'feedbacks',
        label: 'Ground Truth',
        minWidth: 120,
        // align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'detection',
        label: 'Detections',
        minWidth: 170,
        // align: 'right',
        format: (value) => value.toFixed(2),
    }
];


const styles ={
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '550px',
        margin: 'auto',
        borderRadius: '5px',
        border: 'none'
    },
    paper: {
        border: '2px solid #000',
        width: '400px',
    },
   
}

const appTokenKey = "appToken";
var v = 0;
let result;

let resultList =[]

export class index extends Component {
constructor(props){
    super(props)
    this.state=({
        user:'',
        results: [],
        res: [],
        isOpen:false,
        isOpenPayment:false,
        resultId:'',
        page: 0,
        rowsPerPage: 5
    })
    firebase.auth().onAuthStateChanged(user => {
        this.setState({ user: user.uid })
        this._fetchData(this.state.user)
    })
}

    handleClose = () => {
        this.setState({ isOpen: false});
        // props.open=false
    };
    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };
    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: +event.target.value });
        this.setState({ page: 0 });
    };
_fetchData = async(user)=>{
   try{
       firebase.firestore().collection('stripe_customers').doc(user).collection('results').orderBy('date_time_userId').onSnapshot(snapshot => {
           this.setState({ results: [] })
            snapshot.forEach(doc => {
                let list = [...this.state.results.reverse()];
                let items = doc.data();
                items = JSON.stringify(items);
                list.push(JSON.parse(items))
                this.setState({ results: list.reverse() })
            })
        });
   }
   catch(error){
       console.error(error);
       
   }
   
  }

   
    viewdetection=(e) => {
        this.setState({ isOpen: true, resultId: e })

    }

    makepayment = (e) => {
        this.setState({ isOpenPayment: true, resultId: e })

    }
    paymenthandleClose = (val) => {
        this.setState({ isOpenPayment: val })
        // props.open=false
        //window.location.reload();
    };

    render() {
        const { t, i18n } = this.props;
        return (
            
            <Container fluid="true">
                <div>
                    <h4 className="title">{t("Inference List")}  </h4>
                    <div> 
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table" className="tblInfer">
                                <TableHead syle={{backgroundColor:'#000 !important',color:'#fff'}}>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {t(column.label)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.results.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, i) => {
                                        if (row.payment == "succeeded" && row.detections) {
                                        return (
                                            <TableRow hover  tabIndex={-1} key={i} >       
                                                <TableCell style={{ padding: '5px 15px' }}> {v=i+1}</TableCell>
                                                <TableCell > {row.date_time_userId ? row.date_time_userId.date: <Skeleton />} </TableCell>
                                                <TableCell > {row.userDetails ? row.userDetails.patient_name : <Skeleton />} </TableCell>
                                                <TableCell > {row.userDetails ? row.userDetails.patient_age : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? row.detections.imageType : <Skeleton /> } </TableCell>
                                                <TableCell style={{textTransform:"capitalize"}}> {row.detections ? t(row.detections.prediction) : <Skeleton /> } </TableCell> 
                                                <TableCell style={{ textTransform: "capitalize" }}> {row.feedbacks ? t(row.feedbacks.feedback) : <Skeleton />} </TableCell> 

                                                <TableCell > <Button className="btnView" onClick={() => this.viewdetection(row.date_time_userId.date)}>{t("View Detections")}</Button></TableCell> 
                                            </TableRow>
                                        )
                                    } else if (row.subscription == "succeeded" && row.detections) {
                                        return (
                                            <TableRow hover  tabIndex={-1} key={i} >       
                                                <TableCell style={{ padding: '5px 15px' }}> {v=i+1}</TableCell>
                                                <TableCell > {row.date_time_userId ? row.date_time_userId.date: <Skeleton />} </TableCell>
                                                <TableCell > {row.userDetails ? row.userDetails.patient_name : <Skeleton />} </TableCell>
                                                <TableCell > {row.userDetails ? row.userDetails.patient_age : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? row.detections.imageType : <Skeleton /> } </TableCell>
                                                <TableCell style={{textTransform:"capitalize"}}> {row.detections ? t(row.detections.prediction) : <Skeleton /> } </TableCell> 
                                                <TableCell style={{ textTransform: "capitalize" }}> {row.feedbacks ? t(row.feedbacks.feedback) : "--"} </TableCell> 

                                                <TableCell > <Button className="btnView" onClick={() => this.viewdetection(row.date_time_userId.date)}>{t("View Detections")}</Button></TableCell> 
                                            </TableRow>
                                        )
                                    }
                                        else if (row.payment == "succeeded") {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={i}>       
                                                <TableCell>{v=i+1}</TableCell>
                                                <TableCell > {row.date_time_userId? row.date_time_userId.date: <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_name : <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_age : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? row.detections.imageType : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? t(row.detections.prediction) : <Skeleton /> } </TableCell>
                                                <TableCell style={{ textTransform: "capitalize" }}> {row.feedbacks ? t(row.feedbacks.feedback) : "--"} </TableCell> 

                                                <TableCell ><span style={{padding:'6px 8px'}}>  {t("Results in process")}</span> </TableCell>  
                                            </TableRow>
                                        )
                                    }  else if (row.subscription == "succeeded") {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={i}>       
                                                <TableCell>{v=i+1}</TableCell>
                                                <TableCell > {row.date_time_userId? row.date_time_userId.date: <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_name : <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_age : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? row.detections.imageType : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? t(row.detections.prediction) : <Skeleton /> } </TableCell>
                                                <TableCell style={{ textTransform: "capitalize" }}> {row.feedbacks ? t(row.feedbacks.feedback) : "--"} </TableCell> 

                                                <TableCell ><span style={{padding:'6px 8px'}}>  {t("Subscribed")}</span> </TableCell>  
                                            </TableRow>
                                        )
                                    }
                                    else if(row.payment == "error" ) {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={i}>       
                                                <TableCell>{v=i+1}</TableCell>
                                                <TableCell > { row.date_time_userId? row.date_time_userId.date: <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_name : <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_age : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? row.detections.imageType : <Skeleton /> } </TableCell>
                                                <TableCell > - </TableCell>
                                                <TableCell > - </TableCell>
                                                <TableCell > <span style={{padding:'6px 8px'}}>  {t("Payment Fail")}</span> </TableCell>  
                                            </TableRow>
                                        )
                                        } else if (row.payment == "pending" && row.subscription == "pending" ) {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={i}>       
                                                <TableCell>{v=i+1}</TableCell>
                                                <TableCell > { row.date_time_userId? row.date_time_userId.date: <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_name : <Skeleton />} </TableCell>
                                                <TableCell > { row.userDetails ? row.userDetails.patient_age : <Skeleton /> } </TableCell>
                                                <TableCell > {row.detections ? row.detections.imageType : <Skeleton /> } </TableCell>
                                                <TableCell > - </TableCell>
                                                <TableCell > - </TableCell>
                                                <TableCell > <Button className=" btnmkpay" onClick={() => this.makepayment(row.date_time_userId.date)}>{t("Make Payment")}</Button> </TableCell>  
                                            </TableRow>
                                        )
                                    } 
                                }, )}      
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={this.state.results.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                        {this.state.isOpenPayment && <PaymentModal t={t} i18n={i18n} resultid={this.state.resultId} open={this.paymenthandleClose} source="home"/> }
                        {this.state.isOpen &&
                            <Modal
                                aria-labelledby="spring-modal-title"
                                aria-describedby="spring-modal-description"
                                style={styles.modal}
                                open={this.state.isOpen}
                                onClose={this.handleClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                            <Result t={t} i18n={i18n} resultid={this.state.resultId}/>
                            </Modal>
                        
                        }
                    
                    </div>
                </div>
            </Container>
        )
    }
}

export default index
