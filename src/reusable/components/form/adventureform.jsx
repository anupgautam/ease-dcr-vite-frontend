import React from "react";
import { Box, Card, Typography } from "@mui/material";
import RoundButton from "../button/roundbutton";
const AdventureForm = () =>{
    return(
        <Box >
            <Card className="flight-booking-form-card">
                <Box className="checkbox-display flight-display">
                        <Box className="one-space">
                            <input type="checkbox" className="checkbox-input" checked />
                            <label className="checkbox-label" >Places</label>
                        </Box>
                        <Box className="one-space">
                            <input type="checkbox"className="checkbox-input"/>
                            <label className="checkbox-label">Travel Company</label>
                        </Box>
                </Box>
                    <Box className="hotel-book-form flight-form">
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Country</Typography>
                            <Typography className="input-label-position">Nepal</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input"  />
                            <Typography className="input-label-position">Travel type</Typography>
                            <Typography className="input-label-position">Treeking in Nepal</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Date:</Typography>
                            <Typography className="input-label-position">Tue, Nov 14, 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">No of travellers</Typography>
                            <Typography className="input-label-position">10 peoples</Typography>
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

export default AdventureForm;