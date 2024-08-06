import { Card, Box, Typography, Button} from "@mui/material";
import React from "react";
import Hotel from "../../static/pack up/hotel22.webp"
import Marriot from "../../static/pack up/marriot.webp"
import {FiStar} from "react-icons/fi"
import {FaStar} from "react-icons/fa"

const HotelCard = () =>{
    return(
        <Card className="hotel-horizontal-card-design" elevation={0}>
            <Box className="hotel-hor-card-display">
              <Box className="card1-ad-wi">
                <Card className="hotel-hor-card-size" elevation={0}>
                    <img src={Hotel} alt="hotel-image" className="card-hotel-img" />
                </Card>
                <Box>
                    <Box className="margin-card-hotel">
                        <img src={Marriot} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={Marriot} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={Marriot} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={Marriot} alt="hotel-image" className="card-hotel-small-img" />
                    </Box>
                </Box>
              </Box>
              <Box className="card2-ad-wi">
            <Box className="marriot-display">
              <Box>
                <Typography className="hotel-name-heading">Kathmandu Marriot</Typography>
                <Typography className="hotel-distance">4km away from Kalanki chowk</Typography>
              </Box>
              <Box className="fi-star">
                    < FaStar className="fi-star-icon" />
                    < FaStar className="fi-star-icon"  />
                    < FaStar className="fi-star-icon"  />
                    < FiStar className="fi-star-icon"  />
                    < FiStar className="fi-star-icon"  />
              </Box>
              <Box className="rating-interval">
                <Typography className="rating-no">3.1/5.0(Good)</Typography>
                <Typography className="total-ratings">900 User Rated</Typography>
              </Box>
              </Box>
              <Box className="display-hotel-facilities dis-ho-car-mar">
                  <Box>
                    <Typography className="facilities-btn">Great Environment</Typography>
                  </Box>
                  <Box>
                    <Typography className="facilities-btn">Swimming Pool</Typography>
                  </Box>
                  <Box>
                    <Typography className="facilities-btn">Couple Friendly</Typography>
                  </Box>
                  </Box>
                  <Box className="display-hotel-facilities">
                  <Box>
                    <Typography className="facilities-btn">Package Facilities</Typography>
                  </Box>
                  <Box>
                    <Typography className="facilities-btn">Parking Facilities</Typography>
                  </Box>
                  <Box>
                    <Typography className="facilities-btn">Wifi Facilities</Typography>
                  </Box>
              </Box>
              </Box>
              <Box className="yellow-card">
                <Box className="card-price-hotel">
                 <Typography className="cut-price"><del>Rs. 3000</del></Typography>
                 <Typography className="retain-price">Rs. 2500</Typography>
                 </Box>
                 <Box className="service-charge" >
                    <Typography className="service-charge-txt">Service charge and VAT is included</Typography>
                 </Box>
                 <Box className="book-btn-margin">
                    <Button className="book-btn">Book Now</Button>
                 </Box>
              </Box>
            </Box>

        </Card>
    )
}

export default HotelCard;