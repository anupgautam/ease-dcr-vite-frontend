import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// redux
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../../api/RTK query/authSlice';
import { useLoginUserMutation } from '../../../api/MPOSlices/UserSlice';
// @mui
import { Stack, Checkbox, Box, Grid, } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from '../../../reusable/forms/useForm';
import { returnValidation } from '../../../validation';
//! Authentication  
import Cookies from 'js-cookie';
import '../../../styles/muiTextBox.css'
import "../../../styles/styles.css";
import Controls from '../../../reusable/forms/controls/Controls';

const LoginFormInputs = () => {

    //! Focus on email
    const emailRef = useRef(null);
    //! Set focus to email input on page load
    useEffect(() => {
        if (emailRef.current) {
            emailRef.current.focus();
        }
    }, []);

    const [shouldAnimate, setShouldAnimate] = useState(false);
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    //! RTK Query loginHook
    const [login] = useLoginUserMutation()
    // const [login, { data }] = useLoginUserMutation()
    const dispatch = useDispatch()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' })
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' })

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('email' in fieldValues)
            temp.email = returnValidation(['null', 'email'], values.email)
        temp.password = returnValidation(['null', 'password'], values.password)
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
        setPassword(values.password)
        setEmail(values.email)
    }, [values.email, values.password])

    //! RTKQuery login
    const handleSubmission = useCallback(async (e) => {
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
                        Cookies.set('email', values.email);
                        setSuccessMessage({ show: true, message: 'Successfully Logged In' })
                        if (res.data.role === 'admin' || res.data.role === 'ADMIN') {
                            Cookies.set('user_role', 'admin')
                            setTimeout(() => {
                                navigate('/dashboard/admin');
                            }, [3000])
                            dispatch(setCredentials({ ...res, email }))
                        } else if (res.data.role === 'MPO' || res.data.role === 'mpo') {
                            Cookies.set('user_role', 'MPO')
                            setTimeout(() => {
                                navigate('/dashboard/admin/listofdoctor');
                            }, [3000])
                        } else if (res.data.role === "ASM") {
                            Cookies.set('user_role', 'other-roles')
                            setTimeout(() => {
                                navigate('/dashboard/admin/tourplan');
                            }, [3000])
                        } else if (res.data.role === "RSM" || res.data.role === "SM" || res.data.role === "MM" || res.data.role === "CH") {
                            Cookies.set('user_role', 'other-roles')
                            Cookies.set('role', 'other')
                            setTimeout(() => {
                                navigate('/dashboard/admin/tourplan');
                            }, [3000])
                        }
                        else {
                            setErrorMessage({ show: true, message: "User Does not exist." });
                            setTimeout(() => {
                                setErrorMessage({ show: false, message: "" });
                            }, [2000])
                        }
                    } if (res.error) {
                        setErrorMessage({ show: true, message: res.error.error });
                        setTimeout(() => {
                            setErrorMessage({ show: false, message: "" });
                        }, [2000])
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



    return (
        <>
            <Box>
                <Stack spacing={2.5}>
                    <Box marginBottom={0.25}>
                        <Controls.Input
                            name="email"
                            label="Email*"
                            value={values.email}
                            onChange={handleInputChange}
                            error={errors.email}
                            InputLabelProps={{
                                className: shouldAnimate ? 'MuiInputLabel-outlined' : '',
                            }}
                            sx={{ pb: 3, }}
                            inputRef={emailRef}
                        />
                    </Box>
                    <Box marginBottom={0.25}>
                        <Controls.InputPassword
                            name="password"
                            label="Password*"
                            value={values.password}
                            onChange={handleInputChange}
                            error={errors.password}
                            sx={{ pt: 3 }}
                        />
                    </Box>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
                    <Checkbox defaultChecked name="remember" label="Remember me" />
                    <label style={{ textAlign: 'start', flex: 1, fontWeight: "600", marginLeft: "4px", fontSize: "16px" }}>Remember me</label>
                    <Link to="/forgetpassword" variant="subtitle2" underline="hover">
                        Forgot password?
                    </Link>
                </Stack>
                <LoadingButton className="loginbutton" fullWidth size="large" type="submit" variant="contained" onClick={handleSubmission} >
                    Login
                </LoadingButton>

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
            </Box>
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