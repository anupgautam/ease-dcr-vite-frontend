import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Card,
    Badge,
    Table,
    Paper,
    Button,
    TableRow,
    MenuItem,
    TextField,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Grid,
    Select,
    Autocomplete,
    InputLabel,
    FormControl, Stack
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SecondarySalesCount from './PrimarySalesCount';
import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
// import {
//     useSearchPrimarySalesMutation,
//     useDeletePrimarySalesByIdMutation
// } from '../../../../api/MPOSlices/SecondarySalesApiSlice';
// import {
//     useGetAllStockistsWithoutPaginationQuery,
// } from "../../../../api/MPOSlices/StockistSlice";
import { useGetStockistsWithoutPaginationQuery } from '@/api/MPOSlices/stockistApiSlice';
import ExcelCSVSecondarySales from './ExcelCSVPrimarySales';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useGetUsersByIdQuery } from "@/api/DemoUserSlice";
import { useSelector } from 'react-redux';
import DefaultList from './DefaultList';
import { useDeletePrimarySalesByIdMutation, useSearchPrimarySalesMutation } from '../../../../api/MPOSlices/PrimarySalesApiSlice';

const TABLE_HEAD = [
    { id: 'product', label: 'Product Name', alignRight: false },
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'quantity', label: 'Quantity', alignRight: false },
    { id: 'year', label: 'Year', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: '' },
];

