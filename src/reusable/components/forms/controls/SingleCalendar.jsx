import React from 'react'
import { useState } from 'react';
import DatePicker from "react-multi-date-picker";
import { Calendar } from "react-multi-date-picker"
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


const SingleCalendar = (propsharu) => {

    const { name, label, value, disabled, onChange, error = null } = propsharu
    // 
    const dataValues = (e, name) => {
        let valuedate = e.join(", ")
        onChange({
            target: {
                name, valuedate
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
                <Calendar
                    name={name}
                    label={label}
                    values={value}
                    // disabled={disabled}
                    onChange={(e) => dataValues(e, name, label)}
                    // onChange={(e) => dataValues(e, name)}
                    // onChange={dateValue}
                    sort
                    mapDays={({ date }) => {
                        // let propsholi = {}
                        let isWeekend = [0, 6].includes(date.weekDay.index)

                        if (isWeekend) return {
                            disabled: true,
                            // propsholi.className = "highlight highlight=red"
                            style: { color: "red" },
                        }
                        // return propsholi
                    }}
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

export default SingleCalendar;