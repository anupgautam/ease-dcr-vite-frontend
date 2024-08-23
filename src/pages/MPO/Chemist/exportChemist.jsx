import { Close } from "@mui/icons-material";
import { Autocomplete, Box, Button, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState, useMemo, useContext } from "react";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import { useGetAllVisitedMpoWiseChemistQuery } from "@/api/MPOSlices/doctorApiSlice";
import ExportToExcel from "@/reusable/utils/exportSheet";
import { CookieContext } from '@/App'

const ExportChemist = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

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

    const { data } = useGetAllVisitedMpoWiseChemistQuery({ company_name: company_id, mpo_name: mpoName.id === undefined ? "" : mpoName.id, mpo_area: "" });


    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Chemist Name', key: 'chemist_name' },
        { label: 'Chemist Address', key: "chemist_address" },
        { label: 'Chemist Phone Number', key: 'chemist_phone_number' },
        { label: 'Chemist Category', key: 'chemist_category' },
        { label: 'Chemist Contact Number', key: 'chemist_contact_person' },
        { label: 'Chemist PAN Number', key: 'chemist_pan_number' },
        { label: 'User', key: "user" },
        { label: 'Is Invested', key: "is_invested" }
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        chemist_name: values?.chemist_name?.chemist_name,
        chemist_address: values?.chemist_name?.chemist_address,
        chemist_phone_number: values?.chemist_name?.chemist_phone_number,
        chemist_category: values?.chemist_name?.chemist_category,
        chemist_contact_person: values?.chemist_name?.chemist_contact_person,
        chemist_pan_number: values?.chemist_name?.chemist_pan_number,
        user: mpoName.title,
        is_invested: values?.chemist_name?.is_investment === true ? 'Is Invested' : 'Not Invested'
    }))

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

    const handleMPONameChange = (event, value) => {
        setMPOName(value)
    };
    return (
        <Box>
            <Box style={{ float: "right" }}>
                {data ?
                    <>
                        <ExportToExcel headers={headers} fileName={`Chemists`} data={templateData} />
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
                            Export Chemist
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

                            {
                                data ?
                                    <ExportToExcel headers={headers} fileName={`${mpoName ? mpoName.title + ' ' + 'Chemist List' : 'All Chemist'}`} data={templateData} />
                                    : <></>
                            }
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

export default React.memo(ExportChemist);