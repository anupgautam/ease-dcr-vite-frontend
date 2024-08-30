import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

export function useForm(initialFValues, validateOnChange = false, validate, edit) {
    const [values, setValues] = useState(initialFValues);
    const [valueArray, setValueArray] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (edit) {
            setValues(initialFValues);
            setValueArray(initialFValues);
        }
    }, [initialFValues, edit]);

    const handleMultipleInput = (e) => {
        const { name, value } = e.target;
        setValueArray(values => ({
            ...values,
            [name]: typeof value === 'string' ? value.split(',') : value
        }));
        setValues({
            ...values,
            [name]: value
        });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value || ''
        });
        // if (validateOnChange)
        //     validate({ [name]: value });
    };

    const resetForm = () => {
        setValues(initialFValues);
        setErrors({});
    };

    let dateValue = "";
    const handleDateChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
        dateValue = e.join(", ");
    };

    return {
        values,
        setValues,
        dateValue,
        errors,
        setErrors,
        handleDateChange,
        handleInputChange,
        resetForm,
        handleMultipleInput,
        valueArray,
        handleSearchClick,
        handleImageUpload,
    };
}

// Use styled from @mui/material/styles
const StyledForm = styled('form')(({ theme }) => ({
    '& .MuiFormControl-root': {
        width: '80%',
        margin: theme.spacing(1),
    }
}));

export function Form(props) {
    const { children, ...other } = props;
    return (
        <StyledForm {...other}>
            {children}
        </StyledForm>
    );
}
