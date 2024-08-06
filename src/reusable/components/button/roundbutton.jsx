import { Button } from "@mui/material";
import React, { useState } from "react";

// this is a simple regular round button component with the following props:
// color:"used to pass the button text color"
// backgroundColor:'used to pass the button background color'
// fontsize: is for button text size, and fontFamily: is for text fontFamily
// buttonText: used to pass the text inside button.

const RoundButton = ({
  color,
  backgroundColor,
  fontSize,
  fontFamily = null,
  buttonText,
  handleClick,
  className
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
      <Button
        style={{
          color: `${color}`,
          backgroundColor: `${backgroundColor}`,
          fontSize: `${fontSize}`,
          fontFamily: `${fontFamily}`,
          padding: "6px 28px",
          borderRadius: "45px",
          boxShadow: isHovering ? '0px 6px 10px rgba(0.1, 0, 0, 0.2)' : 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',
          transition: "all 0.3s ease 0.5s",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </>
  )
}

export default RoundButton;