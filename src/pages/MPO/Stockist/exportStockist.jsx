import { Close } from "@mui/icons-material";
import { Autocomplete, Box, Button, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useState, useMemo, useCallback } from "react";
import { useGetAllCompanyAreasWithoutPaginationQuery } from "@/api/CompanySlices/companyAreaSlice";
import { useGetAllStockistsWithoutPaginationQuery } from "@/api/MPOSlices/StockistSlice";
import ExportToExcel from "@/reusable/utils/exportSheet";
import Iconify from "../../../components/iconify/Iconify";

const ExportStockist = () => {
    const [mpoName, setMPOName] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data: companyAreaData } = useGetAllCompanyAreasWithoutPaginationQuery(Cookies.get('company_id'))

    const companyArea = useMemo(() => {
        if (companyAreaData) {
            return companyAreaData.map(key => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [companyAreaData])

    const { data } = useGetAllStockistsWithoutPaginationQuery({ company_name: Cookies.get('company_id'), company_area: mpoName.id === undefined ? "" : mpoName.id });

    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Stockist Name', key: 'stockist_name' },
        { label: 'Stockist Address', key: "stockist_address" },
        { label: 'Stockist Contact Number', key: 'stockist_contact_number' },
        { label: 'Stockist Category', key: 'stockist_category' },
        { label: 'Stockist PAN or VAT Number', key: 'pan_vat_number' },
        { label: 'Head Quarter', key: "area" }
    ];

    const templateData = useMemo(() => {
        return data?.map((values, index) => ({
            sno: index + 1,
            stockist_name: values?.stockist_name?.stockist_name,
            stockist_address: values?.stockist_name?.stockist_address,
            stockist_contact_number: values?.stockist_name?.stockist_contact_number,
            stockist_category: values?.stockist_name?.stockist_category,
            pan_vat_number: values?.stockist_name?.pan_vat_number,
            area: mpoName?.title || "Unknown",
        }));
    }, [data, mpoName]);

    const handleMPONameChange = (event, value) => {
        setMPOName(value)
    };

    return (
        <Box>
            <Box style={{ float: "right" }}>
                {data ?
                    <>
                        <Button color="success" variant="contained" startIcon={<Iconify icon="mdi:microsoft-excel" />} onClick={() => setIsDrawerOpen(true)}>Export</Button>
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
                            Export Stockist
                        </Typography>
                        <Box marginTop={3} marginBottom={3}>
                            <Autocomplete
                                options={companyArea}
                                getOptionLabel={(option) => option.title}
                                onChange={handleMPONameChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company Areas" />
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
                                    <ExportToExcel headers={headers} fileName={`${mpoName ? mpoName.title + ' ' + 'Stockist List' : 'All Stockist'}`} data={templateData} />
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

export default React.memo(ExportStockist);