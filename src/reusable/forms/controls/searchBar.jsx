import React from 'react';
import { TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Search = (props) => {
    const { onChange, name } = props;

    return (
        <TextField
            variant="outlined"
            placeholder="Search..."
            size="small"
            onChange={onChange}
            name={name}
            InputProps={{
                startAdornment: (
                    <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                ),
                sx: {
                    height: '34px',
                    borderRadius: '5px',
                },
            }}
            fullWidth
        />
    );
};

export default Search;
