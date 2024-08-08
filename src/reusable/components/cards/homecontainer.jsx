import React from "react";
import { Typography, Card, Box, Grid } from "@mui/material";
import Globes from "../../static/images/globes.png"
import Trip from "../../static/images/trip.png"
import Flight from "../../static/images/flights.png"
import Location from "../../static/images/location.png"
import GiftCard from "../../static/images/giftcard.png"

const HomeContainer = () => {
    return (
        <Card className="home-container-card">
            <Box className="spacing-box-container">
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        <Box className="globes-display">
                            <Box>
                                <img src={Globes} alt="globes image" className="globes-image" />
                            </Box>
                            <Box>
                                <Typography className="globes-text">Where you want to go</Typography>
                            </Box>
                            <Box className="globes-line"></Box>
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box className="globes-display">
                            <Box>
                                <img src={Trip} alt="globes image" className="globes-image" />
                            </Box>
                            <Box>
                                <Typography className="globes-text">Trip Money</Typography>
                                <Typography className="globes-sec-text">Loan credit or more</Typography>
                            </Box>
                            <Box className="globes-line"></Box>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box className="globes-display">
                            <Box>
                                <img src={Flight} alt="globes image" className="globes-image" />
                            </Box>
                            <Box>
                                <Typography className="globes-text dom-flights">Explore International & Domestic Flights</Typography>
                                <Typography className="globes-sec-text" >Cheap flight all around the world</Typography>
                            </Box>
                            <Box className="globes-line"></Box>
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box className="globes-display">
                            <Box>
                                <img src={Location} alt="globes image" className="globes-image near" />
                            </Box>
                            <Box>
                                <Typography className="globes-text trips">Nearby Trips</Typography>
                            </Box>
                            <Box className="globes-line"></Box>
                        </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box className="globes-display">
                            <Box>
                                <img src={GiftCard} alt="globes image" className="globes-image near" />
                            </Box>
                            <Box>
                                <Typography className="globes-text trips">Gift Cards</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Card>
    )
}

export default HomeContainer