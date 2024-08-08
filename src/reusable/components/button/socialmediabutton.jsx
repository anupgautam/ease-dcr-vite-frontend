import { Button } from "@mui/material";
import React, { useState } from "react";

//this is a simple round button used for socialmedia icons
//here the mentioned props are used as:
// color:'used for defining icon color',
//backgroundColor:'used for defining a button background color',
//buttonIcon:'used for defining button icon as buttonIcon={<FaFacebookF />} '

const SocialIconRound = ({
  color = "white",
  backgroundColor = "#125688",
  fontSize = "20px",
  fontFamily = "Sans Serif",
  buttonIcon,
  border,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  return (
    <>
      <button
        style={{
          color: `${color}`,
          backgroundColor: `${backgroundColor}`,
          fontSize: `${fontSize}`,
          fontFamily: `${fontFamily}`,
          padding: "3px 6px ",
          paddingTop: '5px',
          borderRadius: "50%",
          border: `${border}`,
          boxShadow: '0px 8px 15px rgba(0.1, 0, 0, 0.1)',
          transition: "all 0.3s ease 0.5s",
          boxShadow: isHovering ? '0px 6px 10px rgba(0.1, 0, 0, 0.2)' : '',
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {buttonIcon}
      </button>
    </>
  )
}

export default SocialIconRound;