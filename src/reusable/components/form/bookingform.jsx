import React from "react";
import { Box, Card, Typography } from "@mui/material";
import RoundButton from "../button/roundbutton";



const BookingForm = () =>{
    return(
        <Box >
            <Card className="booking-form-card">
                    <Box className="hotel-book-form">
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">City:</Typography>
                            <Typography className="input-label-position">Kathmandu,Nepal</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input"  />
                            <Typography className="input-label-position">Check In:</Typography>
                            <Typography className="input-label-position">Mon, Nov 13, 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Check Out:</Typography>
                            <Typography className="input-label-position">Tue, Nov 14, 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Room & Guests:</Typography>
                            <Typography className="input-label-position">2 Rooms and 12 Guests</Typography>
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

export default BookingForm;