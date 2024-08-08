import React from "react";
import { Box, Typography, Card } from "@mui/material";
import Flights from '../static/images/flights.png'
import Hotels from '../static/images/hotel.png'
import Picnic from '../static/images/picnic.png'
import Holiday from '../static/images/holiday.png'
import Cab from '../static/images/cab.png'
import Bus from '../static/images/bus.png'
import RoundButton from "./button/roundbutton";


const HorizontalForm = () => {
    return (
        <Box >
            <Box
                style={{
                    position: 'absolute',
                    top: '-30px',
                    zIndex: '2',
                    paddingLeft: '70px',
                    paddingRight: '100px',
                }}
            >
                <Box
                    style={{
                        position: 'absolute',
                        top: '-25px',
                        zIndex: '2',
                        paddingLeft: '8px',
                    }}
                >
                    <Box className="form-image-content">
                        <img src={Flights} alt="image" className="form-icon-image" />
                        <img src={Hotels} alt="image" className="form-icon-image" />
                        <img src={Picnic} alt="image" className="form-icon-image" />
                        <img src={Holiday} alt="image" className="form-icon-image" />
                        <img src={Cab} alt="image" className="form-icon-image" />
                        <img src={Bus} alt="image" className="form-icon-image" />
                    </Box>
                </Box>
                <Card className="form-card">
                    <Box className="form-card-content">
                        <Typography className="form-flight">Flights</Typography>
                        <Typography className="form-flight">Hotels</Typography>
                        <Typography className="form-flight">Picnic</Typography>
                        <Typography className="form-flight">Holiday</Typography>
                        <Typography className="form-flight">Cabs</Typography>
                        <Typography className="form-flight">Bus</Typography>
                    </Box>
                </Card>
            </Box>
            <Card className="form-sec-card" elevation={0}>
                <Box className="checkbox-display">
                    <Box className="one-space">
                        <input type="checkbox" className="checkbox-input" />
                        <label className="checkbox-label">Oneway</label>
                    </Box>
                    <Box className="one-space">
                        <input type="checkbox" className="checkbox-input" />
                        <label className="checkbox-label">Twoway</label>
                    </Box>
                    <Box className="one-space">
                        <input type="checkbox" className="checkbox-input" />
                        <label className="checkbox-label">International Flights</label>
                    </Box>
                </Box>
                <Box className="flight-book-form">
                    <Box>
                        <Box className="label-box">
                            <label className="flight-label">From</label>
                        </Box>
                        <Box>
                            <input type="text" className="flight-input" />
                        </Box>
                    </Box>
                    <Box>
                        <Box className="label-box">
                            <label className="flight-label">To</label>
                        </Box>
                        <Box>
                            <input type="text" className="flight-input" />
                        </Box>
                    </Box>
                    <Box>
                        <Box className="label-box">
                            <label className="flight-label">Departure</label>
                        </Box>
                        <Box>
                            <input type="text" className="flight-input" />
                        </Box>
                    </Box>
                    <Box>
                        <Box className="label-box">
                            <label className="flight-label">Return</label>
                        </Box>
                        <Box>
                            <input type="text" className="flight-input" />
                        </Box>
                    </Box>
                </Box>
            </Card>

            <Box className="round-btn-form">
                <RoundButton
                    backgroundColor='#d90166'
                    color='white'
                    buttonText='Search'
                    fontFamily='Roboto'
                    fontSize='13px'
                />
            </Box>
        </Box>
    )
}

export default HorizontalForm;