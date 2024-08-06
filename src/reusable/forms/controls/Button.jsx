import React from "react";
import { Button as MuiButton } from "@mui/material";

export default function Button(props) {
  const { text, size, color, variant, onClick, backgroundColor } = props;

  const buttonStyles = {
    margin: "8px",
    textTransform: "none",
    backgroundColor: "#1b284b",
  };

  return (
    <MuiButton
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      onClick={onClick}
      className="contact-us-button"
      style={buttonStyles}
    >
      {text}
    </MuiButton>
  );
}
