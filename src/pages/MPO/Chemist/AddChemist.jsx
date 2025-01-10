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
import { useSelector } from 'react-redux';

import {
    useCreateChemistsMutation
} from '@/api/MPOSlices/ChemistSlice';
import { usePostAllMPONamesNoPageMutation } from '@/api/MPOSlices/DoctorSlice';
import { useGetMpoAreaQuery } from '@/api/MPOSlices/TourPlanSlice';
import { Link } from 'react-router-dom';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';

const AddChemist = () => {
    const { company_id, user_role, company_user_role_id, company_user_id } = useSelector((state) => state.cookie);

    const chemistcategories = [
        { id: "A", title: "A" },
        { id: "B", title: "B" },
        { id: "C", title: "C" },
    ]

    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key?.user_name?.first_name + ' ' + key?.user_name?.last_name }))
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

    //! Create Chemist
    const [createChemists] = useCreateChemistsMutation();


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('chemist_name' in fieldValues)
            temp.chemist_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.chemist_name)
        temp.chemist_category = returnValidation(['null'], values.chemist_category)
        temp.mpo_name = returnValidation(['null'], values.mpo_name)
        temp.chemist_territory = returnValidation(['null'], values.chemist_territory)
        temp.chemist_contact_person = returnValidation(['null', 'lessThan50', 'specialcharacter', 'minLength3'], values.chemist_contact_person)
        temp.chemist_phone_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.chemist_phone_number)
        temp.chemist_pan_number = returnValidation(['null', 'minLength3', 'specialcharacter'], values.chemist_pan_number)
        temp.chemist_address = returnValidation(['null', 'minLength3', 'specialcharacter'], values.chemist_address)

        setErrors({
            ...temp
        })
        

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const initialFValues = {
        is_invested: false,
        chemist_name: "",
        chemist_address: "",
        mpo_name: "",
        chemist_territory: "",
        chemist_contact_person: "",
        chemist_phone_number: "",
        chemist_pan_number: "",
        chemist_category: ""
    }

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialFValues, true, validate)

    useEffect(() => {
        validate();

    }, [values.chemist_name,
    values.chemist_category,
    values.chemist_address,
    values.mpo_name,
    values.chemist_territory,
    values.chemist_contact_person,
    values.chemist_phone_number,
    values.chemist_pan_number,
    ])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.chemist_name,
    values.chemist_category,
    values.chemist_address,
    values.mpo_name,
    values.chemist_territory,
    values.chemist_contact_person,
    values.chemist_phone_number,
    values.chemist_pan_number,]);

    const MpoArea = useGetMpoAreaQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? values.mpo_name : company_user_role_id },
        {
            skip: !company_id || !user_role || !company_user_role_id
        }
    );

    const mpoAreaData = useMemo(() => {
        if (MpoArea) {
            return MpoArea?.data?.map(key => ({ id: key.id, title: key.area_name }))
        }
        return [];
    }, [MpoArea])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddChemists = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const data = {
            chemist_name: values.chemist_name,
            chemist_phone_number: values.chemist_phone_number,
            chemist_address: values.chemist_address,
            chemist_territory: values.chemist_territory,
            chemist_category: values.chemist_category,
            chemist_contact_person: values.chemist_contact_person,
            chemist_pan_number: values.chemist_pan_number,
            company_name: company_id,
            mpo_name: user_role === 'admin' ? values.mpo_name : company_user_role_id,
            is_investment: false
        };
        try {
            const response = await createChemists(data)
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Added Chemists' });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 3000);
                // setIsDrawerOpen(false)

                toast.success(`${response?.data?.msg}`)
                setIsButtonDisabled(true)
                setIsDrawerOpen(false)
            } else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                toast.error(`${response?.error?.data?.msg}`)
                setLoading(false);
            } else {
                // setSuccessMessage({ show: true, message: response.error.data });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 3000);
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

    }, [createChemists, values]);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [MutipleChemist, setAddMutipleChemist] = useState(false);

    const addMutipleChemist = () => {
        setAddMutipleChemist(!MutipleChemist);
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
                            Add Chemist
                        </Typography>
                    </Box>
                    {
                        MutipleChemist === true ?
                            <>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        name="no_of_chemist"
                                        label="Number of Chemist*"
                                        value={values.no_of_chemist}
                                        onChange={handleInputChange}
                                        autoFocus
                                    />
                                </Box>
                                <Stack spacing={1} direction="row">
                                    <Link to={`/dashboard/admin/add/mutiple/chemist?number=${values.no_of_chemist}`}>
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
                                        onClick={addMutipleChemist}
                                    >
                                        Add Multiple Chemist
                                    </Button>
                                </Box>

                                <Box marginBottom={2}>
                                    <Controls.Input
                                        id="autoFocus"
                                        name="chemist_name"
                                        label="Chemist Name*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.chemist_name}
                                        autoFocus
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
                                        name="chemist_territory"
                                        label="Chemist Territory*"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.chemist_territory}
                                        options={mpoAreaData}
                                    />
                                </Box>

                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="chemist_phone_number"
                                        label="Phone Number"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.chemist_phone_number}
                                    />
                                </Box>
                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="chemist_contact_person"
                                        label="Chemist Contact Person"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.chemist_contact_person}
                                    />
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name="chemist_pan_number"
                                                label="Chemist PAN Number"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.chemist_pan_number}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box style={{ marginTop: "1px" }} marginBottom={2}>
                                            <Controls.Select
                                                name="chemist_category"
                                                label="Chemist Category*"
                                                value={values.name}
                                                options={chemistcategories}
                                                onChange={handleInputChange}
                                                error={errors.chemist_category}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Box marginBottom={2}>
                                    <Controls.Input
                                        name="chemist_address"
                                        label="Chemist Address"
                                        value={values.name}
                                        onChange={handleInputChange}
                                        error={errors.chemist_address}
                                    />
                                </Box>
                                {/* <Box marginBottom={2}>
                                    <Controls.Checkbox
                                        name="is_invested"
                                        value={values.is_invested}
                                        onChange={handleInputChange}
                                        label="Is Invested"
                                    />
                                </Box> */}
                                <Stack spacing={1} direction="row">
                                    <Controls.SubmitButton
                                        variant="contained"
                                        className="submit-button"
                                        disabled={isButtonDisabled}
                                        onClick={(e) => onAddChemists(e)}
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
                )
                }
                {
                    ErrorMessage.show && (
                        <Grid>
                            <Box className="messageContainer errorMessage">
                                <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                            </Box>
                        </Grid>
                    )
                }
                {
                    SuccessMessage.show && (
                        <Grid>
                            <Box className="messageContainer successMessage">
                                <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                            </Box>
                        </Grid>
                    )
                }
            </Drawer>

        </>
    )
}

export default React.memo(AddChemist)