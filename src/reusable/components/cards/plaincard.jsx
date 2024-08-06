import { Card, Box, Typography } from "@material-ui/core";
import React from "react";

//this component contains a plain card with image and image text
// imageText props is used to pass a text over a image
//image props is used to pass image inside the card
//fontSize, fontFamily, textColor is used to define a image text size, color and font.
//width and height props are used to pass the card width and height as per requirement.

const PlainCard = ({
  imageText="Durbar Square", 
  width="350px", 
  height="250px", 
  image,
  fontSize="20px", 
  fontFamily="Sans Serif",
  textColor="white",
  bgcolor="rgba(0, 0, 0, 0.5)",
  opacity="0.9"
}) =>{
    return(
        <Box>
            <Card 
               style={{
                  width:`${width}`,
                  height:`${height}`,
                  boxShadow: 'rgb(44 44 44 / 25%) 0px 14px 28px, rgb(42 41 41 / 22%) 0px 10px 10px',
                  borderRadius:'6px',
                  position:'relative',
               }}
            >
                <img 
                  src={image}  
                  style={{
                    width:'100%',
                    height:'100%',
                    backgroundSize:'cover',
                    borderRadius:'6px',            
                  }}
                />
                <Box
                  style={{
                    position:'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0',
                    left: '0',
                    backgroundColor:`${bgcolor}`,
                    opacity:`${opacity}`,
                  }}
                 >
                <Typography 
                  style={{
                    fontSize:`${fontSize}`,
                    fontFamily:`${fontFamily}`,
                    color:`${textColor}`,
                    textTransform:'capitalize',
                    marginTop:'12rem',
                    marginLeft:'10px',
                    marginRight:'10px',
                    fontWeight:"600",
                  }}
                >
                    {imageText}
                </Typography>
                </Box>
            </Card>
        </Box>
    )
}
export default PlainCard;