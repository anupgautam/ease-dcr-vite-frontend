import React, { useState } from 'react';
import { InputAdornment, TextField, Box } from '@mui/material';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaRegEyeSlash } from 'react-icons/fa';


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
                            {visible ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
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


