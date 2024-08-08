import React from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Image1 from "../../static/pack up/badimaika.jpeg"
import { Typography, Box, Card } from "@mui/material";

const SliderCard = ({ }) => {
  const responsive = {
    sdesktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  return (
    <Carousel responsive={responsive} >
      <Box className="Carousel-space">
        <Card className="carousel-card">
          <img src={Image1} alt="Images" className="carousel-image" />
          <Box className="bg-color-carousel">
            <Box className="round-text-icon">
              <Box className="round-position">
                <img src={Image1} alt="Images" className="small-round-image" />
              </Box>
              <Typography className="Badimaika">Badimalika</Typography>
              <Typography className="team-leader-name">Team Colleen</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box className="Carousel-space">
        <Card className="carousel-card">
          <img src={Image1} alt="Images" className="carousel-image" />
          <Box className="bg-color-carousel">
            <Box className="round-text-icon">
              <Box className="round-position">
                <img src={Image1} alt="Images" className="small-round-image" />
              </Box>
              <Typography className="Badimaika">Badimalika</Typography>
              <Typography className="team-leader-name">Team Colleen</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box className="Carousel-space">
        <Card className="carousel-card">
          <img src={Image1} alt="Images" className="carousel-image" />
          <Box className="bg-color-carousel">
            <Box className="round-text-icon">
              <Box className="round-position">
                <img src={Image1} alt="Images" className="small-round-image" />
              </Box>
              <Typography className="Badimaika">Badimalika</Typography>
              <Typography className="team-leader-name">Team Colleen</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box className="Carousel-space">
        <Card className="carousel-card">
          <img src={Image1} alt="Images" className="carousel-image" />
          <Box className="bg-color-carousel">
            <Box className="round-text-icon">
              <Box className="round-position">
                <img src={Image1} alt="Images" className="small-round-image" />
              </Box>
              <Typography className="Badimaika">Badimalika</Typography>
              <Typography className="team-leader-name">Team Colleen</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box className="Carousel-space">
        <Card className="carousel-card">
          <img src={Image1} alt="Images" className="carousel-image" />
          <Box className="bg-color-carousel">
            <Box className="round-text-icon">
              <Box className="round-position">
                <img src={Image1} alt="Images" className="small-round-image" />
              </Box>
              <Typography className="Badimaika">Badimalika</Typography>
              <Typography className="team-leader-name">Team Colleen</Typography>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box className="Carousel-space">
        <Card className="carousel-card">
          <img src={Image1} alt="Images" className="carousel-image" />
          <Box className="bg-color-carousel">
            <Box className="round-text-icon">
              <Box className="round-position">
                <img src={Image1} alt="Images" className="small-round-image" />
              </Box>
              <Typography className="Badimaika">Badimalika</Typography>
              <Typography className="team-leader-name">Team Colleen</Typography>
            </Box>
          </Box>
        </Card>
      </Box>

    </Carousel>
  )
}

export default SliderCard;