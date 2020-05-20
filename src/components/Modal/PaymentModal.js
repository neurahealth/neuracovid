import React, { useState, useEffect } from 'react';
import { makeStyles, Button } from '@material-ui/core';
import { Modal, Backdrop, TextField} from '@material-ui/core';
import { render } from 'react-dom';
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from './CheckoutForm';

const apiKey = ['YOUR_STRIPE_PUBLIC_KEY']     // Set Publishable key from Stripe account

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '400px',
        margin:'auto',
        borderRadius:'5px',
        border:'none'
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        width: '400px',
    },
}));


function PaymentModal(props){
    const classes = useStyles();
    const [open, setOpen] = React.useState(true);
    const { t, i18n, resultid } = props;
    const [disabled, setDisabled] = React.useState(false)
   

   const handleClose = () => {
       setOpen(false)
        props.open(false)
        // props.open=false
        //window.location.reload();
    };
    return (
           
        <Modal
            disableBackdropClick
            disableAutoFocus
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            
          
                <div className={classes.paper} id="checkout">
                <button className="close" disabled={disabled} onClick={handleClose}>x</button>
                    <StripeProvider apiKey={apiKey}>
                        <Elements>
                        <CheckoutForm t={t} i18n={i18n} resultid={resultid} setDisabled={setDisabled} />
                        </Elements>
                    </StripeProvider>
                </div>
               
            </Modal>
    )
}

export default PaymentModal
