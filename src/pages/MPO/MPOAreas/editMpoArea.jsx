import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
    Box,
    Typography, Button, Grid, CircularProgress
} from '@mui/material'
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
import { useGetAllExecutiveLevelsMutation } from '@/api/CompanySlices/companyUserSlice';
import { useGetAllCompanyRolesQuery } from '@/api/CompanySlices/companyRolesSlice';
import {
    usePostAllMPONamesNoPageMutation
} from '../../../api/MPOSlices/DoctorSlice'
import {
    useGetCompanyDivisionsByCompanyIdQuery
} from '@/api/CompanySlices/companyDivisionSlice';
import {
    useGetAllCompanyAreasQuery, useUpdateMpoAreasMutation
} from '@/api/CompanySlices/companyAreaSlice'
// import {
//     useUpdateAreaofMPOMutation
// } from '@/api/MPOSlices/TourPlanSlice'
import {
    useGetAreaMPOByIdQuery,
} from '@/api/MPOSlices/TourPlanSlice.js';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';


const EditMpoArea = ({ idharu, onClose }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const mpoStation = [
        { id: "HOME STATION", title: "HOME STATION" },
        { id: "EX STATION", title: "EX STATION" },
        { id: "OUT STATION", title: "OUT STATION" },
        { id: "NONE WORKING", title: "NONE WORKING" },
    ]

    //! Getting User by ID
    const User = useGetAreaMPOByIdQuery(idharu);

    const [higherUserOptions, setHigherUserOptions] = useState([]);

    //! Get user roles
    const data = useGetAllCompanyRolesQuery(company_id, {
        skip: !company_id
    });

    const rolesharu = useMemo(() => {
        if (data) {
            return data?.data?.map((key => ({
                id: key.id,
                title: key.role_name_value
            })))
            return []
        }
    }, [data])

    //! Get Divisions
    const Divisions = useGetCompanyDivisionsByCompanyIdQuery(company_id);

    const divisions = useMemo(() => {
        if (Divisions?.data) {
            return Divisions?.data?.map(key => ({
                id: key.id,
                title: key.division_name
            }))
        }
        return [];
    }, [Divisions])

    const [higherUserList] = useGetAllExecutiveLevelsMutation();
    useEffect(() => {
        if (User?.data) {
            higherUserList(User?.data?.company_name?.company_id)
                .then((res) => {
                    const higherList = []
                    res?.data?.forEach((key) => {
                        higherList.push({
                            id: key.id,
                            title: key.user_name.first_name + " " + key.user_name.middle_name + " " + key.user_name.last_name
                        })
                    })
                    setHigherUserOptions(higherList);
                })
        }

    }, [User])

    //! Get company wise area
    const { data: CompanyArea } = useGetAllCompanyAreasQuery(company_id, {
        skip: !company_id
    });

    const companyAreaData = useMemo(() => {
        if (CompanyArea?.data) {
            return companyAreaData.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [CompanyArea])

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);

    //! Get MPO names
    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name }))
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

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('area_name' in fieldValues)
            temp.area_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter', "minLength3"], values.area_name)
        temp.mpo_name = returnValidation(['null'], values.mpo_name)
        temp.company_area = returnValidation(['null'], values.company_area)
        temp.station_type = returnValidation(['null'], values.station_type)
        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }


    const [initialFValues, setInitialFValues] = useState({
        area_name: "",
        mpo_name: "",
        company_area: "",
        station_type: "",

    })


    useEffect(() => {
        if (User?.data) {
            setInitialFValues({
                area_name: User?.data?.area_name,
                mpo_name: User?.data?.mpo_name,
                station_type: User?.data?.station_type,
                company_area: User?.data?.company_area
            });
        }
    }, [User?.data])


    const { values,
        errors,
        setErrors,
        handleInputChange
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )


    useEffect(() => {
        validate();
    }, [
        values.area_name,
        values.mpo_name,
        values.station_type,
        values.company_area,
    ])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.area_name, values.mpo_name, values.station_type]);

    //! Edit user
    // const [updateUsers] = useUpdatecompanyUserRolesMutation();
    const [updateUsers] = useUpdateMpoAreasMutation();

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = { area_name: values.area_name, mpo_name: values.mpo_name, station_type: values.station_type, company_area: values.company_area, id: idharu, company_name: company_id }
        try {
            const response = await updateUsers(data)
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Updated MPO Area' });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 2000);
                // setIsDrawerOpen(false)

                toast.success(`${response?.data?.msg}`)
                setIsButtonDisabled(true)
                setLoading(false);
                onClose();
            }
            else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                console.log(response?.error)
                toast.error(`${response?.error?.data?.msg}`)
                setLoading(false);
            }
            else {
                // setErrorMessage({ show: true, message: "Something went wrong." });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);

                toast.error(`Some Error Occured`)

            }
        } catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 3000);
            console.log(error)
            toast.error('Backend Error')
        } finally {
            setLoading(false)
        }
    }, [updateUsers, values])

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        width="400px"
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Edit Mpo Area
                        </Typography>
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={6}></Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="area_name"
                            label="Area Name*"
                            value={values.area_name}
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
                                value={values.mpo_name}
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
                            value={values.station_type}
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
                            onClick={(e) => handleSubmit(e)}
                            text="Submit"
                        />
                        <Button
                            variant="outlined"
                            className="cancel-button"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </Stack>
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
    );
};

export default React.memo(EditMpoArea);