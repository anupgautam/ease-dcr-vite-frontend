import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';

import { useForm } from '../../../reusable/forms/useForm';
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';

import {
    useCreateRewardsMutation
} from '@/api/MPOSlices/rewardsApiSlice';
import { CookieContext } from '@/App'

const AddRewards = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [createRewards] = useCreateRewardsMutation();

    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ('reward' in fieldValues)
            temp.reward = fieldValues.reward ? returnValidation(['null'], fieldValues.reward) : "";
        if ('price' in fieldValues)
            temp.price = fieldValues.price ? returnValidation(['null', 'isNumberOnly'], fieldValues.price) : "";

        setErrors({
            ...temp
        });

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "");
    };

    const initialFValues = {
        reward: '',
    };

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true, validate);

    useEffect(() => {
        validate();
    }, [values.reward, values.price]);

    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const onAddRewards = useCallback(async (e) => {
        e.preventDefault();
        if (validate()) {
            const formData = new FormData();
            formData.append("reward", values.reward);
            formData.append("company_name", company_id);
            try {
                const response = await createRewards(formData).unwrap();
                setSuccessMessage({ show: true, message: 'Successfully Added Rewards' });
                setTimeout(() => {
                    setSuccessMessage({ show: false, message: '' });
                }, 3000);
                resetForm();
                setIsDrawerOpen(false);
            } catch (error) {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            }
        }
    }, [createRewards, values]);

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add
            </Button>
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400,
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400
                    }
                }}
            >
                <Box style={{ padding: "20px" }}>
                    <Box
                        p={1}
                        textAlign="center"
                        role="presentation"
                        className="drawer-box"
                        style={{ marginBottom: "40px" }}
                    >
                        <IconButton
                            className="close-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            <Close />
                        </IconButton>
                        <Typography variant="h6" >
                            Add Rewards
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="auto-focus"
                            name="reward"
                            label="Reward*"
                            value={values.reward}
                            onChange={handleInputChange}
                            error={errors.reward}
                            autoFocus
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
                            onClick={(e) => onAddRewards(e)}
                            text="Submit"
                        />
                        <Button
                            variant="outlined"
                            className="cancel-button"
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
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
        </>
    );
};

export default React.memo(AddRewards);
