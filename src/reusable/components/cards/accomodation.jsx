import React, {useState} from "react";
import { Box, Typography, Grid,} from "@mui/material";
import { Card } from "@material-ui/core";
import {BsChevronDown} from "react-icons/bs"
import SimpleCarousel from "../Carousel/simplecarousel";
import Adventure2 from "../../static/images/adventure.avif"
import Adventure4 from "../../static/images/trekking.jpg"

const Accomodation = () =>{
    const ImageData = 
    {
      image:[Adventure2, Adventure4]
    };
    const [myShow,setMyshow] = useState(false);
    const [myShow1,setMyshow1] = useState(false);
    const [myShow2,setMyshow2] = useState(false);
    const [myShow3,setMyshow3] = useState(false);
    return(
        <Box>
            <Grid container spacing={0}>
                <Grid item xs={3.5}>
                    <Card className="surroundings-card">
                        <Box className="loacation-box">
                            <Typography className="key-surroundings">Hotel List You will Accomodate</Typography>
                        </Box> 
                        <Box className="key-landmark-box">
                            <Typography className="landmark-txt">Royal Singh Hotel (Kathmandu, Nepal)</Typography>
                            <Box onClick={!myShow==true?()=>setMyshow(true):()=>setMyshow(false)}>
                            <BsChevronDown className="bs-chevron-down" />
                            </Box>
                        </Box>
                        <Box className="hr-line-landmark"></Box>
                        <Box className="key-landmark-box">
                            <Typography className="landmark-txt">Tea House(Birethanti)</Typography>
                            <BsChevronDown className="bs-chevron-down" />
                        </Box>
                        <Box className="hr-line-landmark"></Box>
                        <Box className="key-landmark-box">
                            <Typography className="landmark-txt">Mount Kailash Resort(Sinuwai)</Typography>
                            <BsChevronDown className="bs-chevron-down" />
                        </Box>
                        <Box className="hr-line-landmark"></Box>
                        <Box className="key-landmark-box">
                            <Typography className="landmark-txt">Others</Typography>
                            <BsChevronDown className="bs-chevron-down" />
                        </Box>
                        <Box className="hr-line-landmark"></Box>
                    </Card>
                </Grid>
                <Grid item xs={8.5}>
                    <Card className="surroundings-card">
                        <Box>
                            <SimpleCarousel
                            ImageData={ImageData}
                            width="100%"
                            height="100%"
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Accomodation