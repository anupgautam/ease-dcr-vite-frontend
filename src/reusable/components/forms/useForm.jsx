import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

export function useForm1(initialFValues, validateOnChange = false, validate, edit) {
    const [values, setValues] = useState(initialFValues);
    const [valueArray, setValueArray] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (edit) {
            setValues(initialFValues);
        }
    }, [initialFValues, edit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
        if (validateOnChange)
            validate({ [name]: value });
    };

    const handleInputChangeMultiple = (a, b) => {
        setValues({ ...values, [b]: a });
    };

    const handleMultipleInput = (e) => {
        const { name, value } = e.target;
        setValueArray(typeof value === 'string' ? value.split(',') : value);
        setValues({
            ...values,
            [name]: value
        });
        if (validateOnChange)
            validate({ [name]: value });
    };

    const resetForm = () => {
        setValues(initialFValues);
        setErrors({});
    };

    const handleSearchClick = (e) => {
        const keys = Object.keys(values);
        setValues({
            ...values,
            [keys[0]]: e
        });
    };

    const handleImageUpload = (name, file) => {
        setValues({
            ...values,
            [name]: file
        });
    };

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [startMonth, setStartMonth] = useState();
    const [monthData, setMonthData] = useState('');
    const handleMonthChange = (date) => {
        setStartMonth(date);
        if (date) {
            const MonthData = date.toLocaleString('default', { month: 'long' });
            setMonthData(MonthData);
        }
    };

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
        handleMultipleInput,
        valueArray,
        handleSearchClick,
        handleImageUpload,
        handleInputChangeMultiple,
        handleMouseDownPassword,
        handleClickShowPassword,
        handleMonthChange,
        monthData
    };
}

// Replace makeStyles with styled from @mui/material/styles
const StyledForm = styled('form')(({ theme }) => ({
    '& .MuiFormControl-root': {
        width: '80%',
        margin: theme.spacing(1),
    }
}));

export function Form(props) {
    const { children, ...other } = props;
    return (
        <StyledForm autoComplete="off" {...other}>
            {children}
        </StyledForm>
    );
}
