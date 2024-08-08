import React from 'react'
import { TextField } from '@mui/material';

export default function Password(props) {

    const { name, label, value, error = null, onChange } = props;
    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            type="password"
            autoComplete="current-password"
            style={{
                borderBlockColor: 'white',
                width: '100%',
            }}
            {...(error && { error: true, helperText: error })}
        />
    )
}