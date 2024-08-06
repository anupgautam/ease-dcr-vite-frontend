import { Grid} from "@mui/material";
import React from "react";

const Logo = ({logoImage}) =>{
    return(
            <img src={logoImage} className="logo-image-width" alt="logo-png" />
    )
}

export default Logo;
