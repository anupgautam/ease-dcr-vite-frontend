import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import LogoImage from '../static/pack up/logo.jpg'
import Flights from '../static/images/flights.png'
import Hotels from '../static/images/hotel.png'
import Picnic from '../static/images/picnic.png'
import Holiday from '../static/images/holiday.png'
import Adventure from '../static/images/adventure.png'
import Cab from '../static/images/cab.png'
import Bus from '../static/images/bus.png'
import ButtonCmp from "./button/button";
import { RiLoginCircleFill } from "react-icons/ri"

const Header = () => {
   return (
      <>
         <HeaderPage />
      </>
   )
}

const HeaderPage = () => {
   return (
      <Box className="header-box">
         <Grid container spacing={1}>
            <Grid item xs={1}>
               <Box>
                  <img src={LogoImage} alt="logo" className="header-logo" />
               </Box>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={6}>
               <Box className="header-display">
                  <Box className="header-icons-space">
                     <img src={Flights} alt="Flights" className="header-icons" />
                     <Typography className="navbar-txt">Flights</Typography>
                  </Box>
                  <Box className="header-icons-space">
                     <img src={Hotels} alt="Hotels" className="header-icons" />
                     <Typography className="navbar-txt">Hotels</Typography>
                  </Box>
                  <Box className="header-icons-space">
                     <img src={Picnic} alt="Picnic" className="header-icons" />
                     <Typography className="navbar-txt">Picnic</Typography>
                  </Box>
                  <Box className="header-icons-space">
                     <img src={Holiday} alt="Holiday" className="header-icons" />
                     <Typography className="navbar-txt">Holiday</Typography>
                  </Box>
                  <Box className="header-icons-space">
                     <img src={Adventure} alt="Adventure" className="header-icons" />
                     <Typography className="navbar-txt">Adventure</Typography>
                  </Box>
                  <Box className="header-icons-space">
                     <img src={Cab} alt="Cab" className="header-icons" />
                     <Typography className="navbar-txt">Cab</Typography>
                  </Box>
                  <Box className="header-icons-space">
                     <img src={Bus} alt="Bus" className="header-icons" />
                     <Typography className="navbar-txt">Bus</Typography>
                  </Box>
               </Box>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
               <ButtonCmp
                  color="black"
                  backgroundColor="white"
                  buttonIcon={<RiLoginCircleFill style={{
                     color: "#d90166",
                     fontSize: '20px',
                     paddingRight: '6px'

                  }} />}
                  buttonText="Login or Register"
                  fontSize="12px"
                  fontFamily="nexus"
                  border="2px solid #d90166"
               />
            </Grid>
         </Grid>
      </Box>
   )
}

export default Header;