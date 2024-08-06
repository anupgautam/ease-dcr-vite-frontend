
import { useState, useEffect } from 'react'
// @mui
import { styled } from '@mui/material/styles';
import { Container, Typography, Stack, Box, Grid } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { LoadingButton } from '@mui/lab';
// components
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../reusable/forms/useForm';
import { returnValidation } from '../../validation';
import OtpInput from 'react-otp-input';
import '../../styles/otpstyle.css'
import { useOtpVerificationMutation } from '../../api/MPOSlices/AccountApiSlice';
import Cookies from 'js-cookie';

//! reset mutation hook

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

export default function OTP() {

    const [otpVerify] = useOtpVerificationMutation();
    const navigate = useNavigate();

    const [otp, setOtp] = useState('');
    const handleOtpChange = (value) => {
        // Filter out non-numeric characters from the input value
        const numericValue = value.replace(/\D/g, "");

        // Update the OTP state with the numeric value
        setOtp(numericValue);
        handleSubmission();

    };

    // const handleKeyDown = (event) => {
    //     // Allow only numeric characters (0-9) and the Backspace key (key code 8)
    //     if (
    //         event.keyCode !== 8 &&
    //         (event.keyCode < 48 || event.keyCode > 57)
    //     ) {
    //         event.preventDefault();
    //     }
    // };

    // const handleOtpChange = (value) => {
    //     setOtp(value);
    // };


    const mdUp = useResponsive('up', 'md');
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')

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
    } = useForm(initialFValues, true)

    useEffect(() => {
        validate();
        setEmail(values.email)


    }, [values.email, validate])


    const handleSubmission = async (e) => {
        e.preventDefault()
        try {
            const res = await otpVerify({ 'email': Cookies.get('OTPgmail'), 'otp': otp })
            if (res?.data) {
                setSuccess(true);
                setSuccessMessage({ show: true, message: 'OTP Verified' })
                setTimeout(() => {
                    Cookies.set('otp', otp);
                    navigate('/newpassword');
                }, [5000])
            }
            if (res?.error?.status === 400) {
                // setError(true);
                setErrorMessage({ show: true, message: "OTP is not valid" });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: "" });
                }, [5000])
            }
        }
        catch (err) {
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
                        <img src="/assets/illustrations/otp.png" alt="otp" />
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
                            Please enter your one time password
                        </Typography>
                        {/* <LoginForm /> */}
                        <>

                            {/* <Stack spacing={3}> */}
                            <div className="otp-container">
                                <OtpInput
                                    value={otp}
                                    onChange={handleOtpChange}
                                    numInputs={6}
                                    renderSeparator={<span>-</span>}
                                    renderInput={(props) => <input  {...props} />}
                                    inputStyle="otp-input"
                                // onKeyDown={handleKeyDown}
                                />
                            </div>

                            {/* </Stack> */}
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                                <Link to="/newpassword">
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
