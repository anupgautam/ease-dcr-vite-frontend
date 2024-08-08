import {Slider, Box, Card, Grid, Typography } from "@mui/material";
import React from "react";

const HotelFilter = () =>{
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
    return(
        <Box>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                    <Box>
                        <Typography className="suggested-services">Suggested for you</Typography>
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Villa(20)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Swimming Pool(20)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Resorts(20)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Rated Hotels(20)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Home Stay(20)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Apartment(20)</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                    <Box>
                        <Typography className="suggested-services">Price (Per Night)</Typography>
                    </Box>
                    <Box className="mar-slid-er">
                    <Slider
                        aria-label="Custom marks"
                        defaultValue={60}
                        getAriaValueText={valuetext}
                        step={10}
                        valueLabelDisplay="auto"
                        marks={marks}
                    />
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Under Rs.2,000</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Rs.2,000-Rs.3,000</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Rs.3,000-Rs.5,000</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Rs.5,000-Rs.8,000</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Rs.8,000 & above</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                    <Box>
                        <Typography className="suggested-services">Star Category</Typography>
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">3 Star(20)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">4 Star(20)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">5 star(20)</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                    <Box>
                        <Typography className="suggested-services">User Ratings</Typography>
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">4.5 & above(2000)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">4 & above(100)</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">3 & above(1220)</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                    <Box>
                        <Typography className="suggested-services">Hotel Chains</Typography>
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Radission</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Marriot</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Hyatt</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Crown Plaza</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Millennium</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
        </Box>
    )
}

export default HotelFilter;