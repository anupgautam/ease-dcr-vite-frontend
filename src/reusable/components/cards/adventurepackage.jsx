import React from "react";
import { Box, Typography, Grid, Card } from "@material-ui/core";
import Room from "../../static/images/room.jpeg"
import {GiMountainClimbing} from "react-icons/gi";
import {MdDone, MdDownhillSkiing, MdNordicWalking, MdOutlineCalendarToday} from "react-icons/md";
import { Link } from "react-router-dom";
import {MdCancel} from "react-icons/md"
import RoundButton from "../button/roundbutton";

const AdventurePackage = () =>{
    return(
        <Box>
            <Box className="combo-room">
                <Typography className="combo-room-package">Annapurna Circuit Trekking Package</Typography>
            </Box>
            <Grid container spacing={0}>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                          <Box className="room-box-margin">
                              <Typography className="superior-room">Annapurna Base Camp</Typography>  
                              <Box className="hotel-room-text-display">
                                <img src={Room} alt="room-image" className="hotel-room-image" />
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdOutlineCalendarToday className="md-outline" />
                                    <Typography className="city-view">Day 15</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < GiMountainClimbing className="md-outline"/>
                                    <Typography className="city-view">Altitude</Typography>
                                </Box>
                                <Typography className="people-no">4130</Typography>
                                </Box>
                              </Box>
                              <Box className="more-details-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                          </Box>   
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                         <Typography className="with-break-fast">Activities in Annapurna</Typography>
                         <Box className="hotel-room-text-display">
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdDownhillSkiing className="md-outline" />
                                    <Typography className="city-view">Sking</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < MdNordicWalking className="md-outline"/>
                                    <Typography className="city-view">Trekking</Typography>
                                </Box>
                                </Box>
                              </Box>
                              <Box className="more-details-box sec-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card">
                         <Box className="price-txt-margin">
                            <Typography className="per-night-rooms del-room-price"><del>Rs. 20000</del></Typography>
                            <Typography className="per-night-rooms adjusted-price">Rs. 18000</Typography>
                            <Box className="book-info-alti-de">
                                <RoundButton
                                    backgroundColor='#4169e1 '
                                    color='white'
                                    buttonText='Book Now'
                                    fontFamily='Roboto'
                                    fontSize='10px'
                                />
                            </Box>
                         </Box>
                     </Card>
                 </Grid>
            </Grid>
            <Grid container spacing={0}>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                          <Box className="room-box-margin">
                              <Typography className="superior-room">Royal Trek in Annapurna Region</Typography>  
                              <Box className="hotel-room-text-display">
                                <img src={Room} alt="room-image" className="hotel-room-image" />
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdOutlineCalendarToday className="md-outline" />
                                    <Typography className="city-view">Day 15</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < GiMountainClimbing className="md-outline"/>
                                    <Typography className="city-view">Altitude</Typography>
                                </Box>
                                <Typography className="people-no">4130</Typography>
                                </Box>
                              </Box>
                              <Box className="more-details-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                          </Box>   
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                         <Typography className="with-break-fast">Activities in Annapurna</Typography>
                         <Box className="hotel-room-text-display">
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdDownhillSkiing className="md-outline" />
                                    <Typography className="city-view">Sking</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < MdNordicWalking className="md-outline"/>
                                    <Typography className="city-view">Trekking</Typography>
                                </Box>
                                </Box>
                              </Box>
                              <Box className="more-details-box sec-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card">
                         <Box className="price-txt-margin">
                            <Typography className="per-night-rooms del-room-price"><del>Rs. 20000</del></Typography>
                            <Typography className="per-night-rooms adjusted-price">Rs. 18000</Typography>
                            <Box className="book-info-alti-de">
                                <RoundButton
                                    backgroundColor='#4169e1 '
                                    color='white'
                                    buttonText='Book Now'
                                    fontFamily='Roboto'
                                    fontSize='10px'
                                />
                            </Box>
                         </Box>
                     </Card>
                 </Grid>
            </Grid>
            <Grid container spacing={0}>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                          <Box className="room-box-margin">
                              <Typography className="superior-room">Annapurna Circuit Trek</Typography>  
                              <Box className="hotel-room-text-display">
                                <img src={Room} alt="room-image" className="hotel-room-image" />
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdOutlineCalendarToday className="md-outline" />
                                    <Typography className="city-view">Day 15</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < GiMountainClimbing className="md-outline"/>
                                    <Typography className="city-view">Altitude</Typography>
                                </Box>
                                <Typography className="people-no">4130</Typography>
                                </Box>
                              </Box>
                              <Box className="more-details-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                          </Box>   
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                         <Typography className="with-break-fast">Activities in Annapurna</Typography>
                         <Box className="hotel-room-text-display">
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdDownhillSkiing className="md-outline" />
                                    <Typography className="city-view">Sking</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < MdNordicWalking className="md-outline"/>
                                    <Typography className="city-view">Trekking</Typography>
                                </Box>
                                </Box>
                              </Box>
                              <Box className="more-details-box sec-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card">
                         <Box className="price-txt-margin">
                            <Typography className="per-night-rooms del-room-price"><del>Rs. 20000</del></Typography>
                            <Typography className="per-night-rooms adjusted-price">Rs. 18000</Typography>
                            <Box className="book-info-alti-de">
                                <RoundButton
                                    backgroundColor='#4169e1 '
                                    color='white'
                                    buttonText='Book Now'
                                    fontFamily='Roboto'
                                    fontSize='10px'
                                />
                            </Box>
                         </Box>
                     </Card>
                 </Grid>
            </Grid>
            <Grid container spacing={0}>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                          <Box className="room-box-margin">
                              <Typography className="superior-room">Annapurna Luxury Trek</Typography>  
                              <Box className="hotel-room-text-display">
                                <img src={Room} alt="room-image" className="hotel-room-image" />
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdOutlineCalendarToday className="md-outline" />
                                    <Typography className="city-view">Day 15</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < GiMountainClimbing className="md-outline"/>
                                    <Typography className="city-view">Altitude</Typography>
                                </Box>
                                <Typography className="people-no">4130</Typography>
                                </Box>
                              </Box>
                              <Box className="more-details-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                          </Box>   
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                         <Typography className="with-break-fast">Activities in Annapurna</Typography>
                         <Box className="hotel-room-text-display">
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdDownhillSkiing className="md-outline" />
                                    <Typography className="city-view">Sking</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < MdNordicWalking className="md-outline"/>
                                    <Typography className="city-view">Trekking</Typography>
                                </Box>
                                </Box>
                              </Box>
                              <Box className="more-details-box sec-box">
                              <Link><Typography className="more-details-txt">More Details</Typography></Link>
                              </Box>
                     </Card>
                 </Grid>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card">
                         <Box className="price-txt-margin">
                            <Typography className="per-night-rooms del-room-price"><del>Rs. 20000</del></Typography>
                            <Typography className="per-night-rooms adjusted-price">Rs. 18000</Typography>
                            <Box className="book-info-alti-de">
                                <RoundButton
                                    backgroundColor='#4169e1 '
                                    color='white'
                                    buttonText='Book Now'
                                    fontFamily='Roboto'
                                    fontSize='10px'
                                />
                            </Box>
                         </Box>
                     </Card>
                 </Grid>
            </Grid>
        </Box>
    )
}

export default AdventurePackage;