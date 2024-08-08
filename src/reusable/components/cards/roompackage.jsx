import React from "react";
import { Box, Typography, Grid, Card } from "@mui/material";
import Room from "../../static/images/room.jpeg"
import {FaBed} from "react-icons/fa";
import { MdOutlineViewModule, MdDone} from "react-icons/md"
import { Link } from "react-router-dom";
import {MdCancel} from "react-icons/md"
import RoundButton from "../button/roundbutton";

const RoomPackage = () =>{
    return(
        <Box>
            <Box className="combo-room">
                <Typography className="combo-room-package">Combo Room Package for 12 People</Typography>
            </Box>
            <Grid container spacing={0}>
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                          <Box className="room-box-margin">
                              <Typography className="superior-room">8 x Superior Room</Typography>  
                              <Box className="hotel-room-text-display">
                                <img src={Room} alt="room-image" className="hotel-room-image" />
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdOutlineViewModule className="md-outline" />
                                    <Typography className="city-view">City View</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < FaBed className="md-outline"/>
                                    <Typography className="city-view">King Bed</Typography>
                                </Box>
                                <Typography className="people-no">23 people can accomodate</Typography>
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
                         <Typography className="with-break-fast">Room with Breakfast</Typography>
                         <Box className="hotel-room-text-display">
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdCancel className="md-outline md-colo-ot" />
                                    <Typography className="city-view">Non Refundable</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < MdDone className="md-outline md-color-do"/>
                                    <Typography className="city-view">Breakfast is included for 12 people</Typography>
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
                            <Typography className="per-night-rooms">Per Nights for 6 Rooms</Typography>
                            <Typography className="per-night-rooms del-room-price"><del>Rs. 3000</del></Typography>
                            <Typography className="per-night-rooms adjusted-price">Rs. 2500</Typography>
                            <Box className="bill-info">
                                <Typography className="charge-incude">Service Charge and VAT is included.</Typography>
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
                 <Grid item xs={4}>
                     <Card elevation={0} className="room-grid-card right-border-grid">
                     <Box className="room-box-margin">
                              <Typography className="superior-room">8 x Superior Room</Typography>  
                              <Box className="hotel-room-text-display">
                                <img src={Room} alt="room-image" className="hotel-room-image" />
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdOutlineViewModule className="md-outline" />
                                    <Typography className="city-view">City View</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < FaBed className="md-outline"/>
                                    <Typography className="city-view">King Bed</Typography>
                                </Box>
                                <Typography className="people-no">23 people can accomodate</Typography>
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
                         <Typography className="with-break-fast">Room with Breakfast & Snacks/Dinner</Typography>
                         <Box className="hotel-room-text-display">
                                <Box >
                                <Box className="icon-txt-display">
                                    < MdCancel className="md-outline md-colo-ot" />
                                    <Typography className="city-view">Non Refundable</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < MdDone className="md-outline md-color-do" />
                                    <Typography className="city-view">Breakfast is included for 12 people</Typography>
                                </Box>
                                <Box className="icon-txt-display">
                                    < MdDone className="md-outline md-color-do"/>
                                    <Typography className="city-view">Snacks/Dinner is included for 12 people</Typography>
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
                            <Typography className="per-night-rooms">Per Nights for 6 Rooms</Typography>
                            <Typography className="per-night-rooms del-room-price"><del>Rs. 5000</del></Typography>
                            <Typography className="per-night-rooms adjusted-price">Rs. 4500</Typography>
                            <Box className="bill-info">
                                <Typography className="charge-incude">Service Charge and VAT is included.</Typography>
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

export default RoomPackage;