import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function MonthPicker(props) {
    const { onChange, value } = props;
    const [startMonth, setStartMonth] = useState();
    const [monthData, setMonthData] = useState('');

    const handleMonthChange = (date) => {
        setStartMonth(date)
        if (date) {
            const MonthData = date.toLocaleString('default', { month: 'long' })
            setMonthData(MonthData)
        }
    }
    return (
        <DatePicker
            showIcon
            selected={value}
            onChange={onChange}
            dateFormat="MM/yyyy"
            placeholderText="Select the Month"
            showMonthYearPicker
        />
    )
}