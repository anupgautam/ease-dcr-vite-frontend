import { Close } from "@mui/icons-material";
import { Autocomplete, Box, Button, Drawer, IconButton, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import { usePostAllMPONamesNoPageMutation } from "@/api/MPOSlices/DoctorSlice";
import { useGetAllVisitedMpoWiseDoctorQuery } from "@/api/MPOSlices/doctorApiSlice";
import ExportToExcel from "@/reusable/utils/exportSheet";
import { useSelector } from 'react-redux';
import {
    useSearchStockistsDCRQuery
} from '../../../api/DCRs Api Slice/stockistDCR/StockistDCRSlice';


const ExportChemistDCR = ({ selectedUser, selectedMonth, selectedDate, dateOnly }) => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    //! onSearch
    const FilteredData = { company_name: company_id, user_id: user_role === "admin" ? selectedUser : company_user_role_id, month: selectedMonth, date: selectedDate }

    //! Search Results 
    const results = useSearchStockistsDCRQuery(FilteredData);

    const headers = [

        { label: 'S.No.', key: 'sno' },
        { label: 'MPO Name', key: 'mpo_name' },
        { label: 'Shift', key: "shift" },
        { label: 'Date', key: 'date' },
        // { label: 'Area Name', key: 'area_name' },
        { label: 'Stockist Name', key: 'stockist_name' },
        // { label: 'Doctor NMC Number', key: 'doctor_nmc_number' },
        // { label: 'Doctor Qualification', key: 'doctor_qualification' },
        // { label: 'User', key: "user" },
        // { label: 'Is Invested', key: "is_invested" }
    ];

    const templateData = results?.data?.results?.map((values, index) => ({
        sno: index + 1,
        mpo_name: values?.mpo_name.user_name.first_name + " " + values?.mpo_name.user_name.last_name,
        shift: values?.dcr?.shift?.shift,
        date: values?.dcr?.dcr?.date,
        area_name: values?.dcr?.dcr?.visited_area?.area_name,
        stockist_name: values?.dcr?.dcr?.visited_stockist?.stockist_name?.stockist_name,
        // doctor_nmc_number: values?.doctor_name?.doctor_nmc_number,
        // doctor_qualification: values?.doctor_name?.doctor_qualification,
        // user: mpoName?.title,
        // is_invested: values?.doctor_name?.is_investment === true ? 'Is Invested' : 'Not Invested'
    }))

    return (
        <Box>
            <Box>
                {results?.data ?
                    <>
                        <ExportToExcel headers={headers} fileName={`Export Stockist DCR`} data={templateData} />
                    </> : <></>}
            </Box>
        </Box >
    )
}

export default React.memo(ExportChemistDCR);