import { 
    Container, 
    List, 
    ListItem,  
    Typography,
    Box,
    Grid,
     
} from "@mui/material";
import React from "react";
import {BiChevronRight} from "react-icons/bi";
import {FaFacebookF, FaInstagram, FaLinkedin, FaTwitter, FaYoutube} from 'react-icons/fa';
import {TiSocialTwitterCircular, TiSocialYoutubeCircular} from 'react-icons/ti';
import {SlSocialInstagram} from 'react-icons/sl';
import {CiLinkedin} from 'react-icons/ci';
import PayPal from "../static/pack up/paypal.png"
import MasterCard from "../static/pack up/mastercard.png"
import Visa from "../static/pack up/visa.png"
import Esewa from "../static/pack up/esewa.webp"
import Khalti from "../static/pack up/khalti.png"
import Ime from "../static/pack up/ime.png"
import Ios from "../static/pack up/ios.png"
import Android from "../static/pack up/android.png"
import SocialIconRound from "./button/socialmediabutton";

const Footer = () =>{
    return(
        <>
        <FooterPage />
        </>
    )
}

const FooterPage = () =>{
    return(
        <Box className="footer-bg">
            <Container className="footer-container">
                <Grid container spacing={1}>
                    <Grid item xs={2}>
                         <Box>
                            <Typography className="pack-up about-pack-up">
                                About Pack Up
                            </Typography>
                            <List>
                                <ListItem>
                                    <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        About us
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Resources and Policies
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Our Team
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon"/>
                                    <Typography className="footer-list-text">
                                        Career with us
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Contact us
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Trust and Safety
                                    </Typography>
                                </ListItem>
                            </List>
                         </Box>
                    </Grid>
                    <Grid item xs={2}>
                        <Box>
                            <Typography className="pack-up about-pack-up">Explore More</Typography>
                            <List>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Book Flights
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Book Hotel
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon"/>
                                    <Typography className="footer-list-text">
                                        Book Picnic
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Refer and Earn
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Bus
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Cabs
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon"/>
                                    <Typography className="footer-list-text">
                                        Holiday Packages
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        Domestic Flights
                                    </Typography>
                                </ListItem>
                                <ListItem>
                                        <BiChevronRight className="footer-chevron-icon" />
                                    <Typography className="footer-list-text">
                                        International Flights
                                    </Typography>
                                </ListItem>
                            </List>
                        </Box>
                    </Grid>
                    <Box className="vertical-line"></Box>
                    <Grid item xs={4}>
                         <Box>
                            <Typography className="pack-up">Payment Methods</Typography>
                            <Box className="cards-icons-png">
                                <img src={PayPal} className="paypal" />
                                <img src ={MasterCard} className="mastercard" />
                                <img src={Visa} className="visa" />
                                </Box>
                                <Box className="cards-icons-png">
                                <img src={Esewa} className="esewa" />
                                <img src ={Khalti} className="khalti"/>
                                <img src={Ime} className="ime"/>
                            </Box>
                            <Box>
                                <Typography className="social-media">Social Media</Typography>
                                <Box className="media-icon-display">
                                <Box className="social-media-icons">
                                    <SocialIconRound 
                                        color="white" 
                                        buttonIcon={<FaFacebookF/>} 
                                        backgroundColor="rgb(56, 56, 56)" 
                                        border="1.5px solid white" 
                                        fontSize="12spx"
                                    />
                                    </Box>
                                    <Box  className="social-media-icons">
                                    <SocialIconRound 
                                        color="white" 
                                        buttonIcon={<FaTwitter/>} 
                                        backgroundColor="rgb(56, 56, 56)" 
                                        border="1.5px solid white" 
                                        fontSize="12spx"
                                    />
                                    </Box>
                                    <Box className="social-media-icons">
                                    <SocialIconRound 
                                        color="white" 
                                        buttonIcon={<FaYoutube/>} 
                                        backgroundColor="rgb(56, 56, 56)" 
                                        border="1.5px solid white" 
                                        fontSize="12spx"
                                    />
                                    </Box>
                                    <Box className="social-media-icons">
                                    <SocialIconRound 
                                        color="white" 
                                        buttonIcon={<FaInstagram/>} 
                                        backgroundColor="rgb(56, 56, 56)" 
                                        border="1.5px solid white" 
                                        fontSize="12spx"
                                    />
                                    </Box>
                                    <Box className="social-media-icons">
                                    <SocialIconRound 
                                        color="white" 
                                        buttonIcon={<FaLinkedin/>} 
                                        backgroundColor="rgb(56, 56, 56)" 
                                        border="1.5px solid white" 
                                        fontSize="12spx"
                                    />
                                </Box>
                                </Box>
                            </Box>
                         </Box>
                    </Grid>
                    <Box className="vertical-line-right"></Box>
                    <Grid item xs={2}>
                        <Box>
                            <Typography className="pack-up">Download App</Typography>
                            <Box>
                                <img  src={Ios} alt="download from app store" className="ios"/>
                                <img src={Android} alt="download from google play" className="ios" />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
            <Box>
                <Box className="horizontal-line"></Box>
                <Box>
                    <Typography className="copyright">Copyright @ 2022. All Rights Reserved. Design and Developed by G.& D. Developers</Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default Footer;