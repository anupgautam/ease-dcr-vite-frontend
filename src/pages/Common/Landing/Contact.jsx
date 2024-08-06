import React, { useState, useEffect, useCallback } from 'react';
import { useCreateLandingsMutation } from '../../../api/MPOSlices/LandingSlice';
import { useForm } from '../../../reusable/forms/useForm';
import Controls from '../../../reusable/forms/controls/Controls';
import { returnValidation } from '../../../validation';
import { Box, Grid } from '@mui/material';

const Contact = () => {
    const [createContacts] = useCreateLandingsMutation();

    const initialFValues = {};

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ('full_name' in fieldValues)
            temp.full_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.full_name);
        if ('email' in fieldValues)
            temp.email = returnValidation(['null', 'email'], values.email);
        if ('phone_number' in fieldValues)
            temp.phone_number = returnValidation(['null', 'phonenumber', 'specialcharacter'], values.phone_number);
        if ('message' in fieldValues)
            temp.message = returnValidation(['null', 'lessThan200'], values.message);

        setErrors({
            ...temp,
        });

        if (fieldValues === values) return Object.values(temp).every((x) => x === '');
    };

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, validate);

    useEffect(() => {
        validate();
    }, [values]);

    const [successMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [errorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const onAddContact = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('full_name', values.full_name);
        formData.append('phone_number', values.phone_number);
        formData.append('email', values.email);
        formData.append('message', values.message);
        try {
            const response = await createContacts(formData).unwrap();
            if (response) {
                setSuccessMessage({ show: true, message: 'Message sent successfully.' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
            } else {
                setErrorMessage({ show: true, message: response.error.data[0] });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
            
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some error occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }
    },
        [createContacts, values, resetForm]
    );

    return (
        <>
            <section id="contact" className="ud-contact">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-xl-8 col-lg-7">
                            <div className="ud-contact-content-wrapper">
                                <div className="ud-contact-title">
                                    <span>CONTACT US</span>
                                    <h2>
                                        Let’s talk about <br />
                                        Love to hear from you!
                                    </h2>
                                </div>
                                <div className="ud-contact-info-wrapper">
                                    <div className="ud-single-info">
                                        <div className="ud-info-icon">
                                            <i className="lni lni-map-marker"></i>
                                        </div>
                                        <div className="ud-info-meta">
                                            <h5>Our Location</h5>
                                            <p>Kalanki-14, Kathmandu, Nepal</p>
                                        </div>
                                    </div>
                                    <div className="ud-single-info">
                                        <div className="ud-info-icon">
                                            <i className="lni lni-envelope"></i>
                                        </div>
                                        <div className="ud-info-meta">
                                            <h5>How Can We Help?</h5>
                                            <p>info@easesfa.com</p>
                                            <p>contact@easesfa.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-5">
                            <div
                                className="ud-contact-form-wrapper wow fadeInUp"
                                data-wow-delay=".2s"
                            >
                                <h3 className="ud-contact-form-title">Send us a Message</h3>
                                <form className="ud-contact-form">
                                    <div className="ud-form-group">
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name="full_name"
                                                label="Full Name*"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.full_name}
                                            />
                                        </Box>
                                    </div>
                                    <div className="ud-form-group">
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name="email"
                                                label="Email*"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.email}
                                            />
                                        </Box>
                                    </div>
                                    <div className="ud-form-group">
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name="phone_number"
                                                label="Phone Number*"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.phone_number}
                                            />
                                        </Box>
                                    </div>
                                    <div className="ud-form-group">
                                        <Box marginBottom={2}>
                                            <Controls.Input
                                                name="message"
                                                label="Message*"
                                                value={values.name}
                                                onChange={handleInputChange}
                                                error={errors.message}
                                            />
                                        </Box>
                                    </div>
                                    <div className="ud-form-group mb-0">
                                        <button type="submit" className="ud-main-btn" onClick={(e) => onAddContact(e)}>
                                            Send Message
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {errorMessage.show && (
                <Grid>
                    <Box className="messageContainer errorMessage">
                        <h1 style={{ fontSize: '14px', color: 'white' }}>{errorMessage.message}</h1>
                    </Box>
                </Grid>
            )}
            {successMessage.show && (
                <Grid>
                    <Box className="messageContainer successMessage">
                        <h1 style={{ fontSize: '14px', color: 'white' }}>{successMessage.message}</h1>
                    </Box>
                </Grid>
            )}
        </>
    );
};

export default React.memo(Contact);
