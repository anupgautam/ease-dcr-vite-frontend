import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';

const MultiSelectAutocomplete = ({
    options = [],
    label = 'Select Options',
    getOptionLabel = (option) => option.title,
    onChange = () => { },
    renderOption,
    initialSelected = [],
    error = null, // Accept error prop
}) => {
    const [selectedOptions, setSelectedOptions] = useState(initialSelected);

    const handleChange = (event, value) => {
        const selectedIds = value.map((option) => option.id);
        setSelectedOptions(selectedIds);
        onChange(selectedIds); // Pass selected values to the parent
    };

    return (
        <FormControl fullWidth error={!!error} style={{ marginBottom: '1rem' }}>
            <Autocomplete
                multiple
                options={options}
                getOptionLabel={getOptionLabel}
                onChange={handleChange}
                value={options.filter((option) => selectedOptions.includes(option.id))}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        variant="outlined"
                        error={!!error}
                    />
                )}
                renderOption={renderOption}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default MultiSelectAutocomplete;
