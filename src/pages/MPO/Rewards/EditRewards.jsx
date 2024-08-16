import React, { useEffect, useState, useCallback } from 'react'
import {
    Box,
    Typography, Button, Grid
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
import Cookies from 'js-cookie'
//! Api Slices 
import {
    useGetRewardsByIdQuery,
    useUpdateRewardsMutation
} from '@/api/MPOSlices/rewardsApiSlice';

const EditRewards = ({ idharu, onClose }) => {

    //! Getting Rewards by ID
    const Rewards = useGetRewardsByIdQuery(idharu);
    const Divisions = useGetRewardsByIdQuery(Cookies.get('company_id'));

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('reward' in fieldValues)
            temp.reward = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.reward)
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
        if (Rewards.data) {
            setInitialFValues({
                reward: Rewards.data.reward,
            });
        }
    }, [Rewards.data])


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

    //! Edit user
    const [updateRewards] = useUpdateRewardsMutation();
    const history = useNavigate()
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("reward", values.reward);
        formData.append('id', idharu);
        formData.append("company_name", Cookies.get('company_id'));
        formData.append('refresh', Cookies.get('refresh'))
        formData.append('access', Cookies.get('access'));
        try {
            const response = await updateRewards(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Edited Rewards' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
                onClose();
            }, 3000);
        }
        catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
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
            </Drawer>
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
};

export default React.memo(EditRewards);