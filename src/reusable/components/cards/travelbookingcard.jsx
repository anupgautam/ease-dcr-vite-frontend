import React from "react";
import { Box, Typography, Grid, Card } from "@mui/material";
import RoundButton from "../button/roundbutton";
import Yeti from "../../static/pack up/yeti.png"

const TravellBookingCard = () =>{
    return(
        <Box>
            <Card className="flight-ticket-card" elevation={0}>
                <Box className="flight-no-box">
                    <Typography className="number-flights">10 treks are available in october</Typography>
                </Box>
                <Box className="yeti-airlines-display">
                    <Box>
                        <img src={Yeti} className="yeti-airlines-logo"/>
                    </Box>
                    <Box className="exxp-him-typo">
                        <Typography className="departure-time">Explore Himalaya</Typography>
                    </Box>
                    <Box>
                        <Typography className="flight-fare">Rs. 2000-6000</Typography>
                    </Box>
                    <Box>
                    <RoundButton
                        backgroundColor='#55AAFF'
                        color='white'
                        buttonText='Package List'
                        fontFamily='Sans Serif'
                        fontSize='12px'
                    />
                    </Box>
                </Box>
            </Card>
        </Box>
    )
}

export default TravellBookingCard;