import React from "react";
import { Box, Card, Typography } from "@mui/material";
import RoundButton from "../button/roundbutton";

const BusForm = () =>{
    return(
        <Box >
            <Card className="booking-form-card">
                    <Box className="hotel-book-form">
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">From:</Typography>
                            <Typography className="input-label-position">Dhulikhel, Kavre</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input"  />
                            <Typography className="input-label-position">To:</Typography>
                            <Typography className="input-label-position">Pokhara, Kaski</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Depart</Typography>
                            <Typography className="input-label-position">12, Nov 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">No. of People:</Typography>
                            <Typography className="input-label-position">5 People</Typography>
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

export default BusForm;