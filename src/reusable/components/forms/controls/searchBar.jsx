import React from "react";
import SearchBar from "material-ui-search-bar";


const Search = (props) => {
    const { onChange, name, className = null } = props;
    return (
        <SearchBar
            style={{
                height: "34px",
                borderRadius: "5px",    
                // marginRight: "1rem",
            }}
            onChange={onChange}
            name={name}
            className={className}
        />

    )
}

export default Search;