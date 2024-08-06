import React, { useState, useEffect } from 'react'
import { Grid } from "@mui/material";
import Controls from '../../components/forms/controls/Controls';
import {
    Form,
    useForm1
} from '../../components/forms/useForm';
import useDebounce from '../../components/forms/utils/debounce';
import { OriginalForm, SelectForm } from './originalForm';
import { useSelector } from 'react-redux';


const AddBedForm = ({ index, setId, idList, setIsCreate, originalId, repeatableFormData }) => {

    const Data = {}
    useEffect(() => {
        repeatableFormData[0].dataRepeat.map((key) => {

            Data[key.name] = key.initialValue;

        })
        repeatableFormData[0].dataMap.map((key) => {
            if (key.show === true) {
                Data[key.name] = key.initialValue;
            }
        })
    }, [repeatableFormData[0]])

    const [initialFValues, setInitialFValues] = useState(Data);

    const [addHotelBed, { data }] = repeatableFormData[0].postFormAPI();
    const [addHotelBedRoom] = repeatableFormData[0].postFormMapAPI();

    const DataMap = {}

    useEffect(() => {
        if (data) {
            setId([...idList, data.id]);
            repeatableFormData[0].dataMap.map((key) => {
                if (key.meta === "original") {
                    DataMap[key.name] = originalId
                }
                else if (key.meta === 'map') {
                    DataMap[key.name] = data.id
                }
                else if (key.meta === 'extra') {
                    DataMap[key.name] = initialFValues[key.name]
                }
            })
            addHotelBedRoom(DataMap)

            setIsCreate(false);
        }
    }, [data])

    const {
        values,
        setValues,
        handleInputChange,
        resetForm,
        valueArray,
    } = useForm1(initialFValues, true);

    useEffect(() => {

        if (index === 0) {
            addHotelBed(initialFValues);
        }

    }, [index])

    return (

        <Grid container >
            <Grid item xs={6}>
                {
                    repeatableFormData[0].dataRepeat.map((key) => (
                        <>
                            {key.ControlType === "select" ?
                                <SelectForm allKey={key} values={values} handleInputChange={handleInputChange} /> :
                                <OriginalForm allKey={key} values={values} handleInputChange={handleInputChange} />
                            }
                        </>
                    ))
                }
                {
                    repeatableFormData[0].dataMap.map((key) => (
                        <>
                            {key.ControlType === "select" ?
                                <SelectForm allKey={key} values={values} handleInputChange={handleInputChange} /> :
                                <OriginalForm allKey={key} values={values} handleInputChange={handleInputChange} />
                            }
                        </>
                    ))
                }
            </Grid>
        </Grid>
    )
}



const EditBedForm = ({ index, repeatableFormData }) => {

    const [value, setValue] = useState(0);
    const Data = {}
    var valueArray = []
    var debounceLessValueArray = []
    useEffect(() => {
        repeatableFormData[0].dataRepeat.map((key) => {
            Data[key.name] = key.initialValue;
        })
        repeatableFormData[0].dataMap.map((key) => {
            if (key.show === true) {
                Data[key.name] = key.initialValue;
            }
        })
    }, [repeatableFormData[0]])

    const [initialFValues, setInitialFValues] = useState(Data);

    const HotelBeds = repeatableFormData[0].getSingleAPI(index);
    const [Change1, setChange1] = useState(false);
    const [updateHotelBed] = repeatableFormData[0].updateFormAPI();

    useEffect(() => {
        const DataFull = {}


        if (HotelBeds.data) {
            repeatableFormData[0].dataRepeat.map((key) => {
                DataFull[key['name']] = HotelBeds.data[key['name']]
            })
            setInitialFValues(DataFull);
        }
        setChange1(true);
    }, [HotelBeds.data]);

    const {
        values,
        handleInputChange,
    } = useForm1(initialFValues, true, false, true);


    repeatableFormData[0].dataRepeat.map((key) => {
        if (key.debounceTime > 0) {
            valueArray.push(values[key.name]);
        }
        else {
            debounceLessValueArray.push(values[key.name]);
        }
    })

    useEffect(() => {
        setValue(value + 1)
    }, valueArray)

    useEffect(() => {
        const formData = new FormData();
        repeatableFormData[0].dataRepeat.map((key) => {
            formData.append(key.name, values[key.name])
        })

        formData.append(repeatableFormData[0].primaryKey, index);
        if (Change1) {
            updateHotelBed(formData);
        }

    }, [useDebounce(value, 3000), ...debounceLessValueArray])


    return (

        <Grid container >
            <Grid item xs={6}>
                {
                    repeatableFormData[0].dataRepeat.map((key) => (
                        <>
                            {key.ControlType === "select" ?
                                <SelectForm allKey={key} values={values} handleInputChange={handleInputChange} /> :
                                <OriginalForm allKey={key} values={values} handleInputChange={handleInputChange} />
                            }
                        </>
                    ))
                }
                {
                    repeatableFormData[0].dataMap.map((key) => (
                        <>
                            {key.ControlType === "select" ?
                                <SelectForm allKey={key} values={values} handleInputChange={handleInputChange} /> :
                                <OriginalForm allKey={key} values={values} handleInputChange={handleInputChange} />
                            }
                        </>
                    ))
                }
                {
                    repeatableFormData[0].dataMap.map((key) => (
                        <>{key.ControlType === "input" && key.show ?
                            <Controls.Input
                                name={key.name}
                                label={key.label}
                                value={values[key.name]}
                                onChange={handleInputChange}
                            /> : <>{key.ControlType === "checkbox" && key.show ?
                                <Controls.Checkbox
                                    name={key.name}
                                    label={key.label}
                                    value={values[key.name]}
                                    onChange={handleInputChange}
                                /> : <></>}<>
                                    {
                                        key.ControlType === "select" ?
                                            <Controls.Select
                                                name={key.name}
                                                label={key.label}
                                                value={values[key.name]}
                                                onChange={handleInputChange}
                                            /> :
                                            <></>
                                    }
                                </>
                            </>}</>
                    ))
                }
            </Grid>
        </Grid>
    )
}

