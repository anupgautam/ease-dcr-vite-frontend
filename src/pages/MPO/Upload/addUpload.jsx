import React, { useState, useEffect, useCallback } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../components/iconify';
import { toast } from 'react-toastify';

import { useForm } from '../../../reusable/forms/useForm'
import Controls from "@/reusable/forms/controls/Controls";
import { returnValidation } from '../../../validation';
import { usePostUploadDataMutation } from '@/api/Uploads/uploadApiSlice';
import BlobToFile from '@/reusable/utils/blobToFile';
import { useSelector } from 'react-redux';
import { extractErrorMessage } from '@/reusable/extractErrorMessage';

const AddUpload = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [File, setFile] = useState([]);

    const [createUpload] = usePostUploadDataMutation();

    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('upload_name' in fieldValues)
            temp.upload_name = returnValidation(['null', 'lessThan50', 'specialcharacter', 'minLength3'], values.upload_name)
        temp.upload_type = returnValidation(['null'], values.upload_type)
        temp.upload = returnValidation(['null'], values.upload)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
    }

    const initialFValues = {
        upload_name: "",
        upload_type: "",
        upload: ""
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        handleImageUpload,
        resetForm,
    } = useForm(initialFValues, true, validate)

    useEffect(() => {
        validate();

    }, [values.upload_type, values.upload_name, values.upload])

    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {
        const valid = validate(values);

        setIsButtonDisabled(!valid);
    }, [values.upload_type, values.upload_name, values.upload]);

    useEffect(() => {
        handleImageUpload('upload', File);
    }, [File])

    const [loading, setLoading] = useState(false);
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    var file = BlobToFile(File, "upload");

    //!Modal wala ko click event
    const onAddUpload = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append("upload_name", values.upload_name);
        formData.append("mpo_name", company_user_id);
        formData.append("upload_type", values.upload_type);
        formData.append('company_name', company_id)
        var file = BlobToFile(File, "upload");
        if (file.length !== 0) {
            formData.append("upload", file);
        }
        try {
            const response = await createUpload(formData)
            console.log(response)
            if (response?.data) {
                // setSuccessMessage({ show: true, message: 'Successfully Added Upload.' });
                // setTimeout(() => {
                //     setSuccessMessage({ show: false, message: '' });
                // }, 3000);
                // setIsDrawerOpen(false)

                toast.success(`${response?.data?.message}`)
                setIsButtonDisabled(true)
                setIsDrawerOpen(false)
            } else if (response?.error) {
                console.log(response)
                // setErrorMessage({ show: true, message: extractErrorMessage({ data: response?.error }) });
                // setLoading(false);
                // setTimeout(() => setErrorMessage({ show: false, message: '' }), 2000);

                toast.error(`${response?.error?.data?.message}`)
                setLoading(false);
            }
            else {
                // setErrorMessage({ show: true, message: response.error.data });
                // setTimeout(() => {
                //     setErrorMessage({ show: false, message: '' });
                // }, 3000);
                toast.error(`Some Error Occured`)

            }
        } catch (error) {
            // setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
            // setTimeout(() => {
            //     setErrorMessage({ show: false, message: '' });
            // }, 3000);
            toast.error(`Some Error Occured`)
        } finally {
            setLoading(false)
        }
    }, [createUpload, values])

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
                        // width="400px"
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
                            Add Upload
                        </Typography>

                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={6}></Grid>
                    </Grid>
                    <Box marginBottom={2}>
                        <Controls.Input
                            id="autoFocus"
                            autoFocus
                            name="upload_name"
                            label="Upload Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.upload_name}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="upload_type"
                            label="Select Upload Type*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.upload_type}
                            options={[
                                {
                                    id: 'Statements',
                                    title: "Statements"
                                },
                                {
                                    id: 'Bills',
                                    title: "Bills"
                                },
                            ]}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.File
                            setFile={setFile}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            disabled={isButtonDisabled}
                            onClick={(e) => onAddUpload(e)}
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
    )
}

export default React.memo(AddUpload);