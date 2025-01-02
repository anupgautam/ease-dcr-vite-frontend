import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
import { toast } from 'react-toastify';

import {
    usePostAllMPONamesNoPageMutation
} from '../../../api/MPOSlices/DoctorSlice'
import { useGetMpoAreaQuery, usePostAreaofMPOMutation } from '@/api/MPOSlices/TourPlanSlice';
import { useGetAllCompanyAreasQuery } from '@/api/CompanySlices/companyAreaSlice';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const AddMpoArea = () => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const mpoStation = [
        { id: "HOME STATION", title: "HOME STATION" },
        { id: "EX STATION", title: "EX STATION" },
        { id: "OUT STATION", title: "OUT STATION" },
        { id: "NONE WORKING", title: "NONE WORKING" },
    ]

    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const companyAreaData = useMemo(() => {
        if (CompanyArea) {
            return CompanyArea?.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [CompanyArea])

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key?.user_name?.first_name + ' ' + key?.user_name?.middle_name + ' ' + key?.user_name?.last_name }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id }, {
                skip: !company_id
            })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    const [createMpoArea] = usePostAreaofMPOMutation()

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('area_name' in fieldValues)
            temp.area_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter', "minLength3"], values.area_name)
        temp.mpo_name = returnValidation(['null'], values.mpo_name)
        temp.station_type = returnValidation(['null'], values.station_type)
        temp.company_area = returnValidation(['null'], values.company_area)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const initialFValues = {
        area_name: "",
        mpo_name: "",
        station_type: ""
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, validate)

    useEffect(() => {
        validate();

    }, [values.area_name, values.mpo_name, values.station_type])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.area_name, values.mpo_name, values.station_type]);

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: values.mpo_name }, {
        skip: !company_id || !values.mpo_name
    });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddDoctors = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = { area_name: values.area_name, mpo_name: user_role === 'admin' ? values.mpo_name : company_user_role_id, station_type: values.station_type, company_name: company_id }
        try {
            const response = await createMpoArea(data)
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Added Area.' });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 3000);
                // setIsDrawerOpen(false)
                toast.success(`${response?.data?.msg}`)
                setIsButtonDisabled(true)
                setIsDrawerOpen(false)
                resetForm();
            }
            else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                toast.error(`${response?.error?.data?.msg}`)
                setLoading(false);
            }
            else {
                // setErrorMessage({ show: true, message: response.error.data });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 3000);
                toast.error(`Some Error Occured`)
            }
        } catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 3000);
            console.log(error)
            toast.error('Backend Error')
        } finally {
            setLoading(false)
        }
    }, [createMpoArea, values])

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [MutipleMpoArea, setAddMutipleMpoArea] = useState(false);

    const addMutipleMpoArea = () => {
        setAddMutipleMpoArea(!MutipleMpoArea);
    }

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Mpo Area
                        </Typography>

                    </Box>
                    {
                        MutipleMpoArea === true ?
                            <>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="no_of_area"
                                        label="Number of Mpo Area*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.no_of_area}
                                    />
                                </Box>
                                <Stack spacing={1} direction="row">
                                    <Link to={`/dashboard/admin/add/mutiple/mpo/area?number=${values.no_of_area}`}>
                                        <Button
                                            variant="contained"
                                            className="summit-button"
                                        // onClick={(e) => onAddDoctors(e)}
                                        >
                                            Submit{" "}
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outlined"
                                        className="cancel-button"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </> :
                            <>
                                <Box marginBottom={4}>
                                    <Button
                                        variant="contained"
                                        className="summit-button"
                                        style={{ width: "100%", padding: "10px" }}
                                        onClick={addMutipleMpoArea}
                                    >
                                        Add Multiple MPO Area
                                    </Button>
                                </Box>

                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="area_name"
                                        label="Area Name*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.area_name}
                                    />
                                </Box>
                                {
                                    user_role === 'admin' &&
                                    <Box marginBottom={2}>
                                        <Controls.Select
                                            name="mpo_name"
                                            label="MPO*"
                                            value={values.name}
                                            onChange={handleInputChange}
                                            error={errors.mpo_name}
                                            options={mpoNames}
                                        />
                                    </Box>
                                }
                                <Box marginBottom={2}>
                                    <Controls.Select
                                        name="station_type"
                                        label="Station Type*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.station_type}
                                        options={mpoStation}
                                    />
                                </Box>
                                <Stack spacing={1} direction="row">
                                    <Controls.SubmitButton
                                        variant="contained"
                                        className="submit-button"
                                        disabled={isButtonDisabled}
                                        onClick={(e) => onAddDoctors(e)}
                                        text="Submit"
                                    />
                                    <Button
                                        variant="outlined"
                                        className="cancel-button"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                </Stack>
                            </>
                    }
                </Box>
                {loading && (
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                        <CircularProgress />
                    </Grid>
                )}
                {ErrorMessage.show && (
                    <Grid>
                        <Box className="messageContainer errorMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                )}
                {SuccessMessage.show && (
                    <Grid>
                        <Box className="messageContainer successMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                )}
            </Drawer>

        </>
    )
}

export default React.memo(AddMpoArea);