import React from 'react'
import {
    Button, Card, CardActions, CardContent, CardHeader, CssBaseline,
    Grid, Typography, Container, Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FaCheck, FaLessThanEqual } from 'react-icons/fa'

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
    cardContainer: {
        // ":hover": {
        //     boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2) !important'
        // }
    },
    planName: {
        color: '#4bcfef'

    }

}));
function ActivePlan(props) {
    const classes = useStyles();
    const { activePlanList, subscribe, renewPlan, activePlan} = props;
    return (
        <Container maxWidth="md">
            {activePlanList.map((activePlan, i) => {

                return (
                    <div >
                        <Container maxWidth="sm" component="main" className={classes.heroContent} style={{ marginLeft: 'unset' }}  >
                            <Typography component="h4" variant="h5" align="left" color="textPrimary" gutterBottom>
                                Subscribed Plans : <span className={classes.planName}>  {activePlan.plan_name} </span>
                            </Typography>
                        </Container>

                        <Grid container spacing={3}>
                            <Grid item key={i} xs={12} md={4} >
                                <Card className="" style={{ border: '1px solid #eee', cursor: 'pointer' }}>
                                    <CardHeader
                                        title={activePlan.plan_name}
                                        titleTypographyProps={{ align: 'center' }}
                                        subheaderTypographyProps={{ align: 'center' }}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent>
                                        <div className={classes.cardPricing}>
                                            <Typography component="h2" variant="h3" color="textPrimary">
                                                ${activePlan.price_per_item}
                                            </Typography>/
                                            <Typography variant="h6" color="textSecondary">
                                                month
                                        </Typography>
                                        </div>
                                        <ul>
                                            <Typography component="li" variant="subtitle1" align="center" >
                                                <FaCheck /> {activePlan.plan_description} <br />
                                                <FaCheck /> Total {activePlan.total_scans} Scans available<br />
                                                <FaCheck /> Valid 1 month
                                                </Typography>

                                        </ul>
                                    </CardContent>

                                </Card>
                            </Grid>


                            <Grid item key={"Plans.Plan_name"} xs={12} md={8} >
                                <Card className="" style={{ border: '1px solid #eee', cursor: 'pointer' }}>
                                    <CardHeader
                                        title={"Active Plan Details"}
                                        titleTypographyProps={{ align: 'center' }}
                                        subheaderTypographyProps={{ align: 'center' }}
                                        className={classes.cardHeader}
                                    />
                                    <CardContent align="left">
                                        <div className={classes.cardPricing}>
                                            <Typography component="h5" variant="h6" color="textPrimary">
                                                {"Remaining Scans :"} {activePlan.remaining_scans}
                                            </Typography>
                                        </div>
                                        <div className={classes.cardPricing}>
                                            <Typography component="h5" variant="h6" color="textPrimary">
                                                {"Subscription Date :"} {activePlan.start_time}
                                            </Typography>
                                        </div>
                                        <CardActions className="d-flex justify-content-center">
                                            <Button disabled={renewPlan} fullWidth variant='contained' className="btnPayemnt payBtn coupon" onClick={() => subscribe()}>
                                                Renew Subscription
                                            </Button>
                                        </CardActions>

                                    </CardContent>
                                </Card>

                            </Grid>
                        </Grid>
                    </div>
                )

            })}



        </Container>
    )
}

export default ActivePlan
