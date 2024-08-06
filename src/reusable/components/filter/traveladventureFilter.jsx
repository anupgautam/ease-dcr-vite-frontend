import React from "react";
import { Box,Typography, Card, Grid  } from "@material-ui/core";
import Slider from '@mui/material/Slider';
import { BiFilterAlt } from "react-icons/bi";

const TravelAdventureFilter = () =>{
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
                        <Typography className="services-list">Trekking in Nepal</Typography>
                    </Box>
                    <Box className="hotel-services-input">
                        <input type="checkbox" className="service-checkbox"/>
                        <Typography className="services-list">Jungle Sufari in Nepal</Typography>
                    </Box>
                    <Box className="hotel-services-input">
                        <input type="checkbox" className="service-checkbox"/>
                        <Typography className="services-list">Sightseeing in Nepal</Typography>
                    </Box>
                    <Box className="hotel-services-input">
                        <input type="checkbox" className="service-checkbox"/>
                        <Typography className="services-list">Adventure in Nepal</Typography>
                    </Box>
                    <Box className="hotel-services-input">
                        <input type="checkbox" className="service-checkbox"/>
                        <Typography className="services-list">Mountain Climbing</Typography>
                    </Box>
                    <Box className="hotel-services-input">
                        <input type="checkbox" className="service-checkbox"/>
                        <Typography className="services-list">Cycling</Typography>
                    </Box>
                    <Box className="hotel-services-input">
                        <input type="checkbox" className="service-checkbox"/>
                        <Typography className="services-list">Wildlife Holidays</Typography>
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
                            <Typography className="suggested-services">Travel Comapany</Typography>
                        </Box>
                        <Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox"/>
                                <Typography className="services-list">Neppal treks</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox"/>
                                <Typography className="services-list">EXplore Himalaya</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox"/>
                                <Typography className="services-list">Buddha Treks</Typography>
                            </Box>
                            <Box className="hotel-services-input">
                                <input type="checkbox" className="service-checkbox"/>
                                <Typography className="services-list">Guna Tre</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>
        </Box>
    )
}

export default TravelAdventureFilter;