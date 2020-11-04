import React, { useState, useEffect} from 'react'
import {Button,Card,CardActions,CardContent,CardHeader,CssBaseline,
    Grid, Typography, Container,Box} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import PaymentModal from '../Modal/PaymentModal';
import { FaCheck, FaLessThanEqual } from 'react-icons/fa'
import './style.css'
import { firebase } from '@firebase/app';
import 'firebase/auth';
import ActivePlan from './ActivePlan';
import PlanList from './PlanList';
import Loading from '../../loader/Loading';

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },
 
    toolbar: {
        flexWrap: 'wrap',
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    heroContent: {
        // padding: theme.spacing(8, 0, 6),
    },
    cardHeader: {
        // backgroundColor:
        //     theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
    cardPricing: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        marginBottom: theme.spacing(2),

    },
    cardContainer:{
        // ":hover": {
        //     boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2) !important'
        // }
    },
    planName:{
        color:'#4bcfef'
        
    }
    
}));

var defa = "#41B2CC";
let list = [];
// let activePlanlist = [];
let userId;
let resultid;
let activelist =[];
let subscription = "";
const  Index =(props)=> {
    const { t, i18n } = props;
    const classes = useStyles();
    const [isOpen, setisOpen] = useState(false)
    const [data, setdata] = useState()
    // const [tiers, settiers] = useState([plan])
    const [renewPlan, setrenewPlan] = useState(false)
    const [plan, setplan] = useState([])
    const [user, setuser] = useState()
    const [activePlanList, setactivePlanList] = useState([])
    const [activePlan, setactivePlan] = useState()
    const [details, setdetails] = useState({name: '', price: '', desc: ''})

    const subscribe= async(plan_id, name, price, desc)=>{
        setdata(plan_id)
        setdetails(prevState => ({
            ...prevState, name: name, price: price, desc:desc }))
        setisOpen(true)
        
    }

    const paymenthandleClose = (val) => {
        setisOpen(val)
    };

   

    const _fetchData = async (userId) => {
        
       
        let val = await firebase.firestore().collection("stripe_customers").doc(userId).get();
        resultid = val.data().resultId;
        var promise = new Promise(async(resolve, reject) => {
            const usersRef = await firebase.firestore().collection('stripe_customers').doc(userId).collection('subscription').doc('details')
            usersRef.get()
                .then((docSnapshot) => {
                    if (docSnapshot.exists) {
                        usersRef.onSnapshot((doc) => {
                            // do stuff with the data
                            activelist = activePlanList
                            let details = JSON.stringify(doc.data())
                            let parseDetails = JSON.parse(details)
                            activelist.push(parseDetails)
                            resolve(activelist);
                            subscription = parseDetails.subscription
                            let remaining_scans = parseDetails.remaining_scans
                            if (subscription == 'success') {
                                setactivePlan(true)
                                setrenewPlan(true)
                            } else if (subscription == 'expired' && remaining_scans == 0){
                                setactivePlan(true)
                                setrenewPlan(false)
                            } else {
                                setactivePlan(false)
                                fetchPlan()
                            }

                        });
                    } else {
                       
                        fetchPlan() 
                       
                        
                        
                    }
                });



        });
        promise.then(result => {
            setactivePlanList(result)
        });
        
        
        
    }
   
    const fetchPlan =async()=>{
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
        firebase.auth().onAuthStateChanged(user => {
            _fetchData(user.uid)
        })
        fetchPlan()
        
    }, [] )

   

    return (
        <React.Fragment>
           
            {activePlan && 
                <ActivePlan activePlanList={activePlanList} renewPlan={renewPlan} subscribe={subscribe} activePlan={activePlan} />
                
            }
            {!plan.isEmpty &&

                <PlanList plan={plan} classes={classes} subscribe={subscribe} isOpen={isOpen} paymenthandleClose={paymenthandleClose} resultid={resultid} details={details} data={data} i18n={i18n} t={t} activePlan={activePlan} />
            }
            
        </React.Fragment>
    )
}



export default Index
