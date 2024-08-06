import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import moment from 'moment';
export default function DatePickers(props) {
    const { name, label, value, onChange, excludeDates, date, dateFormat } = props;

    const convertToDefEventPara = (name, value) => ({
        target: {
            name,
            value,
        },
    });
    const handleDateChange = (e) => {
    };
    return (
        <DatePicker
            excludeDates={excludeDates}
            //   placeholderText="DD/MM/YYYY"
            selected={date}
            dateFormat={dateFormat}
            onSelect={(e) => onChange(convertToDefEventPara(name, e))} //when day is clicked
            onChange={handleDateChange} //only when value has changed
            className="new-date-picker-design"
        />
    );
}