import React from "react";
import { Card,Box, Typography } from "@mui/material";
import Discover from "../../static/images/background.jpg"
import Discover1 from "../../static/images/gym.jpg"
const DiscoverCard = () =>{
    return(
         <Card className="discover-card">
            <Box className="discover-box">
              <Box>
                <img src={Discover} alt="discover" className="discover-bg-image" />
              </Box>
              <Box className="discover-bg-color">
                <Box className="discover-txt-margin">
                    <img src={Discover1} alt="discover" className="discover-round-image" />
                    <Typography className="gym-hall-txt">Gym Hall</Typography>
                </Box>
              </Box>
            </Box>
         </Card>
    )
}

export default DiscoverCard;