import React from "react";
import { Box, Card, Typography } from "@mui/material";
import RoundButton from "../button/roundbutton";
import Yeti from "../../static/pack up/yeti.png"

const TicketFlight = () =>{
    return(
        <Card className="flight-ticket-card" elevation={0}>
            <Box className="flight-no-box">
                <Typography className="number-flights">20 flights available of yeti Airlines in 20 August</Typography>
            </Box>
            <Box className="yeti-airlines-display">
                <Box>
                    <img src={Yeti} className="yeti-airlines-logo"/>
                </Box>
                <Box>
                    <Typography className="departure-time">Yeti Airlines</Typography>
                    <Typography className="plane-name">12342, 63567</Typography>
                </Box>
                <Box>
                    <Typography className="departure-time">5:30 PM</Typography>
                    <Typography className="plane-name">Kathmandu, Nepal</Typography>
                </Box>
                <Box>
                    <Typography className="departure-time">6:30 PM</Typography>
                    <Typography className="plane-name">Rome, Italy</Typography>
                </Box>
                <Box>
                    <Typography className="flight-fare">Rs. 2000-6000</Typography>
                </Box>
                <Box>
                <RoundButton
                    backgroundColor='#55AAFF'
                    color='white'
                    buttonText='Price List'
                    fontFamily='Sans Serif'
                    fontSize='12px'
                />
                </Box>
            </Box>
        </Card>
    )
}

export default TicketFlight;