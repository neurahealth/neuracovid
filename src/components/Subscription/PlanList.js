import React from 'react'
import {
    Button, Card, CardActions, CardContent, CardHeader, CssBaseline,
    Grid, Typography, Container, Box
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FaCheck, FaLessThanEqual } from 'react-icons/fa'
import PaymentModal from '../Modal/PaymentModal';

function PlanList(props) {
    const { subscribe, activePlan, classes, plan, isOpen, paymenthandleClose, resultid, details, data, i18n, t } = props;
 
    return (
        <Container maxWidth="md" component="main" style={{ display: !activePlan ? "block" : "none" }}>
            <Container maxWidth="sm" component="main" className={classes.heroContent}>
                <Typography component="h3" variant="h4" align="center" color="textPrimary" gutterBottom>
                    Plans and Pricing
                </Typography>

            </Container>
                {/* {plan.length} */}
            <Grid container spacing={3} alignItems="flex-end">
                {plan.map((Plans,i) => (
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
                                <Button fullWidth variant='contained' className="subcribeBtn" onClick={() => subscribe(Plans.Plan_ID, Plans.Plan_name, Plans.Price_per_item, Plans.Plan_description)}>
                                    Subscribe
                                    </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                {isOpen && <PaymentModal t={t} i18n={i18n} open={paymenthandleClose} source="subscribe" planid={data} details={details} resultid={resultid} />}

            </Grid>
        </Container>
    )
}

export default PlanList
