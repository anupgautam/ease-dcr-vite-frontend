
import { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import useResponsive from '../../hooks/useResponsive';

import { Typography, Box, Grid,Container, Link } from '@mui/material';
// hooks
import { LoadingButton } from '@mui/lab';
// components
// sections
// import LoginForm from './LoginForm';
import { useForm } from '../../reusable/forms/useForm';
import Controls from '../../reusable/forms/controls/Controls';
import { returnValidation } from '../../validation';
import { useChangePasswordMutation } from '../../api/MPOSlices/AccountApiSlice';
import { extractErrorMessage } from '../../reusable/extractErrorMessage';
import { useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    // boxShadow: theme.customShadows.card,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(12, 0),
}));
//! new password mutation hook

// ----------------------------------------------------------------------

export default function ChangePassword() {

    const [changePwd] = useChangePasswordMutation();
    const [oldPwd, setOldPwd] = useState('')
    const [pwd, setPwd] = useState('')
    const [confirmPwd, setConfirmPwd] = useState('')
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })
    const [success, setSuccess] = useState(false)
    const { User_id } = useSelector((state) => state.cookie);
    const mdUp = useResponsive('up', 'md');

    const navigate = useNavigate()

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('chemist_name' in fieldValues)
            temp.old = returnValidation(['null', 'password'], values.old)
        temp.password = returnValidation(['null', 'password'], values.password)
        temp.new = returnValidation(['null', 'password'], values.new)
        // 

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const initialFValues = {

    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialFValues, true)

    useEffect(() => {
        validate();
        setOldPwd(values.old)
        setPwd(values.password)
        setConfirmPwd(values.new)

    }, [values.old, values.password, values.new,])

    const handleSubmission = async (e) => {
        e.preventDefault()

        if (oldPwd !== null && pwd === confirmPwd) {
            try {
                const res = await changePwd({ 'old_password': oldPwd, 'new_password': pwd, 'user_id': User_id })
                if (res?.data) {
                    setSuccess(true);
                    setSuccessMessage({ show: true, message: 'Password Successfully Changed' })
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: "" });
                    }, [3000])
                    setOldPwd()
                    setPwd()
                    setConfirmPwd()
                    setValues({ old: '', password: '', new: '' })
                    navigate('/login')
                }
                else {
                    setErrorMessage({ show: true, message: extractErrorMessage(res?.error) });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: "" });
                    }, [3000])
                }
            }
            catch (err) {
            }
        }
        else {
            // setConditionMet(false);
            setErrorMessage({ show: true, message: "Password and Confirm Password must be same" });
            setTimeout(() => {
                setErrorMessage({ show: false, message: "" });
            }, [3000])
        }
    }

    console.log(values)

    return (
        <>
            <StyledRoot>
                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Change Password
                        </Typography>
                        <img src="/assets/illustrations/forgot_password.png" alt="Change Password" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        <Box style={{ textAlign: 'start' }}>
                            <Typography style={{ textAlign: 'start' }} variant="h4" gutterBottom>
                                Change Password
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={10}>
                                    <Box marginBottom={3} marginTop={4}>
                                        <Controls.InputPassword
                                            name="old"
                                            label="Previous Password*"
                                            value={values.old}
                                            onChange={handleInputChange}
                                            error={errors.old}
                                        />
                                    </Box>
                                    <Box marginBottom={3}>
                                        <Controls.InputPassword
                                            name="password"
                                            label=" New Password*"
                                            value={values.password}
                                            onChange={handleInputChange}
                                            error={errors.password}
                                        />
                                    </Box>
                                    <Box marginBottom={2}>
                                        <Controls.InputPassword
                                            name="new"
                                            label=" Confirm New Password*"
                                            value={values.new}
                                            onChange={handleInputChange}
                                            error={errors.new}
                                        />
                                    </Box>
                                    <LoadingButton className="loginbutton" fullWidth size="large" type="submit" variant="contained" onClick={handleSubmission} >
                                        Change Password
                                    </LoadingButton>
                                </Grid>
                                {/* <Grid item xs={12} md={7}>
                                    <Box style={{ textAlign: "start", marginTop: "25px" }}>
                                        <Typography className="emailtext">
                                            Password Policy
                                        </Typography>
                                        <ul style={{ padding: "0px", marginTop: "15px" }}>
                                            <li className="emailtext" style={{ marginLeft: "10px", listStyleType: "circle" }}>
                                                Password Maximum Length is 15
                                            </li>
                                            <li
                                                className="emailtext"
                                                style={{ marginTop: "8px", marginLeft: "10px", listStyleType: "circle" }}
                                            >
                                                Password Minimum Length is 8
                                            </li>
                                            <li
                                                className="emailtext"
                                                style={{ marginTop: "8px", marginLeft: "10px", listStyleType: "circle" }}
                                            >
                                                At Least 3 Number of lowercase letters in password
                                            </li>
                                        </ul>
                                    </Box>
                                </Grid> */}
                                {/* <button fullWidth className='loginbutton' size="large" type="submit" variant="contained" onClick={handleSubmission}>
                        Change Password
                    </button> */}
                            </Grid>
                        </Box>
                    </StyledContent>
                </Container>

            </StyledRoot>
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
    );
}

