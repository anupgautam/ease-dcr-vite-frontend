import React from 'react'
import DatePicker from 'react-multi-date-picker';
import DatePickerHeader from 'react-multi-date-picker/plugins/date_picker_header';
import "react-multi-date-picker/styles/layouts/prime.css"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import {
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    FormHelperText,
    Box
} from "@mui/material";

const MultiMonth = (propsharu) => {

    const { name, label, value, onChange, error } = propsharu

    const dataValues = (e, name) => {
        let valuedate = e.join(", ")
        onChange({
            target: {
                name, valuedate
            }
        })
    }

    // let finalValue = "";
    // const dataValues = e => {
    //     finalValue = e.join(", ")
    // }


    return (
        <FormControl variant="outlined" {...(error && { error: true })}>
            <InputLabel>{label}</InputLabel>

            <DatePicker
                multiple
                onlyMonthPicker
                name={name}
                label={label}
                values={value}
                // onChange={dataValues}
                onChange={(e) => dataValues(e, name)}
                sort
                plugins={[
                    <DatePanel
                        // position={isRTL ? "left" : "right"}
                        sort="date"
                    // eachDaysInRange={!props.onlyMonthPicker && !props.onlyYearPicker}
                    />,
                    <DatePickerHeader
                        position="top"
                        size="small"
                    />,
                ]}
                style={{
                    width: "98.5%",
                    height: "50px",
                    textAlign: 'start'
                }}
            />
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    )
}

export default MultiMonth;
