import React from "react";
import { ListItem} from "@mui/material";
import { Box} from "@mui/system";
import { Link } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";

const InactiveMultiple = ({route, componentName, subComponentName, buttonColor, bgColor}) =>{

    return(
        <ListItem className="nav-link-bar1 drop-down" style={{background: `linear-gradient(to right, ${buttonColor} 50%, ${bgColor} 50%)`}}>
        <Link to={`/${route}`} className="nav-link-bar-text1">
                {componentName}
                <BsChevronDown
                    style={{
                    position: "relative",
                    top: "2px",
                    left: "4px",
                    fontWeight: "700",
                }}
            />
        </Link>
        <Box className="drop-down-list" style={{background: `${buttonColor}`}}>
            {subComponentName.map((key1)=>(
                <Link to={`/${key1.route}`} className="my-dropdown-list-items">
                    {key1.sub}
                </Link>
            ))}   
        </Box>
        </ListItem>
    )
}

export default InactiveMultiple;