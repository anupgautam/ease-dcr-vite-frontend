import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box } from '@mui/material';

export default function InputPassword(props) {
    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    const { name, label, value, error = null, onChange, onKeyUp, className = null } = props;

    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            className={className}
            type={visible ? 'text' : 'password'}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton onClick={toggleVisibility} edge="end">
                            {visible ? <Visibility style={{ color: "#2065d1" }} /> : <VisibilityOff style={{ color: "#2065d1" }} />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
            sx={{
                borderColor: 'white',
                width: '100%',
            }}
            error={!!error}
            helperText={error || ''}
        />
    );
}
