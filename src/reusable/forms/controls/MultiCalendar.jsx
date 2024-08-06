import React, { useState } from 'react'
import DatePicker from "react-multi-date-picker"
import indian from "react-date-object/calendars/indian"
import indian_hi from "react-date-object/locales/indian_hi"

const MultiCalendar = (props) => {
    const { name, value, onChange, format, calendar, className } = props;



    return (
        <DatePicker
            name = {name}
            value={value}
            onChange={onChange}
            calendar={calendar}
            format={format}
            className={className}
            sort    
            multiple
            mapDays={({ date }) => {
                let props = {}
                let isWeekend = [0, 6].includes(date.weekDay.index)

                if (isWeekend) {
                    props.className = "highlight highlight-red"
                }
                return props
            }}
        />
    )
}

export default MultiCalendar    