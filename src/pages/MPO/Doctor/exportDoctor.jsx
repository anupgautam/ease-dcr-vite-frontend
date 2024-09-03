import { Close } from "@mui/icons-material";
import { Autocomplete, Box, Button, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import { useGetAllVisitedMpoWiseDoctorQuery } from "@/api/MPOSlices/doctorApiSlice";
import ExportToExcel from "@/reusable/utils/exportSheet";
import { useSelector } from 'react-redux';

const ExportDoctor = () => {

    const { company_user_role_id, user_role, company_user_id, company_id } = useSelector((state) => state.cookie);

    const [MpoData] = usePostAllMPONamesNoPageMutation();
    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.last_name }))
        }
        return [];
    }, [MpoList])

    const { data } = useGetAllVisitedMpoWiseDoctorQuery({ company_name: company_user_role_id, mpo_name: mpoName.id === undefined ? "" : mpoName.id, mpo_area: "" }, {
        skip: !company_user_role_id || !mpoName?.id
    });

    const headers = [

        { label: 'S.No.', key: 'sno' },
        { label: 'Doctor Name', key: 'doctor_name' },
        { label: 'Doctor Address', key: "doctor_address" },
        { label: 'Doctor Gender', key: 'doctor_gender' },
        { label: 'Doctor Phone Number', key: 'doctor_phone_number' },
        { label: 'Doctor Category', key: 'doctor_category' },
        { label: 'Doctor NMC Number', key: 'doctor_nmc_number' },
        { label: 'Doctor Qualification', key: 'doctor_qualification' },
        { label: 'User', key: "user" },
        { label: 'Is Invested', key: "is_invested" }
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        doctor_name: values?.doctor_name?.doctor_name,
        doctor_address: values?.doctor_name?.doctor_address,
        doctor_gender: values?.doctor_name?.doctor_gender,
        doctor_phone_number: values?.doctor_name?.doctor_phone_number,
        doctor_category: values?.doctor_name?.doctor_category,
        doctor_nmc_number: values?.doctor_name?.doctor_nmc_number,
        doctor_qualification: values?.doctor_name?.doctor_qualification,
        user: mpoName?.title,
        is_invested: values?.doctor_name?.is_investment === true ? 'Is Invested' : 'Not Invested'
    }))

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id }, {
                skip: !company_id
            })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    const handleMPONameChange = (event, value) => {
        setMPOName(value)
        // setSelectedOption(value?.id);
    };
    return (
        <Box>
            <Box style={{ float: "right" }}>
                {data ?
                    <>
                        <ExportToExcel headers={headers} fileName={`Doctors`} data={templateData} />
                    </> : <></>}
            </Box>
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
                            Export Doctor
                        </Typography>
                        <Box marginTop={3} marginBottom={3}>
                            <Autocomplete
                                options={mpoNames}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMPONameChange}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.title}
                                    </li>
                                )}
                            />
                        </Box>
                        <Stack spacing={1} direction="row">
                            {/* <Button
                                variant="contained"
                                className="summit-button"
                            > */}
                            {
                                data ?
                                    <ExportToExcel headers={headers} fileName={`${mpoName ? mpoName.title + ' ' + 'Doctor List' : 'All Doctor'}`} data={templateData} />
                                    : <></>
                            }
                            {/* </Button> */}
                            <Button
                                variant="outlined"
                                className="cancel-button"
                                onClick={() => setIsDrawerOpen(false)}
                            >
                                Cancel
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            </Drawer>
        </Box>
    )
}

export default React.memo(ExportDoctor);