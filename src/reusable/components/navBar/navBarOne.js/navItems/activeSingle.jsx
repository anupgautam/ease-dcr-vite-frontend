import React from "react";
import { ListItem} from "@mui/material";
import { Link } from "react-router-dom";

const ActiveSingle = ({route, componentName, buttonColor}) =>{

    return(
        <ListItem className="nav-link-bar" style={{background: `${buttonColor}`}}>
            <Link to={`/${route}`} className="nav-link-bar-text">
                {componentName}
            </Link>
        </ListItem>
    )
}

export default ActiveSingle;