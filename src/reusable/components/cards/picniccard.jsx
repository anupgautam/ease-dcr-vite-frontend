import { Card, Box, Typography, Button} from "@mui/material";
import React from "react";
import PicnicSpot from "../../static/images/spot.jpg"
import {FiStar} from "react-icons/fi"
import {FaStar} from "react-icons/fa"
import Picnic from "../../static/images/picnic.jpg"

const PicnicCard = () =>{
    return(
        <Card className="hotel-horizontal-card-design" elevation={0}>
            <Box className="hotel-hor-card-display">
              <Box className="card1-ad-wi">
                <Card className="hotel-hor-card-size" elevation={0}>
                    <img src={Picnic} alt="hotel-image" className="card-hotel-img" />
                </Card>
                <Box>
                    <Box className="margin-card-hotel">
                        <img src={PicnicSpot} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={PicnicSpot} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={PicnicSpot} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={PicnicSpot} alt="hotel-image" className="card-hotel-small-img" />
                    </Box>
                </Box>
              </Box>
              <Box className="card2-ad-wi">
                    <Box className="marriot-display">
                        <Box>
                            <Typography className="hotel-name-heading">Picnic in Dhulikhel</Typography>
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
                    <Box className="display-hotel-facilities">
                        <Box>
                            <Typography className="facilities-btn">Dry Picnic</Typography>
                        </Box>
                        <Box>
                            <Typography className="facilities-btn">Great Environment</Typography>
                        </Box>
                        <Box>
                            <Typography className="facilities-btn">Mountain View</Typography>
                        </Box>
                        <Box>
                            <Typography className="facilities-btn">Music Facilities</Typography>
                        </Box>
                        </Box>
                        <Box className="display-hotel-facilities">
                        <Box>
                            <Typography className="facilities-btn">Vechiles Facilities</Typography>
                        </Box>
                        <Box>
                            <Typography className="facilities-btn">Water Facilities</Typography>
                        </Box>
                    </Box>
              </Box>
              <Box className="yellow-card">
                <Box className="card-price-hotel">
                    <Typography className="cut-price"><del>Rs. 12000</del></Typography>
                    <Typography className="retain-price">Rs. 10000</Typography>
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

export default PicnicCard;