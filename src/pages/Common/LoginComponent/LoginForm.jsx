import { useState, useEffect, useRef, useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// redux
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../api/RTK query/authSlice';
import { useLoginUserMutation } from '../../../api/MPOSlices/UserSlice';
// @mui
import { Stack, Checkbox, Box, Grid, Link, useTheme, useMediaQuery, TextField, InputAdornment } from '@mui/material';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaRegEyeSlash } from 'react-icons/fa';
import { LoadingButton } from '@mui/lab';
//! Authentication  
import Cookies from 'js-cookie';
import '../../../styles/muiTextBox.css'
import "../../../styles/styles.css";

const LoginFormInputs = () => {

    const [shouldAnimate, setShouldAnimate] = useState(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [emailHelperText, setEmailHelperText] = useState('');
    const [passwordHelperText, setPasswordHelperText] = useState('');
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));


    //! RTK Query loginHook
    const [login] = useLoginUserMutation()
    const dispatch = useDispatch()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        validateEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(true);
            setEmailHelperText('Invalid email address');
        } else {
            setEmailError(false);
            setEmailHelperText('');
        }
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

    //! RTKQuery login
    const handleSubmission = useCallback(async (e) => {
        e.preventDefault();
        validateEmail(email);
        validatePassword(password);
        if (!emailError && !passwordError) {
            try {
                await login({ 'email': email, 'password': password })
                    .then((res) => {
                        if (res.data) {
                            Cookies.set('User_id', res.data.user_id);
                            Cookies.set('company_id', res.data.company_id);
                            Cookies.set('company_user_id', res.data.company_user_id);
                            Cookies.set('company_user_role_id', res.data.company_user_role_id);
                            Cookies.set('company_division_name', res.data.company_division_name);
                            Cookies.set('refresh', res.data.token.refresh);
                            Cookies.set('access', res.data.token.access);
                            Cookies.set('email', email);
                            Cookies.set('is_highest_priority', res.data.is_highest_priority)
                            setSuccessMessage({ show: true, message: 'Successfully Logged In' })
                            setTimeout(() => setSuccessMessage({ show: false, message: "" }), 2000);
                            if (res.data.role === 'admin' || res.data.role === 'ADMIN') {
                                Cookies.set('user_role', 'admin')
                                navigate('/dashboard/admin');
                                dispatch(setCredentials({ ...res, email }))
                            } else if (res.data.role === 'MPO' || res.data.role === 'mpo') {
                                Cookies.set('user_role', 'MPO')
                                navigate('/dashboard/admin/listofdoctor');
                            } else if (res.data.role === "ASM") {
                                Cookies.set('user_role', 'other-roles')
                                navigate('/dashboard/admin/tourplan');
                            } else if (res.data.role === "RSM" || res.data.role === "SM" || res.data.role === "MM" || res.data.role === "CH") {
                                Cookies.set('user_role', 'other-roles')
                                Cookies.set('role', 'other')
                                navigate('/dashboard/admin/tourplan');
                            }
                            else {
                                setErrorMessage({ show: true, message: "User Does not exist." });
                                setTimeout(() => {
                                    setErrorMessage({ show: false, message: "" });
                                }, [2000])
                            }
                        } if (res.error) {
                            if (res.error?.originalStatus === 500) {
                                setErrorMessage({ show: true, message: 'Backend Error' });
                            } else {
                                setErrorMessage({ show: true, message: res.error.data });
                            }
                            setTimeout(() => setErrorMessage({ show: false, message: "" }), 2000);
                        } else {
                            setErrorMessage({ show: true, message: 'Login Failed' });
                            setTimeout(() => {
                                setErrorMessage({ show: false, message: "" });
                            }, [2000])
                        }
                    })
            } catch (err) {
                setErrorMessage({ show: true, message: 'Login Failed' });

                setTimeout(() => {
                    setErrorMessage({ show: false, message: "" });
                }, [2000])
            }
        }
        else {
            setErrorMessage({ show: true, message: "Enter correct values" });
            setTimeout(() => {
                setErrorMessage({ show: false, message: "" });
            }, [2000])
        }
    }, [email, password])


    useEffect(() => {
        const handleKeyDown = e => {
            if (e.key === 'Enter' && email && password) {
                handleSubmission();
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
            <h1 className=' text-[40px] font-bold font-public_sans text-[#6364f2]'>Login !</h1>
            <img src="/assets/ease.svg" className=' h-24 mb-3 lg:mb-6 mx-auto mt-2' />
            <form onSubmit={handleSubmission} noValidate>
                <Box>
                    <Stack spacing={2.5}>
                        <Box marginBottom={0.25}>
                            <TextField
                                label="Email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                error={emailError}
                                helperText={emailHelperText}
                                fullWidth
                                margin="normal"
                                autoFocus
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
                            // className="cursor-pointer"
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
                    <LoadingButton className="loginbutton" fullWidth size="large" type="submit" variant="contained" onClick={handleSubmission} >
                        Login
                    </LoadingButton>
                    {/* <p className=' text-center my-3 font-public_sans font-semibold text-gray-400'>—————— or ——————</p>
                    <p className=' text-center my-3 font-public_sans font-semibold'>Are you new? <span className=' underline-offset-2 underline text-[#6364f2]'> Create an Account</span></p> */}

                    {
                        ErrorMessage.show === true ? (
                            <>
                                <Grid>
                                    <Box className="messageContainer errorMessage">
                                        <h1 style={{ fontSize: '14px', color: 'white' }}>{ErrorMessage.message}</h1>
                                    </Box>
                                </Grid>
                            </>
                        ) : null
                    }
                    {
                        SuccessMessage.show === true ? (
                            <>
                                <Grid>
                                    <Box className="messageContainer successMessage">
                                        <h1 style={{ fontSize: '14px', color: 'white' }}>{SuccessMessage.message}</h1>
                                    </Box>
                                </Grid>
                            </>
                        )
                            : null
                    }
                </Box >
            </form >
        </>
    )
}

const LoginForm = () => {
    return (
        <>
            <LoginFormInputs />
        </>
    );
}
export default LoginForm;