import React, {useState} from "react";
import { ListItem} from "@mui/material";
import { Link } from "react-router-dom";

const InactiveSingle = ({route, componentName, bgColor, buttonColor}) =>{
    const [hover, setHover] = useState(false);

    return(
        <ListItem className="nav-link-bar1" style={{
            ...(hover?{backgroundPosition:"left bottom",
                      background:`linear-gradient(to right, #5c187c 50%, #efdafa 50%)`}:
                      {backgroundPosition:"right bottom",
                      background:`linear-gradient(to right, #5c187c 50%, #efdafa 50%)`})}}
            onMouseOver={()=>setHover(true)}
            onMouseOut={()=>setHover(false)}>
            <Link to={`/${route}`} className="nav-link-bar-text1">
                {componentName}
            </Link>
        </ListItem>
    )
}

export default InactiveSingle;