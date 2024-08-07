import { useState, useEffect } from 'react'
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Stack, Box, Grid } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { LoadingButton } from '@mui/lab';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../reusable/forms/useForm';
import Controls from '../../reusable/forms/controls/Controls';
import { returnValidation } from '../../validation';
import { useForgotPasswordMutation } from '../../api/MPOSlices/AccountApiSlice';
import Cookies from 'js-cookie'



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

// ----------------------------------------------------------------------

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [createForgotPwd] = useForgotPasswordMutation();

    const mdUp = useResponsive('up', 'md');
    const [email, setEmail] = useState('')
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })
    const [success, setSuccess] = useState(false)


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('chemist_name' in fieldValues)
            temp.email = returnValidation(['null', 'email'], values.email)
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
        errors,
        setErrors,
        handleInputChange,
    } = useForm(initialFValues, true)

    useEffect(() => {
        validate();
        setEmail(values.email)
    }, [values.email])


    const handleSubmission = async (e) => {
        e.preventDefault()
        // 
        try {
            setSuccess(true);
            const res = await createForgotPwd({ 'email': email })
            if (res?.data) {
                setSuccess(false);
                setSuccessMessage({ show: true, message: 'OTP Sent to your Email Address' })
                setTimeout(() => {
                    Cookies.set('OTPgmail', email);
                    navigate('/otp');
                }, [3000])
            }
            if (res?.error?.status === 400) {
                setErrorMessage({ show: true, message: "Email doesn't exist" });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: "" });
                }, [3000])
            }
        }
        // if (res.data.status === "success") {
        //     setSuccess(true);
        //     setSuccessMessage({ show: true, message: 'Successfully Logged In' })

        //     if (res.data.role === 'admin') {
        //         // 
        //         Cookies.set('user_role', 'mpo')
        //         setTimeout(() => {
        //             navigate('/dashboard/admin');
        //         }, [5000])
        //     }
        // }
        // else if (res?.error?.status === 400) {

        //     setErrorMessage({ show: true, message: "User Credentials doesnot match" });
        //     setTimeout(() => {
        //         setErrorMessage({ show: false, message: "" });
        //     }, [5000])
        // }
        // else if (res?.error?.status === 401) {

        //     setErrorMessage({ show: true, message: "Unauthorized" });
        //     setTimeout(() => {
        //         setErrorMessage({ show: false, message: "" });
        //     }, [5000])
        // }
        // else {

        // }
        catch (err) {
            // if (!err?.originalStatus) {
            //     setErrorMessage({ show: true, message: "Connection Timed Out" });
            //     setTimeout(() => {
            //         setErrorMessage({ show: false, message: "" });
            //     }, [5000])
            // }
            // else if (err.error.status === 401) {

            //     setErrorMessage({ show: true, message: 'Unauthorized' });

            //     setTimeout(() => {
            //         setErrorMessage({ show: false, message: "" });
            //     }, [5000])
            // }
            // else if (err.originalStatus?.status === 400) {
            //     setErrorMessage({ show: true, message: "User credentials doesn't match" });
            //     setTimeout(() => {
            //         setErrorMessage({ show: false, message: "" });
            //     }, [5000])
            // }
            // else if (err.originalStatus?.status === 404) {
            //     setErrorMessage({ show: true, message: 'Unauthorized' });

            //     setTimeout(() => {
            //         setErrorMessage({ show: false, message: "" });
            //     }, [5000])
            // }
            // else {
            //     setErrorMessage({ show: true, message: 'Login Failed' });

            //     setTimeout(() => {
            //         setErrorMessage({ show: false, message: "" });
            //     }, [5000])
            // }
            // errRef.current.focus();
        }

    }

    return (
        <>
            <StyledRoot>

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Forgot Your Password?
                        </Typography>
                        <img src="/assets/illustrations/forgot_password.png" alt="forgotPassword" />
                    </StyledSection>
                )}

                <Container maxWidth="sm">
                    <StyledContent>
                        {/* <Logo
                            sx={{
                                position: 'fixed',
                                top: { xs: 16, sm: 24, md: 40 },
                                left: { xs: 16, sm: 24, md: 40 },
                            }}
                        /> */}
                        <Typography variant="h5" gutterBottom marginBottom={3.5}>
                            Please enter your email address to receive OTP
                        </Typography>
                        {/* <LoginForm /> */}
                        <>

                            <Stack spacing={3}>
                                <Controls.Input
                                    name="email"
                                    label="Email*"
                                    value={values.email}
                                    onChange={handleInputChange}
                                    error={errors.email}
                                // sx={{ pb: 3 }}
                                />

                            </Stack>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                                <Link to="/otp">
                                    {/* <Link variant="subtitle2" underline="hover"> */}
                                    {/* </Link> */}
                                </Link>
                            </Stack>
                            <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleSubmission}>
                                Reset Password
                            </LoadingButton>
                        </>
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
