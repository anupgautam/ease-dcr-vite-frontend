import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Controls from "./controls/Controls";
import { Form, useForm1 } from "./useForm";
import { useNavigate } from "react-router-dom";
import { OriginalForm, SelectForm } from "./originalForm";
import { useSelector } from 'react-redux';


const AddFormSkeleton = ({ initialData, AddAPI, isNavigation, navigation, navigationId }) => {
    const { company_id, user_role, company_user_id, access } = useSelector((state) => state.cookie);

    const [keyData, setKeyData] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        const data = {};
        initialData.forEach((key) => {
            data[key.name] = key.initialValue;
        })
        setKeyData(initialData);

    }, [initialData])

    const [initialFValues, setInitialFValues] = useState(keyData);

    const {
        values,
        setValues,
        handleInputChange,
        resetForm,
        valueArray,
        handleInputChangeMultiple,
    } = useForm1(initialFValues, true,);

    const [HotelRoom, data] = AddAPI();
    useEffect(() => {
        if (data.isSuccess == true && isNavigation) {
            navigate(`${navigation}/${data.data[navigationId]}`)
        }
    }, [data])


    const handleSubmit = e => {

        e.preventDefault()
        const Data = {}
        initialData.map((key) => {
            Data[key.name] = values[key.name]
        })
        Data['access'] = access;
        HotelRoom(Data);

    }

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container >
                <Grid item xs={6}>
                    {initialData.map((key) => (
                        <>
                            {key.ControlType === "input" ?
                                <Controls.Input
                                    name={key.name}
                                    label={key.label}
                                    value={values[key.name]}
                                    onChange={handleInputChange}
                                /> : <>{key.ControlType === "checkbox" ?
                                    <Controls.Checkbox
                                        name={key.name}
                                        label={key.label}
                                        value={values[key.name]}
                                        onChange={handleInputChange}
                                    /> :
                                    <></>}
                                    <>
                                        {
                                            key.ControlType === "select" ?
                                                <SelectForm
                                                    allKey={key}
                                                    values={values}
                                                    handleInputChange={handleInputChange}
                                                /> :
                                                <></>
                                        }
                                    </>
                                </>
                            }
                        </>

                    ))}

                    <Controls.Button
                        type="submit"
                        text="Submit"
                        onClick={handleSubmit}
                    />
                </Grid>
            </Grid>

        </Form>
    )
}

export default AddFormSkeleton;