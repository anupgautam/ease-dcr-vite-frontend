import React from "react";
import { Card, Box, Typography } from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { Link } from "react-router-dom";

const LoginSignupAlert = () => {
    return (
        <Box>
            <Card elevation={0}>
                <Box className="safety-display">
                    <Box>
                        <FaUserCircle className="safety-image flight-fa-user" />
                    </Box>
                    <Box>
                        <Typography className="advisories-text">Login or signups</Typography>
                        <Typography className="gov-rules-alert">With travel opening up, gov., advisories and state/UT guidelines are constantly evolving.
                            Please Check the latest update before travelling.<Link className="know-more">Know More</Link>
                        </Typography>
                    </Box>
                    <Box>
                        < MdCancel className="md-cancel" />
                    </Box>
                </Box>
            </Card>
        </Box>
    )
}

export default LoginSignupAlert;