import { Button } from "@mui/material";
import React, {useState} from "react";

// This component contains a icon and text inside button.
// Here in this component we have the following props:
// color:"used to pass the button icon color"
// backgroundColor:'used to pass the button background color'
// buttonIcon:'used as  buttonIcon = {<FaApple style={{paddingRight:'8px', fontSize:'18px'}} />} to use icons inside button'
// buttonText:'used to pass the button text'
// fontsize is for icon size

const TextButton = ({
  color="white", 
  backgroundColor="purple", 
  fontSize="12px", 
  fontFamily=null, 
  buttonText="with icon", 
  buttonIcon,
  onClick
}) =>{
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
    return(
    <>
    <Button 
     style={{
      color:`${color}`,
      backgroundColor:`${backgroundColor}`,
      fontSize:`${fontSize}`,
      fontFamily:`${fontFamily}`,
      textTransform:"capitalize",
      padding: "10px 26px",
      boxShadow: isHovering ? '0px 6px 10px rgba(0.1, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
      transition:"all 0.3s ease 0.5s"
    }}
    onClick={onClick}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    {buttonIcon} {buttonText}
  </Button>
</>
    )
}

export default TextButton;