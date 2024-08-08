import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const Search = (props) => {
    const { onChange, name, className = null } = props;

    return (
        <TextField
            variant="outlined"
            size="small"
            name={name}
            onChange={(e) => onChange(e.target.value)}
            className={className}
            placeholder="Search..."
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
                style: {
                    height: "34px",
                    borderRadius: "5px",
                },
            }}
            fullWidth
        />
    );
};

export default Search;
