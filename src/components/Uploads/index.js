import React, { Component } from 'react'
import { Container } from 'react-bootstrap';
import {Table,TableBody,TableCell,TableContainer,TableHead,TablePagination,TableRow} from '@material-ui/core';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { firebase } from '@firebase/app';

const columns = [
    { id: 'srno', label: 'Sr.No.', minWidth: 50 },
    {
        id: 'currentTime',
        label: 'Date_Time',
        minWidth: 100,
        // align: 'right',
        // format: (value) => value.toLocaleString(),
    },
    { id: 'patient_name', label: 'Patient Name', minWidth: 170 },
    { id: 'age', label: 'Patient Age', minWidth: 100 },
    {
        id: 'email',
        label: 'Email ID',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toLocaleString(),
    },
    {
        id: 'fileNames',
        label: 'File Name',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
    {
        id: 'file',
        label: 'File',
        minWidth: 170,
        align: 'right',
        // format: (value) => value.toFixed(2),
    },
];

const appTokenKey = "appToken";
let file;
var v=0;
let user="";
let uploadlist=[]
export class index extends Component {
constructor(props){
    super(props)
    this.state=({
        user:'',
        files:[],
        list:[],
        isOpen: false,
        photoIndex: "",
        page:0,
        rowsPerPage:5
    })
    this.handleClick = this.handleClick.bind(this)
   

   
   
}

    handleChangePage = (event, newPage) => {
        this.setState({page:newPage});
    };
    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage:+event.target.value});
        this.setState({page:0});
    };

    _fetchData = async(user)=>{
    try{
        await firebase.firestore().collection('stripe_customers').doc(user).collection('files').get().then(snapshot => {
            this.setState({ files: [] })
           

            snapshot.forEach(doc => {
                let list = [...this.state.list.reverse()];
                let items = doc.data();
                items = JSON.stringify(items);
                list.push(JSON.parse(items))
                this.setState({ list: list.reverse()}) 
            })
        })
    }
    catch(error){
        console.error(error);
    }
       
        


   }
   componentDidMount(){
       firebase.auth().onAuthStateChanged(user => {
           this.setState({ user: user.uid })
           user = user.uid
           this._fetchData(this.state.user)

       })
   }
    
   handleClick=(e)=>{
    this.setState({ isOpen: true,photoIndex:e })

    }
   
    render() {
        const { t, i18n } = this.props;
        
        return (
            
            <Container fluid="true" style={{paddingTop: '0px !important'}}>
                <div>
                    <h4 className="title">{t("Uploads List")} </h4>
                    <div> 
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead syle={{backgroundColor:'#000 !important',color:'#fff',}}>
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
                                   
                                    
                                    {this.state.list.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row,i) => {
                                      
                                       return(
                                           <TableRow hover role="checkbox" tabIndex={-1} key={row.currentTime}>
                                             
                                               {columns.map((column) => {
                                               const value = row[column.id];
                                                   return (
                                                      
                                                       <TableCell key={column.id} align={column.align}>
                                                           {column.format && typeof value === 'number' ? column.format(value) : value}
                                                           {column.id == "srno" ? v=i+1 : ""}
                                                           {column.id == "file" ? <div className="cursor" onClick={() => this.handleClick(row.url)}>  <img src={row.url} style={{ height: '40px', width: '80px' }} /></div> : ""}
                                                           {this.state.isOpen && (<Lightbox
                                                               mainSrc={this.state.photoIndex}
                                                               onCloseRequest={() => this.setState({ isOpen: false })}
                                                           />)}
                                                          
                                                       </TableCell>

                                                   );
                                            })}
                                              
                                           </TableRow>
                                        
                                       )
                                  
                                 })}    

                                   
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5,10, 15]}
                            component="div"
                            count={this.state.list.length}
                            rowsPerPage={this.state.rowsPerPage}
                            page={this.state.page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            </Container>
        )
    }
}

export default index
