import { Card, Box } from "@material-ui/core";
import { Typography } from "@mui/material";
import React from "react";
import GlobalIME from "../../static/images/globalbank.png"
import Atm from "../../static/images/atm.jpg"

const BankContainer = () =>{
    return(
        <Card className="Bank-container-card">
            <Box>
                <Box className="left-div-bank">
                    <Box>
                        <Typography className="sponsored-bank">Sponsored</Typography>
                    </Box>
                    <Box className="tuesday-display">
                        <Card className="global-ime-card">
                            <img  src={GlobalIME} alt="global ime" className="global-ime"/>
                        </Card>
                        <Box>
                           <Typography className="every-tuesday">Every Tuesday!</Typography>
                           <Box className="collect-display">
                           <Typography className="save-collect display-save">Collect & Save</Typography>
                           <Typography className="line-collect"></Typography>
                           <Typography className="save-collect">up to 15% off</Typography>
                           <Typography className="line-collect"></Typography>
                           <Typography className="save-collect">Max Rs.700</Typography>
                           </Box>
                        </Box>
                    </Box>
                </Box>
                
                <Box className="right-div-bank">
                    <Box className="atm-display">
                        <Box>
                            <img src={Atm} alt="background image" className="atm-image"/>
                        </Box>
                        <Box>
                            <Typography className="redeem">Redeem & Shop</Typography>
                        </Box>
                        
                    </Box>
                </Box>
            </Box>
        </Card>
    )
}

export default BankContainer;