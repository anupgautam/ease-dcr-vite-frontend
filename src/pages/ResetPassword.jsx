import { useState, useEffect } from 'react'
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Checkbox, Box, Grid, Link, useTheme, useMediaQuery, TextField, InputAdornment, CircularProgress, Typography, Container } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
import { LoadingButton } from '@mui/lab';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForgotPasswordMutation } from '../api/MPOSlices/AccountApiSlice';
import Cookies from 'js-cookie'
import { extractErrorMessage } from '../reusable/extractErrorMessage';
import { FaRegEyeSlash } from 'react-icons/fa';
import { MdOutlineRemoveRedEye } from 'react-icons/md';


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

export default function ResetPassword() {
    const navigate = useNavigate();
    const [createForgotPwd] = useForgotPasswordMutation();

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false);
    const [passwordHelperText, setPasswordHelperText] = useState('');
    const [loading, setLoading] = useState(false);

    const mdUp = useResponsive('up', 'md');
    const [email, setEmail] = useState('')
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })
    const [success, setSuccess] = useState(false)

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const validatePassword = (password) => {
        if (password.length < 4) {
            setPasswordError(true);
            setPasswordHelperText('Password must be at least 8 characters');
        } else {
            setPasswordError(false);
            setPasswordHelperText('');
        }
    };

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
            else {
                setErrorMessage({ show: true, message: extractErrorMessage(res.error) });
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

    useEffect(() => {
        const handleKeyDown = e => {
            if (e.key === 'Enter' && email && password) {
                handleSubmission(e);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [email, password]);

    const [visible, setVisible] = useState(false);

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <>
            <StyledRoot>

                {mdUp && (
                    <StyledSection>
                        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                            Reset your password
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
                        <form onSubmit={handleSubmission} noValidate>
                            <Box>
                                <Stack spacing={2.5}>
                                    <Box marginBottom={0.25}>
                                        <TextField
                                            label="Password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            error={passwordError}
                                            helperText={passwordHelperText}
                                            fullWidth
                                            margin="normal"
                                            type={visible ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end" style={{ marginRight: '0px' }}>
                                                        <Box onClick={toggleVisibility}
                                                            className="cursor-pointer"
                                                        >
                                                            {visible ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Box>
                                    <Box marginBottom={0.25}>
                                        <TextField
                                            label="Password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            error={passwordError}
                                            helperText={passwordHelperText}
                                            fullWidth
                                            margin="normal"
                                            type={visible ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end" style={{ marginRight: '0px' }}>
                                                        <Box onClick={toggleVisibility}
                                                            className="cursor-pointer"
                                                        >
                                                            {visible ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Box>
                                    <Box marginBottom={0.25}>
                                        <TextField
                                            label="Password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            error={passwordError}
                                            helperText={passwordHelperText}
                                            fullWidth
                                            margin="normal"
                                            type={visible ? 'text' : 'password'}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end" style={{ marginRight: '0px' }}>
                                                        <Box onClick={toggleVisibility}
                                                            className="cursor-pointer"
                                                        >
                                                            {visible ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Box>
                                </Stack>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                                    <Checkbox name="remember" label="Remember me" />
                                    <label style={{ textAlign: 'start', flex: 1, fontWeight: "600", marginLeft: "4px", fontSize: "16px" }}>Remember me</label>
                                    <Link
                                        component={RouterLink}
                                        to="/forgetpassword"
                                        variant="subtitle3"
                                        sx={{
                                            textDecoration: 'none',
                                            color: '#007bff',
                                            '&:hover': {
                                                color: '#0056b3',
                                            }
                                        }}
                                    >
                                        Forgot Password?
                                    </Link>
                                </Stack>
                            </Box>
                            <LoadingButton className="loginbutton" fullWidth size="large" type="submit" variant="contained">
                                Reset Password
                            </LoadingButton>
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
                            {loading && (
                                <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 100 }}>
                                    <CircularProgress />
                                </Grid>
                            )}
                        </form>
                    </StyledContent>
                </Container>
            </StyledRoot>
        </>
    );
}

