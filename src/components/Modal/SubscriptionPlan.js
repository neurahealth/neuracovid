import React, { useState, useEffect} from 'react'
import { firebase } from '@firebase/app';
import Subscription from "../Subscription";
function SubscriptionPlan() {

    const [plan, setplan] = useState([])

    useEffect(() => {
        _fetchData()
       
        
    }, [])

    const _fetchData = async () => {
       const subp = firebase.firestore().collection('subscription_plans');
       const snapshot = await subp.get();
       if (snapshot.empty) {
           console.log('No matching documents.');
           return;
       }
       snapshot.forEach(doc => {
           let list = [];
           let items = doc.data();
           items = JSON.stringify(items);
           list.push(JSON.parse(items))
           setplan(list)
       });
   }
    return (
        <Subscription plan={[plan.map((pl,i)=>pl)]} />
        
    )
}

export default SubscriptionPlan