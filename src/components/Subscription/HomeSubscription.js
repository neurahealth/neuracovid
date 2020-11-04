import React, { useState,useEffect} from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { Modal,AppBar, Toolbar, Typography, Button, IconButton, Card, CardActions, CardContent, CardHeader,Grid,Container} from '@material-ui/core';
import PlanList from "../Subscription/PlanList";
import { firebase } from '@firebase/app';
import { FaCheck, FaLessThanEqual } from 'react-icons/fa'
import PaymentModal from '../Modal/PaymentModal';
import Footer from '../Headers/Footer';
const useStyles = makeStyles((theme)=>({
    root:{
        flexGrow: 1,
        // display:'flex',
        // height:'100%',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    appBgColor:{
        backgroundColor: '#41B2CC !important',
        color: '#fff !important',
        height:70
    },
    container:{
        padding:'5%'
    },
    heroContent: {
        // padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
       
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),

    },
    modal: {
        display: 'flex',
        padding: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}))

let list = [];
let resultid;
let activelist = [];
let subscription = "";
 const HomeSubscription = (props) => {
    const classes = useStyles()
     const { t, i18n } = props;
     const [data, setdata] = useState()
     const [plan, setplan] = useState([])
     const [activePlan, setactivePlan] = useState()
     const [details, setdetails] = useState({ name: '', price: '', desc: '' })
     const [isOpen, setisOpen] = useState(false)
     
     const subscribe = async (plan_id, name, price, desc) => {
         setdata(plan_id)
         setdetails(prevState => ({
             ...prevState, name: name, price: price, desc: desc
         }))
         setisOpen(true)

     }
     const paymenthandleClose = (val) => {
         setisOpen(val)
     };
     const fetchPlan = async () => {
         const subp = await firebase.firestore().collection('subscription_plans');
         const snapshot = await subp.get();
         if (snapshot.empty) {
             console.log('No matching documents.');
             return;
         }
         snapshot.forEach(doc => {
             list = plan;
             let items = JSON.parse(JSON.stringify(doc.data()));
             list.push(items)
             setplan([...list])
         });
         setplan(list.reverse())
     }

     useEffect(() => {
         fetchPlan()
     }, [])
    return (
        <div className={classes.root}>
            
            <AppBar position="static" className={classes.appBgColor}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        Subscription Plans
                    </Typography>
                    <Button color="inherit" onClick={() => props.history.push('/login')}> Login</Button>
                </Toolbar>
            </AppBar>
            <div className={classes.container}>
                <Container maxWidth="md" component="main" style={{ display: !activePlan ? "block" : "none" }}>
                    <Container maxWidth="sm" component="main" className={classes.heroContent}>
                        <Typography component="h3" variant="h4" align="center" color="textPrimary" gutterBottom>
                            Plans and Pricing
                </Typography>

                    </Container>
                    {/* {plan.length} */}
                    <Grid container spacing={3} alignItems="flex-end">
                        {plan.map((Plans, i) => (
                            // Enterprise card is full width at sm breakpoint
                            <Grid item key={i} xs={12} md={4} >
                                <Card className="cardContainer" style={{ border: '1px solid #eee', cursor: 'pointer' }}>
                                    <CardHeader
                                        title={Plans.Plan_name}
                                        subheader={Plans.Plan_name}
                                        titleTypographyProps={{ align: 'center' }}
                                        subheaderTypographyProps={{ align: 'center' }}
                                        // action={tier.title === 'Pro' ? "*" : null}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <div className={classes.cardPricing}>
                                            <Typography component="h2" variant="h3" color="textPrimary">
                                                ${Plans.Price_per_item}
                                            </Typography>/
                                        <Typography variant="h6" color="textSecondary">
                                                month
                                    </Typography>
                                        </div>
                                        <ul>

                                            {/* {Plans.Plan_description.map((line) => ( */}

                                            <Typography component="li" variant="subtitle1" align="center" key={i}>
                                                <FaCheck /> {Plans.Plan_description} <br />
                                                <FaCheck /> Total {Plans.Total_scans} Scans
                                            </Typography>
                                            {/* ))} */}
                                        </ul>
                                    </CardContent>
                                    <CardActions>
                                        <Button fullWidth variant='contained' className="subcribeBtn" onClick={() => subscribe()}>
                                            Subscribe
                                    </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                        {isOpen && <Modal
                            disablePortal
                            disableEnforceFocus
                            disableAutoFocus
                            open
                            aria-labelledby="server-modal-title"
                            aria-describedby="server-modal-description"
                            className={classes.modal}
                            
                        >
                            <div className={classes.paper}>
                                <h2 id="server-modal-title">Subscription</h2>
                                <div > 
                                    <p>Login before subscribe, Click here to</p>
                                <Button variant="outlined" color="inherit" color="primary" onClick={() => props.history.push('/login')}> Login</Button>
                                </div>
                            </div>
                        </Modal>}

                    </Grid>
                </Container>
            </div>
           
        </div>
    )
}
export default HomeSubscription