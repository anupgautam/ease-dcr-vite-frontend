import React, { useState } from 'react';
import {
    Card,
    Box,
} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import { useDispatch } from 'react-redux';
import SelectDataDCR from '../DCR/SelectDataDCR';
import { useSelector } from 'react-redux';
import FilteredTarget from './FilteredTarget';
import TargetSearch from './TargetSearch';


const ListViewChart = () => {
    const dispatch = useDispatch();
    const yearList = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032', '2033']
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const roles = useSelector(state => state.dcrData.company_roles)

    const theme = useTheme();
    return (
        <>
            <SelectDataDCR />
            <Card>
                <Box style={{ padding: "20px" }}>

                </Box>
                {selectedYear || selectedRole ?
                    <FilteredTarget /> :
                    <TargetSearch />}

            </Card>
        </>
    )
}

export default React.memo(ListViewChart);