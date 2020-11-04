import React, { Component } from 'react'
import { Container } from 'react-bootstrap';
import {Table,TableBody,TableCell,TableContainer,TableHead,TablePagination,TableRow} from '@material-ui/core';
import { firebase } from '@firebase/app';
const currencyToAppend = '€';
const columns = [
    { id: 'srno', label: 'Sr.No.', minWidth: 50 },
    {
        id: 'resultId',
        label: 'Date_Time',
        minWidth: 70,
        // align: 'right',
        // format: (value) => value.toLocaleString(),
        
    },
    { id: 'billing_details1', 
      label: 'First Name on Card', 
      minWidth: 100,
     },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 150,
        // align: 'right',
        format: (value) => "$"+value/100,
        
    },
    {
        id: 'status',
        label: 'Payments Status',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
    {
        id: 'source',
        label: 'Payment Source',
        minWidth: 100,
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
    {
        id: 'balance_transaction',
        label: 'Transaction ID',
        minWidth: 170,
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
];

const appTokenKey = "appToken";
let charge;
var v=0;
export class index extends Component {
constructor(props){
    super(props)
    this.state=({
        user:'',
        charges:[],
        page: 0,
        rowsPerPage: 5

    })
    firebase.auth().onAuthStateChanged(user => {
        this.setState({ user: user.uid })
        this._fetchData(this.state.user)
    })
    
}

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };
    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: +event.target.value });
        this.setState({ page: 0 });
    };
        _fetchData = async(user)=>{
        try{
            await firebase.firestore().collection('stripe_customers').doc(user).collection('charges').onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    let list = [...this.state.charges.reverse()];
                    let items = doc.data();
                    items = JSON.stringify(items);
                    list.push(JSON.parse(items))
                    this.setState({ charges: list.reverse() })
                })
        });
            
            
        }
        catch(error){
            console.error(error);
            
        }

        }


    render() {
        const { t, i18n } = this.props;
        return (   
            <Container fluid="true">
                <div>
                    <h4 className="title">{t("Payment List")}  </h4>
                    <div> 
                        <TableContainer >
                            <Table stickyHeader aria-label="sticky table">
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
                                    {this.state.charges.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, i) => {

                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.currentTime}>
                                               
                                                  
                                                        <TableCell>{v = i + 1} </TableCell>
                                                        <TableCell > {row.resultId} </TableCell>
                                                        <TableCell > {row.billing_details ? row.billing_details.name : row.payerName} </TableCell>
                                                        <TableCell > ${(row.amount && row.status == 'succeeded') ? row.amount / 100 : 0} </TableCell>
                                                        <TableCell > {t(row.status)} </TableCell>
                                                        <TableCell > {row.paymentSource ? row.paymentSource : "-"} </TableCell>
                                                        <TableCell > {row.balance_transaction ? row.balance_transaction : "-"} </TableCell>

                                              
                                            </TableRow>

                                        )

                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15]}
                            component="div"
                            count={this.state.charges.length}
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
