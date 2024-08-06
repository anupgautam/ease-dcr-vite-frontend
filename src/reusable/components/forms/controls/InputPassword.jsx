import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
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
                    <InputAdornment position="end" style={{ marginRight: '0px' }}>
                        <Box onClick={toggleVisibility}>
                            {visible ? <VisibilityIcon style={{ color: "#2065d1" }} /> : <VisibilityOffIcon style={{ color: "#2065d1" }} />}
                        </Box>
                    </InputAdornment>
                ),
            }}
            style={{
                borderBlockColor: 'white',
                width: '100%',
            }}
            {...(error && { error: true, helperText: error })}
        />
    )
}


