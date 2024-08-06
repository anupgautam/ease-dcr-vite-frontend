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

                                {/* <img src="assets/img/profile-img.jpg" alt="Profile" className="rounded-circle" /> */}
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '9px' }}>Company Name: {data?.results[0].company_name.company_name}</h2>
                                <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '7px', color: 'grey' }}>Address: {data?.results[0].company_name.company_address}</h4>
                                <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '7px', color: 'grey' }}>Contact Number: {data?.results[0].company_name.company_phone_number}</h4>
                                <h4 style={{ fontSize: '15px', fontWeight: '500', marginBottom: '7px', color: 'grey' }}>Email: {data?.results[0].company_name.company_email_address}</h4>
                                {/* <div className="social-links mt-2">
                                    <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
                                    <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
                                    <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
                                    <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
                                </div> */}
                            </div>
                        </div>

                    </div>

                    <div className="col-xl-8">

                        <div className="card">
                            <div className="card-body pt-3">
                                {/* <!-- Bordered Tabs --> */}
                                <ul className="nav nav-tabs nav-tabs-bordered">

                                    {/* <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab" onClick={(e) => { setEditPage(false) }}>Overview</button>
                                    </li> */}

                                    <li className="nav-item">
                                        <button className="nav-link active" data-bs-toggle="tab">Edit Profile</button>
                                    </li>
                                </ul>

                                <div className="tab-content pt-2">

                                    {/* <div className="tab-pane fade show active profile-overview" id="profile-overview">
                                                <h5 className="card-title">About</h5>
                                                <p className="small fst-italic">Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</p>

                                                <h5 className="card-title">Profile Details</h5>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label ">Full Name</div>
                                                    <div className="col-lg-9 col-md-8">Kevin Anderson</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Company</div>
                                                    <div className="col-lg-9 col-md-8">Lueilwitz, Wisoky and Leuschke</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Job</div>
                                                    <div className="col-lg-9 col-md-8">Web Designer</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Country</div>
                                                    <div className="col-lg-9 col-md-8">USA</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Address</div>
                                                    <div className="col-lg-9 col-md-8">A108 Adam Street, New York, NY 535022</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Phone</div>
                                                    <div className="col-lg-9 col-md-8">(436) 486-3538 x29071</div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-3 col-md-4 label">Email</div>
                                                    <div className="col-lg-9 col-md-8">k.anderson@example.com</div>
                                                </div>

                                            </div> */}

                                    <div className="tab-pane fade show active profile-edit pt-3" id="profile-edit">
                                        <form>
                                            {/* <div className="row mb-3">
                                                <label for="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <img src="assets/img/profile-img.jpg" alt="Profile" />
                                                    <div className="pt-2">
                                                        <Controls.Image
                                                            setFile={setFile}
                                                            aspectRatio={373 / 280}
                                                        />
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className="row mb-3">
                                                <label for="fullName" className="col-md-4 col-lg-3 col-form-label">Company Name:</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <Controls.Input
                                                        id="autoFocus"
                                                        autoFocus
                                                        name="company_name"
                                                        value={values.company_name}
                                                        onChange={handleInputChange}
                                                        error={errors.company_name}
                                                        className={"profile_input_boxes"}
                                                    />
                                                </div>
                                            </div>

                                            {/* <div className="row mb-3">
                                                <label for="about" className="col-md-4 col-lg-3 col-form-label">About</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <textarea name="about" className="form-control" id="about" style={{ height: "100px" }}>Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea>
                                                </div>
                                            </div> */}

                                            {/* <div className="row mb-3">
                                                <label for="company" className="col-md-4 col-lg-3 col-form-label">Company</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="company" type="text" className="form-control" id="company" value="Lueilwitz, Wisoky and Leuschke" />
                                                </div>
                                            </div> */}

                                            {/* <div className="row mb-3">
                                                <label for="Job" className="col-md-4 col-lg-3 col-form-label">Job</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="job" type="text" className="form-control" id="Job" value="Web Designer" />
                                                </div>
                                            </div> */}

                                            {/* <div className="row mb-3">
                                                <label for="Country" className="col-md-4 col-lg-3 col-form-label">Country</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="country" type="text" className="form-control" id="Country" value="USA" />
                                                </div>
                                            </div> */}

                                            <div className="row mb-3">
                                                <label for="Address" className="col-md-4 col-lg-3 col-form-label">Address:</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <Controls.Input
                                                        name="company_address"
                                                        value={values.company_address}
                                                        onChange={handleInputChange}
                                                        error={errors.company_address}
                                                    // className={"drawer-first-name-input"}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Phone" className="col-md-4 col-lg-3 col-form-label">Phone:</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <Controls.Input
                                                        name="company_phone_number"
                                                        value={values.company_phone_number}
                                                        onChange={handleInputChange}
                                                        error={errors.company_phone_number}
                                                    // className={"drawer-first-name-input"}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Email" className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <Controls.Input
                                                        name="company_email_address"
                                                        value={values.company_email_address}
                                                        onChange={handleInputChange}
                                                        error={errors.company_email_address}
                                                    // className={"drawer-first-name-input"}
                                                    />
                                                </div>
                                            </div>
                                            <Grid container>
                                                <Grid item xs={9}>

                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Box marginTop={2}>
                                                        <LoadingButton className="loginbutton" fullWidth size="large" type="submit" variant="contained" onClick={(e) => handleSubmit(e)} >
                                                            Save Changes
                                                        </LoadingButton>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            {/* </form><!-- End Profile Edit Form --> */}
                                        </form>

                                    </div>
                                    {/* <div className="tab-pane fade profile-edit pt-3" id="profile-edit">

                                        <form>
                                            <div className="row mb-3">
                                                <label for="profileImage" className="col-md-4 col-lg-3 col-form-label">Profile Image</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <img src="assets/img/profile-img.jpg" alt="Profile" />
                                                    <div className="pt-2">
                                                        <a href="#" className="btn btn-primary btn-sm" title="Upload new profile image"><i className="bi bi-upload"></i></a>
                                                        <a href="#" className="btn btn-danger btn-sm" title="Remove my profile image"><i className="bi bi-trash"></i></a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="fullName" className="col-md-4 col-lg-3 col-form-label">Full Name</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="fullName" type="text" className="form-control" id="fullName" value="Kevin Anderson" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="about" className="col-md-4 col-lg-3 col-form-label">About</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <textarea name="about" className="form-control" id="about" style={{height: "100px"}}>Sunt est soluta temporibus accusantium neque nam maiores cumque temporibus. Tempora libero non est unde veniam est qui dolor. Ut sunt iure rerum quae quisquam autem eveniet perspiciatis odit. Fuga sequi sed ea saepe at unde.</textarea>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="company" className="col-md-4 col-lg-3 col-form-label">Company</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="company" type="text" className="form-control" id="company" value="Lueilwitz, Wisoky and Leuschke" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Job" className="col-md-4 col-lg-3 col-form-label">Job</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="job" type="text" className="form-control" id="Job" value="Web Designer" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Country" className="col-md-4 col-lg-3 col-form-label">Country</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="country" type="text" className="form-control" id="Country" value="USA" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Address" className="col-md-4 col-lg-3 col-form-label">Address</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="company_address" type="text" className="form-control" id="Address" value="A108 Adam Street, New York, NY 535022" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Phone" className="col-md-4 col-lg-3 col-form-label">Phone</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="phone" type="text" className="form-control" id="Phone" value="(436) 486-3538 x29071" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Email" className="col-md-4 col-lg-3 col-form-label">Email</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="company_email_address" type="company_email_address" className="form-control" id="Email" value="k.anderson@example.com" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Twitter" className="col-md-4 col-lg-3 col-form-label">Twitter Profile</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="twitter" type="text" className="form-control" id="Twitter" value="https://twitter.com/#" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Facebook" className="col-md-4 col-lg-3 col-form-label">Facebook Profile</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="facebook" type="text" className="form-control" id="Facebook" value="https://facebook.com/#" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Instagram" className="col-md-4 col-lg-3 col-form-label">Instagram Profile</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="instagram" type="text" className="form-control" id="Instagram" value="https://instagram.com/#" />
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <label for="Linkedin" className="col-md-4 col-lg-3 col-form-label">Linkedin Profile</label>
                                                <div className="col-md-8 col-lg-9">
                                                    <input name="linkedin" type="text" className="form-control" id="Linkedin" value="https://linkedin.com/#" />
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <button type="submit" className="btn btn-primary">Save Changes</button>
                                            </div>
                                        </form>

                                    </div> */}
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