import React from "react";
import { Button as MuiButton, styled } from "@mui/material";

const StyledButton = styled(MuiButton)(({ theme, backgroundColor }) => ({
  margin: theme.spacing(0.5),
  textTransform: "none",
  backgroundColor: backgroundColor || "#1b284b",
}));

export default function Button(props) {
  const { text, size = "large", color = "primary", variant = "contained", onClick, backgroundColor } = props;

  return (
    <StyledButton
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      onClick={onClick}
      className="contact-us-button"
      backgroundColor={backgroundColor}
    >
      {text}
    </StyledButton>
  );
}
