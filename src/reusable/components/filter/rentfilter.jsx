import { Box, Typography, Grid, Card } from "@material-ui/core";
import React from "react";
import Slider from '@mui/material/Slider';
import { BiFilterAlt } from "react-icons/bi";

const RentFilter = () =>{
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
                        <Typography className="suggested-services">Popular Filter <BiFilterAlt style={{ fontSize:"16px"}} /></Typography>
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Car</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Van</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Motorcycle</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Jeep</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Hiace</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">SUV and Land Crusier</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Tourist Bus</Typography>
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
                        <Typography className="suggested-services">Pick up Area</Typography>
                    </Box>
                    <Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Inside Ringroad</Typography>
                        </Box>
                        <Box className="hotel-services-input">
                            <input type="checkbox" className="service-checkbox"/>
                            <Typography className="services-list">Outside Ringroad</Typography>
                        </Box>
                    </Box>
                </Box>
                </Card>
            </Grid>
        </Box>
    )
}

export default RentFilter;