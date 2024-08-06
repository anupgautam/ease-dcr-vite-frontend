import { Box, Typography, Grid, Card } from "@material-ui/core";
import React from "react";

const CabFilter = () =>{
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
        </Box>
    )
}

export default CabFilter;