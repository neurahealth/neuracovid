import React, { useState } from 'react'
import {
    Button, Grid, Typography, TextareaAutosize} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { firebase } from "@firebase/app";

const useStyles = makeStyles((theme) => ({
    '@global': {
        ul: {
            margin: 0,
            padding: 0,
            listStyle: 'none',
        },
    },

    header: {
        backgroundColor:'#47CBEA',
        color: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height:45,
        width:'85%',
        borderRadius:'0 25px 25px 0'
    },
    modalBody:{
        padding:'5%'
    },
    optionBtn:{
        backgroundColor: '#47CBEA',
        color: '#fff',
        borderRadius:25,
        padding:'auto 25px'
    },
    optionBtnOutline: {
        borderColor: '#47CBEA',
        border: '1px solid',
        color: '#47CBEA',
        borderRadius: 25,
        padding: 'auto 25px'
    },
    commentWrap:{
        padding: '5% 0'
    },
    optionWrap:{
        display:'flex',
        justifyContent:'space-between',
        padding: '5% 0'
    },
    
    submitBtn:{
        backgroundColor: '#47CBEA',
        color:'#fff',
        width:'40%',
    },
    
    closeBtn:{
        backgroundColor: '#000',
        color:'#fff',
        width: '40%'
    }


}));
const Feedback =(props)=>{
    const classes = useStyles();
    const [feedbacks, setfeedbacks] = useState({})
    const [selectOpt, setselectOpt] = useState("")
    const [active, setactive] = useState()
    const [comment, setComment] =useState("")
    const [isdisable, setisdisable] = useState(true)
    const selectOption =(opt)=>{
        let act=[]
        act[opt]=true
        setactive(act)
        setselectOpt(opt)
        setfeedbacks({ ...feedbacks, feedback: opt})
        if(opt){
            setisdisable(false)
        }
    }
    const onChangeHandle =(e)=>{
        setComment(e.target.value)
        setfeedbacks({ ...feedbacks,feedbackcomments: e.target.value })
    }
    const onSubmit=async()=>{
        let uid = firebase.auth().currentUser.uid;
        await firebase
            .firestore()
            .collection("stripe_customers")
            .doc(uid)
            .collection("results")
            .doc(props.resultid)
            .update({feedbacks});

            props.handleClose()
    }
    const onClear=()=>{
        setselectOpt("")
        setComment("")
        setisdisable(true)
    }
    return(
        <div className="Container">
            {/* <button
                className="payclose payresult"
                onClick={props.handleClose}
            >
                x
       </button> */}
            <div className={classes.header}>Provide Ground Truth Feedback</div>

            <div className={classes.modalBody}>
                <Typography style={{textAlign:'left'}}> Select RT-PCR Swab Test Result </Typography>
                <div className={classes.optionWrap}>

                    <Button className={selectOpt =="positive" ? classes.optionBtn : classes.optionBtnOutline} onClick={()=>selectOption("positive")}>Covid Positive</Button>
                    <Button className={selectOpt == "negative" ? classes.optionBtn : classes.optionBtnOutline} onClick={() => selectOption("negative")}>Covid Negative</Button>
                    <Button className={selectOpt == "unknown" ? classes.optionBtn : classes.optionBtnOutline} onClick={() => selectOption("unknown")}>Unknown</Button>
                    
                </div>
                <div className={classes.commentWrap}>
                    <TextareaAutosize
                        name="comments"
                        rowsMax={4}
                        rows={4}
                        style={{ width: '100%', borderColor: '#ccc',padding:5}}
                        aria-label="maximum height"
                        placeholder="Any additional comments"
                        onChange={onChangeHandle}
                        value={comment}
                    />
                </div>
                <div className={classes.optionWrap}>
                    <Button variant="contained" className={classes.submitBtn} onClick={onSubmit} disabled={isdisable}>Submit</Button>
                    <Button variant="contained" className={classes.closeBtn} onClick={onClear}>Clear</Button>

                </div>
            </div>

        </div>
    )
}

export default Feedback