import { Close } from "@mui/icons-material";
import { Box, Button, Drawer, Grid, IconButton, Stack, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState, useMemo } from "react";
import { usePostAllMPONamesNoPageMutation, useTransferMpoAreaMutation } from "@/api/MPOSlices/DoctorSlice";
import { useGetMpoAreaQuery } from "@/api/MPOSlices/TourPlanSlice";
import Iconify from "@/components/iconify/Iconify";
import Controls from "@/reusable/forms/controls/Controls";
import { useForm } from "@/reusable/forms/useForm";

const TransferMpoArea = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [MpoData] = usePostAllMPONamesNoPageMutation();

    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList.data) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.middle_name + ' ' + key.user_name.last_name }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (Cookies.get('company_id')) {
            MpoData({ company_name: Cookies.get('company_id') })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [Cookies.get('company_id')])


    const initialFValues = {

    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
    } = useForm(initialFValues, true)


    const MpoArea = useGetMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_name: values.transfer_from });

    const mpoAreaData = useMemo(() => {
        if (MpoArea?.data) {
            return MpoArea?.data.push({ id: key.id, title: key.area_name })
        }
        return [];
    }, [])

    const [MpoTransferArea] = useTransferMpoAreaMutation();
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });

    const transferArea = (e) => {
        e.preventDefault();
        const data = {
            "transfer_to_mpo": values.transfer_to,
            "transfer_from_mpo": values.transfer_from,
            "area": values.mpo_area
        }
        MpoTransferArea(data)
            .then((res) => {
                if (res?.data) {
                    setSuccessMessage({ show: true, message: 'Successfully Transfered Area.' });
                    setTimeout(() => {
                        setSuccessMessage({ show: false, message: '' });
                    }, 3000);
                } else {
                    setErrorMessage({ show: true, message: res.error.data[0] });
                    setTimeout(() => {
                        setErrorMessage({ show: false, message: '' });
                    }, 3000);
                }
            })
            .catch((err) => {
                setErrorMessage({ show: true, message: 'Some Error Occurred. Try again later.' });
                setTimeout(() => {
                    setErrorMessage({ show: false, message: '' });
                }, 3000);
            })
    }

    return (
        <>
            {Cookies.get('user_role') === "admin" ?
                <Button
                    variant="contained"
                    startIcon={<Iconify icon="tabler:transfer" />} onClick={() => setIsDrawerOpen(true)} >
                    Transfer
                </Button> : <></>}

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
                            Transfer Mpo Area
                        </Typography>
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="transfer_from"
                            label="Transfer From*"
                            value={values.transfer_from}
                            onChange={handleInputChange}
                            // error={errors.mpo_name}
                            options={mpoNames}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="transfer_to"
                            label="Transfer To*"
                            value={values.transfer_to}
                            onChange={handleInputChange}
                            // error={errors.mpo_name}
                            options={mpoNames}
                        />
                    </Box>
                    <Box marginBottom={2}>
                        <Controls.Select
                            name="mpo_area"
                            label="Mpo Area*"
                            value={values.mpo_area}
                            onChange={handleInputChange}
                            // error={errors.mpo_area}
                            options={mpoAreaData}
                        />
                    </Box>
                    <Stack spacing={1} direction="row">
                        <Controls.SubmitButton
                            variant="contained"
                            className="submit-button"
                            onClick={(e) => transferArea(e)}
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

export default React.memo(TransferMpoArea);