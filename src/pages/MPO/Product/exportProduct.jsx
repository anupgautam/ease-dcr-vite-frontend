import { Close } from "@mui/icons-material";
import { Autocomplete, Box, Button, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useGetFilteredDivisionsQuery } from "@/api/DivisionSilces/companyDivisionSlice";
import { useGetProductsByDivisionWithoutPaginationQuery } from "@/api/MPOSlices/ProductSlice";
import ExportToExcel from "@/reusable/utils/exportSheet";
import { useSelector } from 'react-redux';

const ExportProduct = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [mpoName, setMPOName] = useState('');
    const companyArea = [];
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);


    const { data: companyAreaData } = useGetFilteredDivisionsQuery(company_id)


    if (companyAreaData) {
        companyAreaData.map((key) => {
            companyArea.push({
                id: key.id,
                title: key.division_name
            })
        })
    }

    const { data } = useGetProductsByDivisionWithoutPaginationQuery({ company_name: company_id, division_name: mpoName.id === undefined ? "" : mpoName.id })



    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Product Name', key: 'product_name' },
        { label: 'Product Type', key: "product_type" },
        { label: 'Product Molecular Name', key: 'product_molecular_name' },
        { label: 'Price per strip', key: 'product_price_per_strip_in_mrp' },
        { label: 'Price for Stockist', key: 'product_price_for_stockist' },
        { label: 'Product Description', key: 'product_description' },
        { label: 'Bonus', key: 'bonus' },
        { label: 'Division', key: "division" }
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        product_name: values?.product_name?.product_name,
        product_type: values?.product_type,
        product_molecular_name: values?.product_name?.product_molecular_name,
        product_price_per_strip_in_mrp: values?.product_name?.product_price_per_strip_in_mrp,
        product_price_for_stockist: values?.product_name?.product_price_for_stockist,
        product_description: values?.product_name?.product_description,
        bonus: values?.bonus,
        division: values?.division_name?.division_name,
    }))

    const handleMPONameChange = (event, value) => {
        setMPOName(value)
    };
    return (
        <Box>
            <Box style={{ float: "right" }}>
                {data ?
                    <>
                        <ExportToExcel headers={headers} fileName={`Products`} data={templateData} />
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
                                options={companyArea}
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
                                    <ExportToExcel headers={headers} fileName={`${mpoName ? mpoName.title + ' ' + 'Product List' : 'All Product'}`} data={templateData} /> : <></>
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

export default React.memo(ExportProduct);