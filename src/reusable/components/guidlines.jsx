import React from "react";
import { Box, Card, Typography } from "@mui/material";
import Safety from "../static/pack up/safety.png"
import { Link } from "react-router-dom";
import {MdCancel} from "react-icons/md"


const Guidelines = () =>{
    return(
        <Box>
            <Card elevation={0}>
                <Box className="safety-display">
                    <Box>
                            <img src={Safety} alt="safety image" className="safety-image" />
                    </Box>
                    <Box>
                        <Typography className="advisories-text">Important Advisories & State Guidelines</Typography>
                        <Typography className="gov-rules-alert">With travel opening up, gov., advisories and state/UT guidelines are constantly evolving. 
                            Please Check the latest update before travelling.<Link className="know-more">Know More</Link></Typography>
                    </Box>
                    <Box>
                            < MdCancel className="md-cancel" />
                    </Box>
                </Box>
            </Card>


        </Box>
    )
}

export default Guidelines;