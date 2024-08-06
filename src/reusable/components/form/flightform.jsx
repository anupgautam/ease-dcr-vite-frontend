import React from "react";
import { Box, Card, Typography } from "@mui/material";
import RoundButton from "../button/roundbutton";



const FlightForm = () =>{
    return(
        <Box >
            <Card className="flight-booking-form-card">
                <Box className="checkbox-display flight-display">
                        <Box className="one-space">
                            <input type="checkbox" className="checkbox-input" checked />
                            <label className="checkbox-label">Oneway</label>
                        </Box>
                        <Box className="one-space">
                            <input type="checkbox"className="checkbox-input"/>
                            <label className="checkbox-label">Twoway</label>
                        </Box>
                        <Box className="one-space">
                            <input type="checkbox"className="checkbox-input" />
                            <label className="checkbox-label">International Flights</label>
                        </Box>
                </Box>
                    <Box className="hotel-book-form flight-form">
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">From:</Typography>
                            <Typography className="input-label-position">Kathmandu,Nepal</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input"  />
                            <Typography className="input-label-position">To:</Typography>
                            <Typography className="input-label-position">Rome, Italy</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Depart:</Typography>
                            <Typography className="input-label-position">Tue, Nov 14, 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Return:</Typography>
                            <Typography className="input-label-position">Fri, Dec13, 2022</Typography>
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

export default FlightForm;