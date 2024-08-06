import React, { useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import DatePickerHeader from 'react-multi-date-picker/plugins/date_picker_header';
import "react-multi-date-picker/styles/layouts/prime.css";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import {
    FormControl,
    InputLabel,
    FormHelperText,
} from "@material-ui/core";

const SingleMonth = (props) => {
    const { name, label, defaultValue, onChange, error } = props;
    const [value, setValue] = useState(defaultValue || null);

    const handleChange = (e, name) => {
        const valuedate = e.join(", ");
        setValue(valuedate);
        if (onChange) {
            onChange({
                target: {
                    name: name,
                    value: valuedate
                }
            });
        }
    };

    return (
        <FormControl variant="outlined" {...(error && { error: true })}>
            <InputLabel>{label}</InputLabel>

            <DatePicker
                onlyMonthPicker
                name={name}
                // label={label}
                values={value}
                // values={'january'}
                onChange={(e) => handleChange(e, name)}
                sort
                plugins={[
                    <DatePanel sort="date" />,
                    <DatePickerHeader position="top" size="small" />,
                ]}
                style={{
                    width: "98.5%",
                    height: "50px",
                    textAlign: 'start'
                }}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
};

export default SingleMonth;