const EditRoomForm = ({ initialData, originalId, getSingleAPI, updateAPI, primaryKey }) => {
    const valueArray = []
    const debounceLessValueArray = []
    const [value, setValue] = useState(0);

    const HotelRooms = getSingleAPI(originalId);

    const [ChangeTrue, setChangeTrue] = useState(false);
    const initial = {}
    useEffect(() => {
        initialData.forEach((key) => {
            initial[key['name']] = key['initialValue']
        })

    }, [initialData])

    const [initialFValues, setInitialFValues] = useState(initial);
    const initialFill = {}

    useEffect(() => {
        if (HotelRooms.data) {
            initialData.forEach((key) => {
                initialFill[key['name']] = HotelRooms.data[key['name']]
            })
            setInitialFValues(initialFill);
            setChangeTrue(true);
        }
    }, [HotelRooms.data]);

    const { values, handleInputChange, errors, setErrors } = useForm1(
        initialFValues,
        true,
        false,
        true,

    );

    const [editHotelRoom] = updateAPI();

    initialData.map((key) => {
        if (key.debounceTime > 0) {
            valueArray.push(values[key.name]);
        }
        else {
            debounceLessValueArray.push(values[key.name]);
        }
    })

    useEffect(() => {
        setValue(value + 1)
    }, valueArray)


    useEffect(() => {
        const formData = new FormData();
        initialData.forEach((key) => {
            formData.append(key['name'], values[key['name']])
        })
        formData.append(primaryKey, originalId);
        if (ChangeTrue) {
            editHotelRoom(formData)
        }
    },
        [useDebounce(value, 3000), ...debounceLessValueArray])


    return (
        <>
            {
                initialData.map((key) => (
                    <>{key.ControlType === "input" ?
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
                            /> : <></>}<>
                                {
                                    key.ControlType === "select" ?
                                        <Controls.Select
                                            name={key.name}
                                            label={key.label}
                                            value={values[key.name]}
                                            onChange={handleInputChange}
                                        /> :
                                        <></>
                                }
                            </>
                        </>}</>
                ))
            }
        </>
    )

}


const RepeatableEditFormSkeleton = ({ initialData,
    primaryKey,
    RepeatableFormValue,
    getSingleAPI,
    updateAPI,
    mappingButtonName,
    id }) => {

    return (
        <Form>
            <Grid container >
                <Grid item xs={6}>
                    <EditRoomForm
                        initialData={initialData}
                        originalId={id}
                        getSingleAPI={getSingleAPI}
                        updateAPI={updateAPI}
                        primaryKey={primaryKey}
                    />

                </Grid>
                <Grid item xs={6}>
                    {RepeatableFormValue.map((key) => (

                        <Controls.RepeatableForm
                            repeatableFormData={key}
                            AddForm={AddBedForm}
                            EditForm={EditBedForm}
                            originalId={id}
                            initialAPI={key[0].initialMapAPI}
                            deleteAPI={key[0].deleteRepeatAPI}
                            mappingButtonName={key[0].mappingButtonName}
                        />
                    ))}

                </Grid>
            </Grid>
        </Form>
    )
}

export default RepeatableEditFormSkeleton;