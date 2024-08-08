import { Box, Typography, Card, Grid } from "@mui/material";
import React, { useState } from "react";
import Map from "../../static/pack up/map.png"
import { BsChevronDown } from "react-icons/bs"

const LocationCard = () => {
    return (
        <Box>
            <Box>
                <Typography className="our-rooms-head location-head">Location</Typography>
            </Box>
            <Box>
                <Grid container spacing={0}>
                    <Grid item xs={3}>
                        <Card className="surroundings-card">
                            <Box className="loacation-box">
                                <Typography className="key-surroundings">Surroundings of hotels or resort</Typography>
                            </Box>
                            <Box className="key-landmark-box">
                                <Typography className="landmark-txt">Key Landmarks</Typography>
                                <BsChevronDown className="bs-chevron-down" />
                            </Box>
                            <Box className="hr-line-landmark"></Box>
                            <Box className="key-landmark-box">
                                <Typography className="landmark-txt">Tourist Attraction</Typography>
                                <BsChevronDown className="bs-chevron-down" />
                            </Box>
                            <Box className="hr-line-landmark"></Box>
                            <Box className="key-landmark-box">
                                <Typography className="landmark-txt">Temples or religious places</Typography>
                                <BsChevronDown className="bs-chevron-down" />
                            </Box>
                            <Box className="hr-line-landmark"></Box>
                            <Box className="key-landmark-box">
                                <Typography className="landmark-txt">Others</Typography>
                                <BsChevronDown className="bs-chevron-down" />
                            </Box>
                            <Box className="hr-line-landmark"></Box>
                        </Card>
                    </Grid>
                    <Grid item xs={9}>
                        <Card className="surroundings-card">
                            <Box>
                                <img src={Map} alt="Location-map" className="map-image" />
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default LocationCard;