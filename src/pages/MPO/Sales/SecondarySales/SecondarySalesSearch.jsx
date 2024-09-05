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
import EditSecondarySales from './EditSecondarySales'
import AddSecondarySales from './AddSecondarySales';
import SecondarySalesCount from './SecondarySalesCount';
import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import {
    useSearchSecondarySalesMutation,
    useDeleteSecondarySalesByIdMutation
} from '../../../../api/MPOSlices/SecondarySalesApiSlice';
// import {
//     useGetAllStockistsWithoutPaginationQuery,
// } from "../../../../api/MPOSlices/StockistSlice";
import { useGetStockistsWithoutPaginationQuery } from '@/api/MPOSlices/stockistApiSlice';
import ExcelCSVSecondarySales from './ExcelCSVSecondarySales';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useGetUsersByIdQuery } from "@/api/DemoUserSlice";
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'product', label: 'Product Name', alignRight: false },
    { id: 'stockist', label: 'Stockist Name', alignRight: false },
    { id: 'purchase', label: 'Purchase', alignRight: false },
    { id: 'year', label: 'Year', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'sales_return', label: 'Sales Return', alignRight: false },
    { id: 'total', label: 'Total', alignRight: false },
    { id: 'expiry_breakage', label: 'Ex/Br', alignRight: false },
    { id: 'closing_stock', label: 'Cl.St.', alignRight: false },
    { id: 'l_rate', label: 'L.Rate', alignRight: false },
    { id: 'st_value', label: 'St.Value', alignRight: false },
    { id: 'sl_value', label: 'Sl.Value', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

const SecondarySalesSearch = () => {
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
    const [searchSecondarySales, results] = useSearchSecondarySalesMutation()


    const [mpoName, setMPOName] = useState('');

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

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

    const [selectedMonth, setSelectedMonth] = useState(monthData)

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
    const [selectedYear, setSelectedYear] = useState(yearData);

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
    const [deleteSecondarySales] = useDeleteSecondarySalesByIdMutation()

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
                                <Box>
                                    <ExcelCSVSecondarySales selectedOption={selectedOption} />
                                </Box>
                                {selectedOption && selectedMonth && selectedYear && (
                                    <Box>
                                        <AddSecondarySales
                                            selectedOption={selectedOption}
                                            selectedMonth={selectedMonth}
                                            selectedYear={selectedYear}
                                        />
                                    </Box>
                                )}
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
                        <TableContainer sx={{ minWidth: 1800 }}>
                            <Table>
                                <UserListHead
                                    headLabel={TABLE_HEAD}
                                />
                                <TableBody>
                                    {(!selectedOption && !selectedMonth && !selectedYear) ?
                                        <TableRow>
                                            <TableCell align="center" colSpan={12} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {/* <Typography variant="h6" paragraph>
                                                    Select stockist, month and year to view data
                                                </Typography> */}
                                                    <Typography variant="body2">
                                                        <strong>Requested Data Not found</strong>.
                                                        <br /> Select stockist, month and year to view data
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow> :
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
                                                                            {secondarysales.product}
                                                                        </Typography>
                                                                        {/* </Stack> */}
                                                                    </TableCell>
                                                                    <TableCell align="left">{secondarysales.opening_stock}</TableCell>
                                                                    <TableCell align="left">{secondarysales.purchase}</TableCell>
                                                                    <TableCell align="left">{secondarysales.stockist}</TableCell>
                                                                    <TableCell align="left">{secondarysales.year}</TableCell>
                                                                    <TableCell align="left">{secondarysales.month}</TableCell>
                                                                    <TableCell align="left">{secondarysales.sales_return}</TableCell>
                                                                    <TableCell align="left">{secondarysales.total}</TableCell>
                                                                    <TableCell align="left">{secondarysales.sales}</TableCell>
                                                                    <TableCell align="left">{secondarysales.free}</TableCell>
                                                                    <TableCell align="left">{secondarysales.exchange_breakage}</TableCell>
                                                                    <TableCell align="left">{secondarysales.l_rate}</TableCell>
                                                                    <TableCell align="left">{secondarysales.st_value}</TableCell>
                                                                    <TableCell align="left">{secondarysales.sl_value}</TableCell>
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

export default React.memo(SecondarySalesSearch);