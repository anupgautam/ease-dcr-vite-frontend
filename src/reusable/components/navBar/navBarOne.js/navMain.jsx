import {Box, Container, Grid } from "@mui/material";
import React from "react";
import Logo from "./logo";
import logo from "../../../static/images/logo.png";
import NavComponent from "./navComponent";
import Controls from "../../forms/controls/Controls";
import { useForm1 } from "../../forms/useForm";

const NavBarOne = ({ bgColor, buttonColor }) => {

  const initialFValues = {
    'search': '',
  }

  const data = [
    {
      componentName: "Home",
      route: "home",
      subComponentName: [],
      isActive: true
    },
    {
      componentName: "About Us",
      route: "about-us",
      subComponentName: [],
      isActive: false
    },
    {
      componentName: "Services",
      route: "services",
      subComponentName: [{
        sub: 'My Service 1',
        route: 'services/my-service-1'
      },
      {
        sub: 'My Service 2',
        route: 'services/my-service-2'
      },
      {
        sub: 'My Service 3',
        route: 'services/my-service-3'
      },
      {
        sub: 'My Service 4',
        route: 'services/my-service-4'
      }],
      isActive: false
    },
    {
      componentName: "Book Appointment",
      route: "book-appointment",
      subComponentName: [],
      isActive: false
    },
    {
      componentName: "Our Products",
      route: "products",
      subComponentName: [],
      isActive: false
    },
    {
      componentName: "Blogs",
      route: "blogs",
      subComponentName: [],
      isActive: false
    },
  ]

  const {
    values,
    handleSearchClick,
  } = useForm1(initialFValues, true);

  return (
    <Box style={{ backgroundColor: `${bgColor}` }}>
      <Container>
        <Box className="nav-bar-padding">
          <Grid container spacing={3}>
            <Grid item xs={1}>
              <Logo logoImage={logo} />
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={8}>
              <NavComponent
                navComponent={data}
                buttonColor={buttonColor}
                bgColor={bgColor} />
            </Grid>
            <Grid item xs={2}>
              <Box style={{ paddingTop: "5px", textAlign: "right" }}>
                <Controls.Search
                  name='search'
                  value={values}
                  onChange={handleSearchClick} />

              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default NavBarOne;
