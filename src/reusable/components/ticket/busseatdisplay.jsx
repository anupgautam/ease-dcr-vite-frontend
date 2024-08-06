import { Box, Card, Grid } from "@material-ui/core";
import { Typography } from "@mui/material";
import React from "react";
import { FaCircle } from "react-icons/fa";
import BusImage from "../../static/pack up/busimg.jpeg";
import {MdOutlineEventSeat} from "react-icons/md";
import RoundButton from "../button/roundbutton";


const BusSeat = () =>{
    return(
       <Box> 
           <Box className="all-display-class">
              <Box className="all-display-class le-mar-gin ">
                <FaCircle 
                    style=
                    {{
                        color:'green', 
                        marginRight:'8px',
                        fontSize:"15px" 
                    }}
                />
                <Typography className="bus-tic-availability">Available</Typography>
              </Box>
              <Box className="all-display-class le-mar-gin">
                <FaCircle 
                    style=
                    {{
                        color:'blue', 
                        marginRight:'8px',
                        fontSize:"15px" 
                    }}
                />
                <Typography className="bus-tic-availability">Reserved</Typography>
              </Box>
              <Box className="all-display-class le-mar-gin">
                <FaCircle 
                    style=
                    {{
                        color:'Crimson', 
                        marginRight:'8px',
                        fontSize:"15px" 
                    }}
                />
                <Typography className="bus-tic-availability">Sold Out</Typography>
              </Box>
              <Box className="all-display-class le-mar-gin">
                <FaCircle 
                    style=
                       {{
                          color:'yellow', 
                          marginRight:'8px',
                          fontSize:"15px" 
                        }}
                />
                <Typography className="bus-tic-availability">Your Seat</Typography>
              </Box>
              <Box className="all-display-class le-mar-gin">
                <FaCircle 
                   style=
                     {{
                        color:'black', 
                        marginRight:'8px',
                        fontSize:"15px" 
                    }}
                />
                <Typography className="bus-tic-availability">Unavailable</Typography>
              </Box>
           </Box>
           <Box className="margin-bus-img">
                <Card elevation={0}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Card className="fif-ty-bus" elevation={0}>
                               <img src={BusImage} alt="Bus image" className="bus-img-card-wi"  />
                            </Card>
                        </Grid>
                        <Grid item xs={6}>
                            <Card className="fif-ty-seat" elevation={0}>
                                <Box className="seat-margin">
                                    <Box >
                                        < MdOutlineEventSeat style={{color:'blue', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'blue', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'blue', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'blue', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'blue', fontSize:'50px', marginRight:'14px'}} />
                                    </Box>
                                    <Box>
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginRight:'5rem'}} />
                                        < MdOutlineEventSeat style={{color:'crimson', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'yellow', fontSize:'50px', marginRight:'14px'}} />
                                    </Box>
                                    <Box>
                                        < MdOutlineEventSeat style={{color:'crimson', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'crimson', fontSize:'50px', marginRight:'5rem'}} />
                                        < MdOutlineEventSeat style={{color:'crimson', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'crimson', fontSize:'50px', marginRight:'14px'}} />
                                    </Box>
                                    <Box>
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'crimson', fontSize:'50px', marginRight:'5rem'}} />
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginRight:'14px'}} />
                                    </Box>
                                    <Box>
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginRight:'5rem'}} />
                                    </Box>
                                    <Box>
                                        < MdOutlineEventSeat style={{color:'black', fontSize:'50px', marginRight:'14px'}} />
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginLeft:'8rem'}} />
                                        < MdOutlineEventSeat style={{color:'green', fontSize:'50px', marginLeft:'14px'}} />
                                    </Box>
                                </Box>
                                <Box 
                                    style={{
                                        marginBottom:'1rem',
                                        float:'right',
                                        marginRight:'20px'
                                      }}>
                                    <RoundButton
                                      backgroundColor='#55AAFF'
                                      color='white'
                                      buttonText='Book Now'
                                      fontFamily='Sans Serif'
                                      fontSize='12px'
                                    />
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Card>
           </Box>
       </Box>
    )
}

export default BusSeat;