import React, { useEffect, useState, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid, CircularProgress
} from '@mui/material'
import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
//! Reusable Component
import { useForm, Form } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
//! Api Slices 
import {
    useGetRewardsByIdQuery,
    useUpdateRewardsMutation
} from '@/api/MPOSlices/rewardsApiSlice';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';
import { toast } from 'react-toastify';

const EditRewards = ({ idharu, onClose }) => {
    const { company_id, refresh, access } = useSelector((state) => state.cookie);

    //! Getting Rewards by ID
    const Rewards = useGetRewardsByIdQuery(idharu);

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('reward' in fieldValues)
            temp.reward = returnValidation(['null', 'lessThan50', 'reward', 'minLength3'], values.reward)

        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const [initialFValues, setInitialFValues] = useState({
        reward: "",
    })

    useEffect(() => {
        if (Rewards?.data) {
            setInitialFValues({
                reward: Rewards?.data?.reward,
            });
        }
    }, [Rewards])


    const { values,
        errors,
        setErrors,
        handleInputChange
    } = useForm(
        initialFValues,
        true,
        false,
        true
    )

    useEffect(() => {
        validate();
    }, [
        values.reward])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);
        setIsButtonDisabled(!valid);
    }, [values.reward]);

    //! Edit user
    const [updateRewards] = useUpdateRewardsMutation();

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        // const formData = new FormData();
        // formData.append("reward", values.reward);
        // formData.append('id', idharu);
        // formData.append("company_name", company_id);
        // formData.append('refresh', refresh)
        // formData.append('access', access);

        const data = { reward: values.reward, id: Rewards?.data?.id, company_name: company_id, refresh: refresh, access: access }

        try {
            const response = await updateRewards(data)
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Edited Rewards' });
                // setLoading(false);
                // setTimeout(() => {
                //     onClose();
                //     setSuccessMessage({ show: false, message: '' });
                // }, 2000);

                toast.success(`${response?.data?.msg}`)
                setIsButtonDisabled(true)
                setLoading(false);
                onClose();
            }
            else if (response?.error) {
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);
                console.log(response?.error)
                toast.error(`${response?.error?.data?.msg}`)
                setLoading(false);
            }
            else {
                // setErrorMessage({ show: true, message: 'Data failed to update.' });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 2000);
                toast.error(`Some Error Occured`)

            }
        }
        catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 2000);

            console.log(error)
            toast.error('Backend Error')
        } finally {
            setLoading(false)
        }
    }, [updateRewards, values])

    return (
        <>
            <Drawer
                anchor="right"
                open={true}
                onClose={onClose}
                padding="16px"
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        width="400px"
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={onClose}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Edit Rewards
                        </Typography>
                    </Box>

                    <Form onSubmit={handleSubmit}>
                        <Box marginBottom={2}>
                            <Controls.Input
                                id="auto-focus"
                                autoFocus
                                name="reward"
                                label="Reward*"
                                value={values.reward}
                                onChange={handleInputChange}
                                error={errors.reward}
                            />
                        </Box>
                        {/* <Box marginBottom={2}>
                            <Controls.Input
                                name="price"
                                label="Price*"
                                value={values.price}
                                onChange={handleInputChange}
                                error={errors.price}
                            />
                        </Box> */}
                        <Stack spacing={1} direction="row">
                            <Controls.SubmitButton
                                variant="contained"
                                className="submit-button"
                                disabled={isButtonDisabled}
                                onClick={(e) => handleSubmit(e)}
                                text="Submit"
                            />
                            <Button
                                variant="outlined"
                                className="cancel-button"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Form>
                </Box>
                {loading && (
                    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 1000 }}>
                        <CircularProgress />
                    </Grid>
                )}
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
            </Drawer>
        </>
    );
};

export default React.memo(EditRewards);