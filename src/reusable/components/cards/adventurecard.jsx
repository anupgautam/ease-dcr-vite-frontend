import { Card, Box, Typography, Button} from "@mui/material";
import React from "react";
import Trek from "../../static/images/adventure.jpg"
import Annapurna from "../../static/images/image.jpg"
import {FiStar} from "react-icons/fi"
import {FaStar} from "react-icons/fa"

const AdventureCard = () =>{
    return(
        <Card className="hotel-horizontal-card-design" elevation={0}>
            <Box className="hotel-hor-card-display">
              <Box className="card1-ad-wi">
                <Card className="hotel-hor-card-size" elevation={0}>
                    <img src={Trek} alt="hotel-image" className="card-hotel-img" />
                </Card>
                <Box>
                    <Box className="margin-card-hotel">
                        <img src={Annapurna} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={Annapurna} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={Annapurna} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={Annapurna} alt="hotel-image" className="card-hotel-small-img" />
                    </Box>
                </Box>
              </Box>
              <Box className="card2-ad-wi">
                    <Box className="marriot-display">
                        <Box>
                            <Typography className="hotel-name-heading">Treeking to Annapurna</Typography>
                        </Box>
                        <Box className="fi-star">
                                < FaStar className="fi-star-icon" />
                                < FaStar className="fi-star-icon"  />
                                < FaStar className="fi-star-icon"  />
                                < FiStar className="fi-star-icon"  />
                                < FiStar className="fi-star-icon"  />
                        </Box>
                        <Box className="rating-interval adv-rat">
                            <Typography className="rating-no">3.1/5.0(Good)</Typography>
                            <Typography className="total-ratings">900 User Rated</Typography>
                        </Box>
                    </Box>
                    <Box className="display-hotel-facilities sed-faci-taxi">
                        <Box>
                            <Typography className="facilities-btn">4000m</Typography>
                        </Box>
                        <Box>
                            <Typography className="facilities-btn">Treeking</Typography>
                        </Box>
                        <Box>
                            <Typography className="facilities-btn">Sking</Typography>
                        </Box>
                        <Box>
                            <Typography className="facilities-btn">Camping</Typography>
                        </Box>
                    </Box>
              </Box>
              <Box className="yellow-card">
                <Box className="card-price-hotel">
                    <Typography className="cut-price"><del>Rs. 12000</del></Typography>
                    <Typography className="retain-price">Rs. 10000</Typography>
                </Box>
                 <Box className="book-btn-margin">
                    <Button className="book-btn taxi-bt-bk">Book Now</Button>
                 </Box>
              </Box>
            </Box>

        </Card>
    )
}

export default AdventureCard;