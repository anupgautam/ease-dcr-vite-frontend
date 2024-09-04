import { Box } from "@mui/material";
import React from "react";
import ExportToExcel from "@/reusable/utils/exportSheet";
import { useSelector } from 'react-redux';
import {
    useSearchHODCRQuery
} from '@/api/HighOrderSlices/hoDCRSlice';


const ExportHODCR = ({ selectedUser, selectedMonth, selectedDate }) => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    //! onSearch
    const FilteredData = { user_id: user_role === 'admin' ? selectedUser : company_user_role_id, month: selectedMonth, date: selectedDate, company_name: company_id }

    //! Search Results 
    const results = useSearchHODCRQuery(FilteredData, {
        skip: !user_role || !company_id || !selectedDate || !selectedMonth || !company_user_role_id || !selectedUser
    });

    const headers = [

        { label: 'S.No.', key: 'sno' },
        { label: 'User Name', key: 'mpo_name' },
        { label: 'Shift', key: "shift" },
        { label: 'Date', key: 'date' },
        { label: 'Visited With', key: 'visited_with' },
        // { label: 'Doctor NMC Number', key: 'doctor_nmc_number' },
        // { label: 'Doctor Qualification', key: 'doctor_qualification' },
        // { label: 'User', key: "user" },
        // { label: 'Is Invested', key: "is_invested" }
    ];

    const templateData = results?.data?.results?.map((values, index) => ({
        sno: index + 1,
        mpo_name: values?.user_id.user_name.first_name + " " + values?.user_id.user_name.last_name,
        shift: values?.shift?.shift,
        date: values?.date,
        // area_name: values?.dcr?.dcr?.visited_area?.area_name,
        visited_with: values?.visited_with.user_name.first_name + " " + values?.visited_with.user_name.last_name,
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
                        <ExportToExcel headers={headers} fileName={`Export HO  DCR`} data={templateData} />
                    </> : <></>}
            </Box>
        </Box >
    )
}

export default React.memo(ExportHODCR);