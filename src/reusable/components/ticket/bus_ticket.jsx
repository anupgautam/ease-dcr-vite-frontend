import React from "react";
import { Box, Card, Typography } from "@material-ui/core";
import RoundButton from "../button/roundbutton";
import Yeti from "../../static/pack up/yeti.png"

const TicketBus = () =>{
    return(
        <Card className="flight-ticket-card" elevation={0}>
        <Box className="flight-no-box">
            <Typography className="number-flights">20 seats are remaining.</Typography>
        </Box>
        <Box className="yeti-airlines-display">
            <Box>
                <img src={Yeti} className="yeti-airlines-logo"/>
            </Box>
            <Box>
                <Typography className="departure-time">Baba Adventure Travel and Tours</Typography>
            </Box>
            <Box>
                <Typography className="departure-time">5:30 PM</Typography>
                <Typography className="plane-name">12, Nov</Typography>
            </Box>
            <Box>
                <Typography className="departure-time">6:30 PM</Typography>
                <Typography className="plane-name">13, Nov</Typography>
            </Box>
            <Box>
                <Typography className="flight-fare">Rs. 2000-6000</Typography>
            </Box>
            <Box>
            <RoundButton
               backgroundColor='#55AAFF'
               color='white'
               buttonText='Book'
               fontFamily='Sans Serif'
              fontSize='12px'
            />
            </Box>
        </Box>
    </Card>
    )
}

export default TicketBus;