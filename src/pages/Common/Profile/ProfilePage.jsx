import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    Grid, Box
} from '@mui/material';
//! Reusable components
import { useForm } from '../../../reusable/forms/useForm';
import Controls from "../../../reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
import BlobToFile from '../../../reusable/forms/utils/blobToFile';
import { useGetProfileQuery, useUpdateProfilesMutation } from "../../../api/MPOSlices/ProfileApiSlice"
import Cookies from 'js-cookie'
import { LoadingButton } from '@mui/lab';

const ProfilePage = () => {
    //! Get profile display
    const { data } = useGetProfileQuery();

    //! Getting profiles by ID
    // const Profile = useGetProfileByIdQuery()

    //! Image Component 
    const [File, setFile] = useState([]);

    //! Dialogue


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('company_name' in fieldValues)
            temp.company_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.company_name)
        temp.company_address = returnValidation(['null'], values.company_address)
        temp.company_phone_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.company_phone_number)
        temp.company_email_address = returnValidation(['company_email_address'], values.company_email_address)
        temp.profile_image = returnValidation(['null'], values.profile_image)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }


    const [initialFValues, setInitialFValues] = useState({
        company_name: "",
        company_address: "",
        company_phone_number: "",
        company_email_address: "",
        profile_image: []
    })

    useEffect(() => {
        if (data) {
            setInitialFValues({
                'chemist_id': data?.results[0]?.company_name?.company_id,
                'company_name': data?.results[0]?.company_name?.company_name,
                'company_address': data?.results[0]?.company_name?.company_address,
                'company_phone_number': data?.results[0]?.company_name?.company_phone_number,
                'company_email_address': data?.results[0]?.company_name?.company_email_address,

            });
        }
    }, [data])

    const { values,
        errors,
        setErrors,
        handleInputChange,
        handleImageUpload,
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )

    useEffect(() => {
        handleImageUpload("image", File);
    }, [File]);


    useEffect(() => {
        validate();

    }, [
        values.company_name,
        values.company_address,
        values.company_phone_number,
        values.company_email_address,
        values.company_address,
        values.profile_image,
        validate
    ])

    //! Edit profile
    const [updateProfile] = useUpdateProfilesMutation();

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const formData = new FormData();
        var file = BlobToFile(values.profile_image, "profileimage");
        if (file.length !== 0) {
            formData.append("image", file, "productImage.jpg");
        }
        formData.append("company_name", values.company_name);
        formData.append("company_address", values.company_address);
        formData.append("company_phone_number", values.company_phone_number);
        formData.append("company_email_address", values.company_email_address);
        formData.append('refresh', Cookies.get('refresh'));
        formData.append('access', Cookies.get('access'));
        try {
            const response = await updateProfile(formData).unwrap();
            if (response.data) {
                setSuccessMessage({ show: true, message: 'Successfully Edited Profile' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            }
            else {
                setErrorMessage({ show: true, message: 'Some fields are missing.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }

        }
        catch (error) {

            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    }, [values, updateProfile])

    return (
        <>
            <section className="section profile">
                <div className="row">
                    <div className="col-xl-4">

                        <div className="card">
                            <div className="card-body profile-card pt-4 d-flex flex-column">

                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '9px' }}>Company Name: {data?.results[0].company_name.company_name}</h2>
                                <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '7px', color: 'grey' }}>Address: {data?.results[0].company_name.company_address}</h4>
                                <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '7px', color: 'grey' }}>Contact Number: {data?.results[0].company_name.company_phone_number}</h4>
                                <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '7px', color: 'grey' }}>Email: {data?.results[0].company_name.company_email_address}</h4>
                            </div>
                        </div>

                    </div>

                    <div className="col-xl-8">

                        <div className="card">
                            <div className="card-body pt-3">
                                <ul className="nav nav-tabs nav-tabs-bordered">
                                    <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab">Edit Profile</button>
                                    </li>
                                </ul>

                                <div className="tab-content pt-2">
                                    <form>
                                        <Controls.Input
                                            id="autoFocus"
                                            autoFocus
                                            name="company_name"
                                            label="Company Name"
                                            value={values.company_name}
                                            onChange={handleInputChange}
                                            error={errors.company_name}
                                            className={"profile_input_boxes"}
                                        />

                                        <Controls.Input
                                            name="company_address"
                                            label="Address"
                                            value={values.company_address}
                                            onChange={handleInputChange}
                                            error={errors.company_address}
                                        />

                                        <Controls.Input
                                            name="company_phone_number"
                                            label="Phone Number"
                                            value={values.company_phone_number}
                                            onChange={handleInputChange}
                                            error={errors.company_phone_number}
                                        />

                                        <Controls.Input
                                            name="company_email_address"
                                            label="Email Address"
                                            value={values.company_email_address}
                                            onChange={handleInputChange}
                                            error={errors.company_email_address}
                                        />

                                        <Grid container>
                                            <Grid item xs={3}>
                                                <Box marginTop={2}>
                                                    <LoadingButton className="loginbutton" fullWidth size="large" type="submit" variant="contained" onClick={(e) => handleSubmit(e)} >
                                                        Save Changes
                                                    </LoadingButton>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </form>

                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </section>
            {
                ErrorMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer errorMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
            {
                SuccessMessage.show === true ? (
                    <Grid>
                        <Box className="messageContainer successMessage">
                            <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                        </Box>
                    </Grid>
                ) : null
            }
        </>
    )
}

export default React.memo(ProfilePage)