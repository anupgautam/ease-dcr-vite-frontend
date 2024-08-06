import React from "react";
import { ListItem} from "@mui/material";
import { Box} from "@mui/system";
import { Link } from "react-router-dom";
import { BsChevronDown } from "react-icons/bs";

const ActiveMultiple = ({route, componentName, subComponentName, buttonColor}) =>{

    return(
        <ListItem className="nav-link-bar drop-down" style={{background: `${buttonColor}`}}>
        <Link to={`/${route}`} className="nav-link-bar-text">
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

export default ActiveMultiple;