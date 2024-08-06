import { Card, Box, Typography, Button} from "@mui/material";
import React from "react";
import Taxi from "../../static/pack up/taxi1.jpg"
import TaxiImg from "../../static/pack up/taxi2.png"
import {FiStar} from "react-icons/fi"
import {FaStar} from "react-icons/fa"
import {TfiLocationPin} from "react-icons/tfi";
import {GiFuelTank} from "react-icons/gi";
import {FcCancel} from "react-icons/fc";

const TaxiCard = () =>{
    return(
        <Card className="hotel-horizontal-card-design" elevation={0}>
            <Box className="hotel-hor-card-display">
              <Box className="card1-ad-wi">
                <Card className="hotel-hor-card-size tx-car-siz" elevation={0}>
                    <img src={Taxi} alt="hotel-image" className="card-hotel-img" />
                </Card>
                <Box>
                    <Box className="margin-card-hotel">
                        <img src={TaxiImg} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={TaxiImg} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={TaxiImg} alt="hotel-image" className="card-hotel-small-img" />
                        <img src={TaxiImg} alt="hotel-image" className="card-hotel-small-img" />
                    </Box>
                </Box>
              </Box>
              <Box className="card2-ad-wi">
            <Box className="marriot-display">
              <Box>
                <Typography className="hotel-name-heading">Maruti, Suzuki</Typography>
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
              <Box className="display-hotel-facilities sed-faci-taxi">
                <Box>
                    <Typography className="facilities-btn">Sedan</Typography>
                </Box>
                <Box>
                    <Typography className="facilities-btn">Air Conditioner</Typography>
                </Box>
                <Box>
                    <Typography className="facilities-btn">4 seats</Typography>
                </Box>
            </Box>
             <Box>
                <Typography className="spacious-car">Spacious Car</Typography>
                <Box className="display-all-fare-taxi">
                    <Box className="fare-marg-km-fare">
                        <Typography className="exta-km-fare"> <TfiLocationPin style={{ color:'blue', fontSize:'14px', marginRight:'5px'}}/>Extra km fares</Typography>
                        <Typography className="exta-km-fare"> <GiFuelTank style={{ color:'blue', fontSize:'14px', marginRight:'5px'}}/>Fuel Type</Typography>
                        <Typography className="exta-km-fare"> <FcCancel style={{ fontSize:'14px', marginRight:'5px'}}/>Cancellation</Typography>
                    </Box>
                    <Box>
                        <Typography className="exta-km-fare">Rs.100 per Km</Typography>
                        <Typography className="exta-km-fare">Petrol</Typography>
                        <Typography className="exta-km-fare-cancelation">Till 6 hours of departure no charge is added.</Typography>
                    </Box>
                </Box>
             </Box>

              </Box>
              <Box className="yellow-card">
                <Box className="card-price-hotel">
                  <Typography style={{color:'red', fontSize:"12px",paddingLeft:'10px' }}>25% off</Typography>
                 <Typography className="cut-price"><del>Rs. 3000</del></Typography>
                 <Typography className="retain-price">Rs. 2500</Typography>
                 </Box>
                 <Box className="service-charge" >
                    <Typography className="service-charge-txt taxi-onwards">Onwards</Typography>
                 </Box>
                 <Box className="book-btn-margin">
                    <Button className="book-btn taxi-bt-bk">Book Now</Button>
                 </Box>
              </Box>
            </Box>

        </Card>
    )
}

export default TaxiCard;