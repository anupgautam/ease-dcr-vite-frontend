import React,{useState} from "react";
import { Button } from "@material-ui/core";

const ButtonCmp = ({
  color='white', 
  backgroundColor="purple", 
  fontSize="12px", 
  fontFamily='Roboto', 
  buttonText="Default",
  buttonIcon,
  border="1px solid pink",
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
    <Button 
    style={{
      color:`${color}`,
      backgroundColor:`${backgroundColor}`,
      fontSize:`${fontSize}`,
      fontFamily:`${fontFamily}`,
      fontWeight:'500px',
      textTransform:'none',
      border:`${border}`,
      padding: "8px 28px",
      boxShadow: isHovering ? '0px 6px 10px rgba(0.1, 0, 0, 0.2)' : '',
      transition:"all 0.3s ease 0.5s",
    }}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onClick={onClick}
  >
    {buttonIcon} {buttonText}
  </Button>
  )
}

export default ButtonCmp;