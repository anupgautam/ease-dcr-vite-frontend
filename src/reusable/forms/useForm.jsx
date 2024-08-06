import React, { useEffect, useState } from 'react'
import { makeStyles } from "@material-ui/core";
import { create } from '@mui/material/styles/createTransitions';


export function useForm(initialFValues, validateOnChange = false, validate, edit) {

    // 
    const [values, setValues] = useState(initialFValues);

    const [valueArray, setValueArray] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // 
        if (edit) {
            setValues(initialFValues);
            setValueArray(initialFValues);
        }
    }, [initialFValues])


    const handleMultipleInput = (e) => {
        const { name, value } = e.target;

        // setValueArray(typeof value === 'string' ? value.split(',') : value)
        setValueArray(values => ({
            ...values,
            [name]: typeof value === 'string' ? value.split(',') : value
        }));
        setValues({
            ...values,
            [name]: value
        })
    }



    //

    const handleSearchClick = (e) => {
        const keys = Object.keys(values);
        setValues({
            ...values,
            [keys[0]]: e
        })
    }

    const handleImageUpload = (name, file) => {
        setValues({
            ...values,
            [name]: file
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        // if (validateOnChange)
        //     validate({ [name]: value })
    }

    // const handleMultipleDate = (dateValues, dateNames) => {
    //     
    //     // const {  value } = e.target
    //     // 
    //     setValues({
    //         ...values,
    //         // [name]: value
    //     })
    // }


    // const handleMultipleDate = (e) => {
    //     const { name, value } = e.target
    //     if (Array.isArray(e)) {
    //         
    //     // const finalValue = e.join(", ");
    //     setValues({
    //         ...values,
    //         [name]: value
    //     })  
    //     
    //     }
    // }

    const resetForm = () => {
        setValues(initialFValues);
        setErrors({})
    }

    // ! Date function
    let dateValue = "";
    const dataValues = e => {
        dateValue = e.join(", ")
    }

    const handleDateChange = e => {
        const { name, value } = e.target
        setValues({
            ...values,
            [name]: value
        })
        dateValue = e.join(", ")

    }

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
    }
}


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1)
        }
    }
}))

export function Form(props) {

    const classes = useStyles();
    const { children, ...other } = props;
    return (
        <form className={classes.root} {...other}>
            {props.children}
        </form>
    )
}