import React from 'react'
import { useState } from 'react';
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/layouts/prime.css"
import DatePickerHeader from "react-multi-date-picker/plugins/date_picker_header"
import DatePanel from "react-multi-date-picker/plugins/date_panel"

import {
    FormControl,
    InputLabel,
    Select as MuiSelect,
    MenuItem,
    FormHelperText,
    Box,
    TextField
} from "@mui/material";


const MultiCalendar = (props) => {

    const { name, label, value, onChange, error = null } = props

    const dataValues = (e, name) => {
        let value = e.join(", ")
        onChange({
            target: {
                name, value
            },
        })

    }

    let finalValue = ""
    // const dateValue = e => {
    //     finalValue = e.join(", ")
    //     // 

    // }
    // 

    return (
        <>
            <FormControl variant="outlined" {...(error && { error: true })}>
                <InputLabel>{label}</InputLabel>
                <DatePicker
                    multiple
                    name={name}
                    label={label}
                    values={value}
                    // onChange={onChange}
                    onChange={(e) => dataValues(e, name, label)}
                    // onChange={(e) => dataValues(e, name)}
                    // onChange={dateValue}
                    sort
                    // mapDays={({ date }) => {
                    //     let propsholi = {}
                    //     let isWeekend = [0, 6].includes(date.weekDay.index)
                    //     if (isWeekend) {
                    //         propsholi.className = "highlight highlight=red"
                    //     }
                    //     return propsholi
                    // }}
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
                // containerStyle={{
                //     width: "100%"
                // }}
                />
                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
        </>


    )
}

export default MultiCalendar;