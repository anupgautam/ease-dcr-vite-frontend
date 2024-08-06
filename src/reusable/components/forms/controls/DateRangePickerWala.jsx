import React from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'


const DateRangePickerWala = (props) => {


    const handleSelect = e => {
        
    }

    const selectionRange = {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }
    return (
        <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
        />
    )
}

export default DateRangePickerWala