const BS_MONTHS = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const PrimarySalesSearch = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [companyId, setCompanyId] = useState();

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const [searchResults, setSearchResults] = useState({ search: "" });

    //! Get Stockist
    const mpo_id = useSelector(state => state.dcrData.selected_user);

    const { data: mpoArea } = useGetUsersByIdQuery(mpo_id, {
        skip: !mpo_id
    });
    // const { Stockist } = useGetAllStockistsWithoutPaginationQuery({ company_name: company_id, company_area: mpoArea?.company_area?.id })
    const Stockist = useGetStockistsWithoutPaginationQuery(company_id);

    const rolesOptions = useMemo(() => {
        if (Stockist?.data) {
            return Stockist?.data?.map((key) => ({
                id: key.id,
                title: key.stockist_name.stockist_name
            }))
        }
        return [];
    }, [Stockist])

    //! Options
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = useCallback((event, value) => {
        setSelectedOption(value?.id || "");
        setCompanyId(company_id)
    }, []);

    // const handleOptionChange = useCallback((event, value) => {
    //     setSelectedOption(value?.id);
    //     setCompanyId(company_id)
    // }, []);


    //! Search results
    const [searchSecondarySales, results] = useSearchPrimarySalesMutation()


    const [mpoName, setMPOName] = useState('');

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    const now = new BSDate().now();

    const monthNumber = now._date.month;
    const month = BS_MONTHS[monthNumber - 1];
    const year = now._date.year;

    //! Months
    const months = [
        { value: 'Baisakh', label: 'Baisakh' },
        { value: 'Jesth', label: 'Jestha' },
        { value: 'Asadh', label: 'Asadh' },
        { value: 'Shrawan', label: 'Shrawan' },
        { value: 'Bhadra', label: 'Bhadra' },
        { value: 'Ashwin', label: 'Ashwin' },
        { value: 'Kartik', label: 'Kartik' },
        { value: 'Mangsir', label: 'Mangsir' },
        { value: 'Poush', label: 'Poush' },
        { value: 'Magh', label: 'Magh' },
        { value: 'Falgun', label: 'Falgun' },
        { value: 'Chaitra', label: 'Chaitra' },
    ]

    // const months = [
    //     { value: 1, label: "Baisakh" },
    //     { value: 2, label: "Jestha" },
    //     { value: 3, label: "Asadh" },
    //     { value: 4, label: "Shrawan" },
    //     { value: 5, label: "Bhadra" },
    //     { value: 6, label: "Ashwin" },
    //     { value: 7, label: "Kartik" },
    //     { value: 8, label: "Mangsir" },
    //     { value: 9, label: "Poush" },
    //     { value: 10, label: "Magh" },
    //     { value: 11, label: "Falgun" },
    //     { value: 12, label: "Chaitra" }
    // ];

    const [selectedMonth, setSelectedMonth] = useState(month)

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
    const [selectedYear, setSelectedYear] = useState(year);

    const handleYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
        setCompanyId(company_id);
    }, []);

    //! onSearch
    const FilteredData = { companyId: company_id, selectedOption: selectedOption, selectedMonth: selectedMonth, dateData: selectedYear }

    useEffect(() => {
        if (selectedOption || selectedMonth || selectedYear) {
            searchSecondarySales(FilteredData, {
                skip: !selectedOption || !company_id || !selectedYear || !selectedMonth
            })
                .then((res) => {
                })
        }
    }, [selectedOption, selectedMonth, selectedYear])

    // !Delete chemists
    const [deleteSecondarySales] = useDeletePrimarySalesByIdMutation()

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true)
    }, [])

    const handleClose = useCallback(() => {
        setOpenDialogue(false)
    }, [])

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '20px' }}>
                    <Grid container spacing={2} justifyContent="flex-end">
                        <Grid item xs={12} md={12}>
                            <Stack
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                <ExcelCSVSecondarySales selectedOption={selectedOption} />
                                {/* {selectedOption && selectedMonth && selectedYear && ( */}
                                {/* <AddSecondarySales
                                    selectedOption={selectedOption}
                                    selectedMonth={selectedMonth}
                                    selectedYear={selectedYear}
                                /> */}
                                {/* )} */}
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>

                <Card>
                    <Box style={{ padding: "20px" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <Autocomplete
                                    options={rolesOptions}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleOptionChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Stockist" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={2}>
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
                            </Grid>
                            <Grid item xs={2}>
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
                            </Grid>
                        </Grid>
                    </Box>

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    headLabel={TABLE_HEAD}
                                />
                                <TableBody>
                                    {(!selectedOption || !selectedMonth || !selectedYear) ?
                                        <DefaultList />
                                        :
                                        <>
                                            {
                                                results && results?.data?.length == 0 ?
                                                    <>
                                                        <TableRow>
                                                            <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                                                <Paper
                                                                    sx={{
                                                                        textAlign: 'center',
                                                                    }}
                                                                >
                                                                    <Typography variant="h6" paragraph>
                                                                        Not found
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        <strong>Requested Data Not found</strong>.
                                                                        <br /> Try checking for typos or using complete words.
                                                                    </Typography>
                                                                </Paper>
                                                            </TableCell>
                                                        </TableRow>
                                                    </> :
                                                    <>
                                                        {
                                                            results?.data && results?.data?.map((secondarysales, index) => (
                                                                <TableRow hover tabIndex={-1} key={secondarysales.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell TableCell component="th" scope="row" align="left">
                                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {secondarysales.product_id.product_name.product_name}
                                                                        </Typography>
                                                                        {/* </Stack> */}
                                                                    </TableCell>
                                                                    <TableCell align="left">{secondarysales.stockist_name.stockist_name.stockist_name}</TableCell>
                                                                    <TableCell align="left">{secondarysales.quantity}</TableCell>
                                                                    <TableCell align="left">{secondarysales.year}</TableCell>
                                                                    <TableCell align="left">{secondarysales.month}</TableCell>

                                                                    <TableCell align="left">
                                                                        {/* //! Edit  */}
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => {
                                                                            onEdit(secondarysales.id)
                                                                        }}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                        {/* //! Delete  */}
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(secondarysales.id); handleClickOpen() }}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:trash-2-outline" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <Dialog
                                                                        fullScreen={fullScreen}
                                                                        open={openDialogue}
                                                                        onClose={handleClose}
                                                                        aria-labelledby="responsive-dialog-title"
                                                                    >
                                                                        <DialogTitle id="responsive-dialog-title">
                                                                            {"Are you sure want to delete?"}
                                                                        </DialogTitle>
                                                                        <DialogActions>
                                                                            <Button autoFocus onClick={() => { deleteSecondarySales(selectedId); handleClose() }}>
                                                                                Yes
                                                                            </Button>
                                                                            <Button
                                                                                onClick={handleClose}
                                                                                autoFocus>
                                                                                No
                                                                            </Button>
                                                                        </DialogActions>
                                                                    </Dialog>
                                                                </TableRow>
                                                            ))
                                                        }
                                                    </>
                                            }
                                        </>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {isDrawerOpen && <EditSecondarySales
                            idharu={selectedUpdateId} selectedOption={selectedOption} selectedMonth={selectedMonth} selectedYear={selectedYear} onClose={onCloseDrawer}
                        />
                        }
                    </Scrollbar>
                </Card>
            </Container>
        </>
    );
}

export default React.memo(PrimarySalesSearch);