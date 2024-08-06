import React from "react";
import { Box, Card, Typography } from "@mui/material";
import RoundButton from "../button/roundbutton";



const TaxiForm = () =>{
    return(
        <Box >
            <Card className="flight-booking-form-card">
                <Box className="checkbox-display flight-display">
                        <Box className="one-space">
                            <input type="checkbox" className="checkbox-input" checked />
                            <label className="checkbox-label">One Way</label>
                        </Box>
                        <Box className="one-space">
                            <input type="checkbox"className="checkbox-input"/>
                            <label className="checkbox-label">Round Trip</label>
                        </Box>
                        <Box className="one-space">
                            <input type="checkbox"className="checkbox-input"/>
                            <label className="checkbox-label">Airport Pickup</label>
                        </Box>
                </Box>
                    <Box className="hotel-book-form flight-form">
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input taxi-bok-inp-form" />
                            <Typography className="input-label-position">From:</Typography>
                            <Typography className="input-label-position">Kathmandu</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input taxi-bok-inp-form"  />
                            <Typography className="input-label-position">To:</Typography>
                            <Typography className="input-label-position">Pokhara</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input taxi-bok-inp-form"  />
                            <Typography className="input-label-position">Departure</Typography>
                            <Typography className="input-label-position">12 May 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input taxi-bok-inp-form" />
                            <Typography className="input-label-position">Return</Typography>
                            <Typography className="input-label-position">14 May 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input taxi-bok-inp-form" />
                            <Typography className="input-label-position">Pick-up Time</Typography>
                            <Typography className="input-label-position">12:30 PM</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Card>
                
                <Box className="booking-round-btn-form">
                    <RoundButton
                    backgroundColor='#d90166'
                    color='white'
                    buttonText='Search'
                    fontFamily='Sans Serif'
                    fontSize='12px'
                     />
               </Box>
        </Box>
    )
}

export default TaxiForm;