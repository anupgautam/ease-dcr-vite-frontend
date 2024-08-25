import React, { useState, useEffect, useCallback, useContext } from 'react'
import {
    Box,
    Typography,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import Iconify from '../../../../components/iconify';
import {
    useSearchPrimarySalesCSVMutation,
} from '../../../../api/MPOSlices/PrimarySalesApiSlice';
import ExportToExcel from "@/reusable/utils/exportSheet";

import {
    useGetTourPlansWithoutPaginateQuery
} from '../../../../api/MPOSlices/TourPlanSlice'
import { CookieContext } from '@/App'


const ExcelCSVPrimarySales = ({ selectedOption }) => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    //! Month Format 
    // const [startMonth, setStartMonth] = useState();
    // const [selectedMonth, setMonthData] = useState();

    // const handleMonthChange = (date) => {
    //     setStartMonth(date)
    //     if (date) {
    //         const MonthData = date.toLocaleString('default', { month: "short" }).toLowerCase();
    //         setMonthData(MonthData)
    //     }
    // }

    //! Months
    const months = [
        { value: 'baisakh', label: 'Baisakh' },
        { value: 'jesth', label: 'Jestha' },
        { value: 'asadh', label: 'Asadh' },
        { value: 'shrawn', label: 'Shrawan' },
        { value: 'bhadra', label: 'Bhadra' },
        { value: 'ashwin', label: 'Ashwin' },
        { value: 'kartik', label: 'Kartik' },
        { value: 'mangsir', label: 'Mangsir' },
        { value: 'poush', label: 'Poush' },
        { value: 'magh', label: 'Magh' },
        { value: 'falgun', label: 'Falgun' },
        { value: 'chaitra', label: 'Chaitra' },
    ]

    const [selectedMonth, setSelectedMonth] = useState()

    const handleNepaliMonthChange = useCallback((event) => {
        setSelectedMonth(event.target.value);
        setCompanyId(company_id);
    }, []);

    //! Year
    const years = [
        { value: 2075, label: "2075" },
        { value: 2076, label: "2076" },
        { value: 2077, label: "2077" },
        { value: 2078, label: "2078" },
        { value: 2079, label: "2079" },
        { value: 2080, label: "2080" },
        { value: 2081, label: "2081" },
        { value: 2082, label: "2082" },
        { value: 2083, label: "2083" },
        { value: 2084, label: "2084" },
        { value: 2085, label: "2085" },
        { value: 2086, label: "2086" },
        { value: 2087, label: "2087" },
        { value: 2088, label: "2088" },
        { value: 2089, label: "2089" },
        { value: 2090, label: "2090" },
    ]
    const [dateData, setDateData] = useState('')
    const [selectedYear, setSelectedYear] = useState(2024);
    const [companyId, setCompanyId] = useState()

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        setCompanyId(company_id);
    };

    //! Search results
    const [searchPrimarySales, results] = useSearchPrimarySalesCSVMutation()

    //! onSearch
    const FilteredData = { companyId: companyId, selectedMonth: selectedMonth, dateData: selectedYear }

    useEffect(() => {
        if (selectedMonth || selectedYear) {
            searchPrimarySales(FilteredData)
                .then((res) => {
                })
        }
    }, [selectedMonth, selectedYear])

    const [MPOData, setMPOData] = useState()
    const { data } = useGetTourPlansWithoutPaginateQuery();

    useEffect(() => {
        if (data) {
            setMPOData(data)
        }
    }, [data]);


    const [duration, setDuration] = React.useState('');

    //! CSV Data 

    const headers = [
        { label: 'Product Name', key: 'product' },
        { label: 'Opening Stock', key: 'opening_stock' },
        { label: 'Purchase', key: 'purchase' },
        { label: 'Stockist', key: 'stockist' },
        { label: 'Year', key: 'year' },
        { label: 'Month', key: 'month' },
        { label: 'Sales Return', key: 'sales_return' },
        { label: 'Total', key: 'total' },
        { label: 'Sales', key: 'sales' },
        { label: 'Free', key: 'free' },
        { label: 'Exchange Breakage', key: 'exchange_breakage' },
        { label: 'L Rate', key: 'l_rate' },
        { label: 'Closing Stock', key: 'closing_stock' },
        { label: 'ST Value', key: 'st_value' },
        { label: 'SL Value', key: 'sl_value' },
        // { label: 'Last Name', key: 'details.lastName' },
        // { label: 'Job', key: 'job' },
    ];


    const templateData = results?.data?.map((values, index) => ({
        sno: index + 1,
        product: values?.product,
        opening_stock: values?.opening_stock,
        purchase: values?.purchase,
        stockist: values?.stockist,
        year: values?.year,
        month: values?.month,
        sales_return: values?.sales_return,
        total: values?.total,
        sales: values?.sales,
        free: values?.free,
        exchange_breakage: values?.exchange_breakage,
        l_rate: values?.l_rate,
        closing_stock: values?.closing_stock,
        st_value: values?.st_value,
        sl_value: values?.sl_value,
    }))

    const handleChange = (event) => {
        setDuration(event.target.value);
    };

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <Button color="success" variant="contained" startIcon={<Iconify icon="mdi:microsoft-excel" />} onClick={() => setIsDrawerOpen(true)} >
                Export Data
            </Button>
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
                            Export Data into Excel and CSV files
                        </Typography>

                    </Box>
                    <Box marginBottom={2}>
                        <FormControl fullWidth>
                            <InputLabel>Month</InputLabel>
                            <Select
                                value={selectedMonth}
                                onChange={handleNepaliMonthChange}
                                label="Month"
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box marginBottom={2}>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={selectedYear}
                                onChange={handleYearChange}
                                label="Year"
                            >
                                {years.map((year) => (
                                    <MenuItem key={year.value} value={year.value}>
                                        {year.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Stack spacing={1} direction="row">
                        {/* {results?.data &&
                            <>
                                <Box marginTop={2}>
                                    <Button
                                        variant="outlined"
                                        // className="cancel-button"
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        <CSVLink data={results?.data} headers={headers}>Download in Excel</CSVLink>
                                    </Button>
                                </Box>
                            </>
                        } */}
                        {results?.data ?
                            <>
                                <ExportToExcel headers={headers} fileName={`Doctors`} data={templateData} onClick={() => setIsDrawerOpen(false)} />
                            </> : <></>}

                    </Stack>
                </Box>
            </Drawer>
        </>
    )
}

export default React.memo(ExcelCSVPrimarySales);