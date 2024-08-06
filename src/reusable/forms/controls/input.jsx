import React, { forwardRef, useEffect } from 'react';
import { TextField } from '@mui/material';

const Input = forwardRef((props, ref) => {
    const { name, label, value, error = null, onChange, autoFocus = false, id, ...other } = props;
    useEffect(() => {
        if (id && autoFocus) {
            const autoFocus = document.getElementById(id);
            autoFocus.focus();

        }
    }, [autoFocus])

    return (
        <TextField
            id={id}
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            inputRef={ref}
            autoFocus={autoFocus}
            style={{
                borderBlockColor: 'white',
                width: '100%',
                position: 'relative'
            }}
            {...(error && { error: true, helperText: error })}
            {...other}
        />
    );
});

export default Input;
