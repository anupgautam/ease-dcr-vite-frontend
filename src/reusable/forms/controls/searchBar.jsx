import React from "react";
import SearchBar from "material-ui-search-bar";


const Search = (props) =>{
    

    const {onChange, name } = props;
return(
        <SearchBar
            style={{
                    height: "34px",
                    borderRadius: "5px",
                    // marginRight: "1rem",
                    }}
            onChange={onChange}
            name={name}        
            />
            
    )
}

export default Search;