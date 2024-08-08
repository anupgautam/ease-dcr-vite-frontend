import React from "react";
import { Slider, Box, Typography, Grid, Card } from '@mui/material';
import { BiFilterAlt } from "react-icons/bi";

const BusTicketFilter = () => {
    const marks = [
        {
            value: 0,
            label: 'Rs 2000',
        },
        {
            value: 100,
            label: 'Rs.20000',
        },
    ];

    function valuetext(value) {
        return `${value}`;
    }
    return (
        <Box>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                        <Box>
                            <Typography className="suggested-services">Popular Filter <BiFilterAlt style={{ fontSize: "16px" }} /></Typography>
                        </Box>
                        <Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Refundable Price(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Non-stop(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Morning Departure(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Late Departure(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Tara Air(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">yeti Air(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Buddha Air(20)</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                        <Box>
                            <Typography className="suggested-services">One Way Price</Typography>
                        </Box>
                        <Box>
                            <Slider
                                aria-label="Custom marks"
                                defaultValue={60}
                                getAriaValueText={valuetext}
                                step={10}
                                valueLabelDisplay="auto"
                                marks={marks}
                            />
                        </Box>
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                        <Box>
                            <Typography className="suggested-services">Airlines Comapany</Typography>
                        </Box>
                        <Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Tara Air(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Yeti Air(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Buddha Air(20)</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox" />
                                <Typography className="services-list">Guna Air(20)</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Box>
    )
}

export default BusTicketFilter;