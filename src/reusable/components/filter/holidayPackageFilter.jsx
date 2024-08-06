import { Box, Card, Typography, Grid } from "@material-ui/core";
import React from "react";
import Slider from '@mui/material/Slider';

const HolidayPackageFilter = () =>{
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
                            <Typography className="services-list">Everest Base Camp Trek</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Annapurna Base Camp Trek</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Manaslu Circuit Trek</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Mardi Himal Trek</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Tilicho Trek</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Badimalika Trek</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card elevation={0} className="border-radius-remove">
                    <Box className="suggested-card-margin">
                    <Box>
                        <Typography className="suggested-services">Price</Typography>
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
                        <Typography className="suggested-services">Activity Type</Typography>
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Cyclinig</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Walking & treeking</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">wildlife</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
        </Box>
    )
}

export default HolidayPackageFilter;