import React from "react";
import { Typography,Box,Card } from "@mui/material";
import Offer from "../../static/pack up/offer.png"

const HomeCard = () =>{
    return(
        <Box>
           <Card className="offer-card" elevation={0} >
            <Box className="offer-display">
             <Box>
                <img src={Offer} alt="offer image" className="offer-image" />
             </Box>
             <Box className="new-user-offer">
                <Typography className="new-offer-txt">New user offer</Typography>
                <Typography className="register-txt">Register and get discount on booking first flight with us.</Typography>
                <Typography className="validity">Valid Till: 10 August</Typography>
             </Box>
             </Box>
           </Card>
        </Box>
    )
}

export default HomeCard