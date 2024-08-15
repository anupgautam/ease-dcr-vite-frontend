import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
// @mui
import {
    Card,
    Badge,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TextField,
    TableBody,
    InputAdornment,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Pagination,
    Box,
    Grid,
    Select,
    Autocomplete,
    InputLabel,
    FormControl
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { Search } from '@mui/icons-material';
import { Clear } from '@mui/icons-material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DefaultList from './DefaultList';
import SearchIcon from '@mui/icons-material/Search';
import Test from './DefaultList';
import Cookies from 'js-cookie'
import EditPrimarySales from './EditPrimarySales'
import AddPrimarySales from './AddPrimarySales';
import PrimarySalesCount from './PrimarySalesCount';
import DatePicker from 'react-datepicker';
// components
import Iconify from '@/components/iconify/Iconify';
import Label from '@/components/iconify/Iconify';
// sections
import { UserListHead, UserListToolbar } from '../../../../sections/@dashboard/user';
// mock
import USERLIST from '../../../../_mock/user';

import Controls from '../../../../reusable/components/forms/controls/Controls'
import { useForm1 } from '../../../../reusable/components/forms/useForm';

import {
    useGetAllPrimarySalesQuery,
    useSearchPrimarySalesMutation,
    useDeletePrimarySalesByIdMutation
} from '../../../../api/MPOSlices/PrimarySalesApiSlice';
import {
    useGetAllStockistsWithoutPaginationQuery,
} from "../../../../api/MPOSlices/StockistSlice";
import { useGetUsersByCompanyUserByIdQuery } from "@/api/MPOSlices/UserSlice";
import { eventProviderSlice } from '@/api/newChatSlices/eventSlices';
import { yearsToMonths } from 'date-fns/fp';
import ExcelCSVPrimarySales from './ExcelCSVPrimarySales';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import Scrollbar from '@/components/scrollbar/Scrollbar';

const TABLE_HEAD = [
    { id: 'product_name', label: 'Product Name', alignRight: false },
    { id: 'opening_stock', label: 'Op.St.', alignRight: false },
    { id: 'purchase', label: 'Purchase', alignRight: false },
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'year', label: 'Year', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'sales_return', label: 'Sales Return', alignRight: false },
    { id: 'total', label: 'Total', alignRight: false },
    { id: 'sales', label: 'Sales', alignRight: false },
    { id: 'free', label: 'Free', alignRight: false },
    { id: 'expiry_breakage', label: 'Ex/Br', alignRight: false },
    { id: 'closing_stock', label: 'Cl.St.', alignRight: false },
    { id: 'l_rate', label: 'L.Rate', alignRight: false },
    { id: 'st_value', label: 'St.Value', alignRight: false },
    { id: 'sl_value', label: 'Sl.Value', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

const PrimarySalesSearch = () => {

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

    const companyUserArea = useGetUsersByCompanyUserByIdQuery(Cookies.get('company_user_id'));

    const Stockist = useGetAllStockistsWithoutPaginationQuery({ company_name: Cookies.get('company_id'), company_area: companyUserArea?.data?.company_area?.company_area });

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
        setCompanyId(Cookies.get("company_id"))
    }, []);

    // const handleOptionChange = useCallback((event, value) => {
    //     setSelectedOption(value.id === null ? "" : value.id);
    //     setCompanyId(Cookies.get("company_id"))
    // }, []);


    //! Search results
    const [searchPrimarySales, results] = useSearchPrimarySalesMutation()

    const [mpoName, setMPOName] = useState('');

    const handleInputMPOChange = useCallback((event) => {
        const { name, value } = event.target;

        setMPOName(event.target.value)
    }, []);

    const now = new BSDate().now();

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;


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
        setCompanyId(Cookies.get('company_id'));
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
    const [selectedYear, setSelectedYear] = useState(yearData);

    const handleYearChange = useCallback((event) => {
        setSelectedYear(event.target.value);
        setCompanyId(Cookies.get('company_id'));
    }, []);

    //! onSearch
    const FilteredData = { companyId: companyId, selectedOption: selectedOption, selectedMonth: selectedMonth, dateData: selectedYear }

    useEffect(() => {
        if (selectedOption || selectedMonth || selectedYear) {
            searchPrimarySales(FilteredData)
                .then((res) => {
                })
        }
    }, [selectedOption, selectedMonth, selectedYear])

    // !Delete chemists
    const [deletePrimarySales] = useDeletePrimarySalesByIdMutation()

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
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <PrimarySalesCount />
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: "right" }}>
                                <ExcelCSVPrimarySales selectedOption={selectedOption} />
                            </Box>
                        </Grid>

                        {(selectedOption && selectedMonth && selectedYear) ?
                            <>
                                <Grid item xs={2}>
                                    <Box>
                                        <AddPrimarySales selectedOption={selectedOption} selectedMonth={selectedMonth} selectedYear={selectedYear} />
                                    </Box>
                                </Grid>
                            </> : <></>
                        }
                    </Grid>
                </Box>

                <Card>
                    <Box style={{ padding: "20px" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <FormControl>
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
                                </FormControl>
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
                                                            results?.data && results?.data?.map((primarysales, index) => (
                                                                <TableRow hover tabIndex={-1} key={primarysales.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell TableCell component="th" scope="row" align="left">
                                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {primarysales.product}
                                                                        </Typography>
                                                                        {/* </Stack> */}
                                                                    </TableCell>
                                                                    <TableCell align="left">{primarysales.opening_stock}</TableCell>
                                                                    <TableCell align="left">{primarysales.purchase}</TableCell>
                                                                    <TableCell align="left">{primarysales.stockist}</TableCell>
                                                                    <TableCell align="left">{primarysales.year}</TableCell>
                                                                    <TableCell align="left">{primarysales.month}</TableCell>
                                                                    <TableCell align="left">{primarysales.sales_return}</TableCell>
                                                                    <TableCell align="left">{primarysales.total}</TableCell>
                                                                    <TableCell align="left">{primarysales.sales}</TableCell>
                                                                    <TableCell align="left">{primarysales.free}</TableCell>
                                                                    <TableCell align="left">{primarysales.exchange_breakage}</TableCell>
                                                                    <TableCell align="left">{primarysales.l_rate}</TableCell>
                                                                    <TableCell align="left">{primarysales.st_value}</TableCell>
                                                                    <TableCell align="left">{primarysales.sl_value}</TableCell>
                                                                    <TableCell align="left">
                                                                        {/* //! Edit  */}
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => {
                                                                            onEdit(primarysales.id)
                                                                        }}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                        {/* //! Delete  */}
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(primarysales.id); handleClickOpen() }}>
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
                                                                            <Button autoFocus onClick={() => { deletePrimarySales(selectedId); handleClose() }}>
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
                        {isDrawerOpen && <EditPrimarySales
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