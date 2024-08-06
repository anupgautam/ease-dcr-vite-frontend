import React, { useState, useEffect } from 'react'
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
import Iconify from '../../../../components/iconify';

import { useForm } from '../../../../reusable/forms/useForm'
import Controls from '../../../../reusable/components/forms/controls/Controls';
import { returnValidation } from '../../../../validation';

import {
    useCreateChemistsCategoryMutation
} from '@/api/MPOSlices/ChemistSlice';
import Cookies from 'js-cookie'

const AddChemistCategory = () => {

    //! Create Chemist
    const [createChemistCategory] = useCreateChemistsCategoryMutation()


    //! Validation wala  
    const validate = (fieldValues = values) => {
        // 
        let temp = { ...errors }
        if ('category_name' in fieldValues)
            temp.category_name = returnValidation(['null', 'number', 'lessThan50', 'specialcharacter'], values.category_name)

        setErrors({
            ...temp
        })
        // 

        if (fieldValues === values)
            return Object.values(temp).every(x => x == "")
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

    }, [values.category_name, validate])


    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    //!Modal wala ko click event
    const onAddChemistCategorys = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("category_name", values.category_name);
        formData.append("company_id", Cookies.get("company_id"));
        try {
            await createChemistCategory(formData).unwrap();
            setSuccessMessage({ show: true, message: 'Successfully Added Chemist Categories' });
            setTimeout(() => {
                setSuccessMessage({ show: false, message: '' });
            }, 3000);
        } catch (error) {
            setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later' });
            setTimeout(() => {
                setErrorMessage({ show: false, message: '' });
            }, 3000);
        }

        setIsDrawerOpen(false)
    };
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => setIsDrawerOpen(true)} >
                Add
            </Button>
            {/* <Button
                variant="contained"
                className="user-drawer-button"
                onClick={() => setIsDrawerOpen(true)}
            >
                Add Chemist
            </Button> */}
            <Drawer
                anchor="right"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                padding="16px"
                sx={{
                    width: 400, // Set the desired width of the Drawer
                    flexShrink: 0,
                    boxSizing: "border-box",
                    '& .MuiDrawer-paper': {
                        width: 400 // Set the same width for the paper inside the Drawer
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
                            Add Chemist Category
                        </Typography>
                    </Box>

                    <Box marginBottom={2}>
                        <Controls.Input
                            name="category_name"
                            label="Category Name*"
                            value={values.name}
                            onChange={handleInputChange}
                            error={errors.category_name}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Button
                            variant="contained"
                            className="summit-button"
                            onClick={(e) => onAddChemistCategorys(e)}
                        >
                            Submit{" "}
                        </Button>
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
    )
}

export default AddChemistCategory