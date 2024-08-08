import React from 'react'
import { Box } from '@mui/material';

export default function Checkbox(props) {

    const { name, label, value, onChange } = props;


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        <Box>
            <input type={'checkbox'} color="primary"
                checked={value}
                onChange={e => onChange(convertToDefEventPara(name, e.target.checked))} />
            <label style={{ fontSize: '15px', color: "black", fontWeight: "600", marginLeft: '3px' }}>{label}</label>
        </Box>
    )
}