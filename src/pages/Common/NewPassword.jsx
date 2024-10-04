
import { useState, useEffect } from 'react'
// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Stack, Grid } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../../reusable/forms/useForm';
import Controls from '../../reusable/forms/controls/Controls';
import { returnValidation } from '../../validation';
import { useNewPasswordMutation } from '../../api/MPOSlices/AccountApiSlice';
import Cookies from 'js-cookie';
import { extractErrorMessage } from '../../reusable/extractErrorMessage';

//! new password mutation hook


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

export default function NewPassword() {
    const navigate = useNavigate();
    const [newPwd] = useNewPasswordMutation();

    const [conditionMet, setConditionMet] = useState(false);
    const mdUp = useResponsive('up', 'md');
    const [pwd, setPwd] = useState('')
    const [confirmPwd, setConfirmPwd] = useState('')
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })
    const [success, setSuccess] = useState(false)
    // 

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('chemist_name' in fieldValues)
            temp.password = returnValidation(['null', 'password'], values.password)
        temp.confirmPassword = returnValidation(['null', 'password'], values.confirmPassword)
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
        setPwd(values.password)
        setConfirmPwd(values.confirmPassword)

    }, [values.password, values.confirmPassword])

    const handleSubmission = async (e) => {
        e.preventDefault()

        if (pwd === confirmPwd) {
            setConditionMet(true);
            try {
                const res = await newPwd({ 'email': Cookies.get('OTPgmail'), 'new_password': pwd })
                setSuccess(true);
                if (res?.data) {
                    setSuccess(false)
                    Cookies.remove('otp')
                    setSuccessMessage({ show: true, message: 'Password Successfully Changed' })
                    setTimeout(() => {
                        navigate('/login');
                    }, [3000])
                }
                else {
                    setSuccess(false)
                    setErrorMessage({ show: true, message: extractErrorMessage(res.error) });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: "" });
                    }, [3000])
                }
            }
            catch (err) {
                setSuccess(false)
            }
        }
        else {
            setConditionMet(false);
            setErrorMessage({ show: true, message: "Password and Confirm Password must be same" });
            setTimeout(() => {
                setErrorMessage({ show: false, message: "" });
            }, [3000])
        }
    }

    return (
        <>
            <StyledRoot>

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Create a new Password
                        </Typography>
                        <img src="/assets/illustrations/new_password.png" alt="login" />
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
                            Please enter a new password
                        </Typography>
                        {/* <LoginForm /> */}
                        <>

                            <Stack spacing={3}>
                                <Box marginBottom={0.25}>
                                    <Controls.InputPassword
                                        name="password"
                                        label="New Password*"
                                        value={values.password}
                                        onChange={handleInputChange}
                                        error={errors.password}
                                    // sx={{ pt: 3 }}
                                    />
                                </Box>
                                <Box marginBottom={1}>
                                    <Controls.InputPassword
                                        name="confirmPassword"
                                        label="Confirm New Password*"
                                        value={values.confirmPassword}
                                        onChange={handleInputChange}
                                        error={errors.confirmPassword}
                                    // sx={{ pt: 3 }}
                                    />
                                </Box>
                            </Stack>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                            </Stack>
                            {/* <p>Condition Met: {conditionMet ? 'True' : 'False'}</p> */}
                            {/* <p>{pwd + confirmPwd}</p> */}
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
