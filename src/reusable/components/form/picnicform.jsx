import React from "react";
import { Box, Card, Typography } from "@mui/material";
import RoundButton from "../button/roundbutton";
const PicnicForm = () =>{
    return(
        <Box >
            <Card className="booking-form-card">
                    <Box className="hotel-book-form">
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Destination:</Typography>
                            <Typography className="input-label-position">Dhulikhel</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input"  />
                            <Typography className="input-label-position">Date of Picnic</Typography>
                            <Typography className="input-label-position">Mon, Nov 13, 2022</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">Picnic Type</Typography>
                            <Typography className="input-label-position">Office Picnic</Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Box>
                            <input type="text" className="hotel-booking-input" />
                            <Typography className="input-label-position">No. of People:</Typography>
                            <Typography className="input-label-position">50 Peoples</Typography>
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

export default PicnicForm;