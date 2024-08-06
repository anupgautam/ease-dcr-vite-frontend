import { debounce } from 'lodash';
import React, { useState, useMemo, useCallback } from 'react';
import {
    Card,
    Badge,
    Table,
    Paper,
    Button,
    TableRow,
    TextField,
    TableBody,
    InputAdornment,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Grid,
    Autocomplete
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import { useForm1 } from '../../../reusable/components/forms/useForm';
import {
    useDeleteDoctorsByIdMutation,
} from '../../../api/MPOSlices/DoctorSlice';
import { useGetHolidayAreasQuery, useSearchHolidayAreasMutation } from '@/api/HolidaySlices/holidaySlices';
import SearchIcon from '@mui/icons-material/Search';
import Cookies from 'js-cookie'
import Scrollbar from '@/components/scrollbar/Scrollbar';
import EditHolidayArea from './EditHolidayArea';

const TABLE_HEAD = [
    { id: 'holiday_type', label: 'Holiday Type', alignRight: false },
    { id: 'company_area', label: 'Company Area', alignRight: false },
    { id: '' },
];

const FilterHolidayArea = () => {

    //! Company Area
    const Areas = useGetHolidayAreasQuery(Cookies.get("company_id"));

    const areas = useMemo(() => {
        if (Areas.data) {
            return Areas.data.map((key) => ({ id: key.id, title: key.company_area }))
        }
        return [];
    }, [Areas])

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [page, setPage] = useState(1);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const onEdit = useCallback((id, divisionId) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //!Pagination logic


    // ! Get all users wala

    const [SearchData, setSearchData] = useState([]);

    const [SearchDataCondition, setSearchDataCondition] = useState(false);

    const [SearchHolidayAreas] = useSearchHolidayAreasMutation();

    const onSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery === '') {
            setSearchDataCondition(false);
            setSearchData([]);
        } else {
            SearchHolidayAreas({ holiday_type: searchQuery, company_id: Cookies.get('company_id'), company_area: holidayArea })
                .then((res) => {
                    setSearchDataCondition(true);
                    if (res.data) {
                        setSearchData(res.data);
                    }
                })
                .catch((err) => {
                })
        }
    }

    const [holidayType, setHolidayType] = useState('')
    const [holidayArea, setHolidayArea] = useState()
    const handleHolidayAreaChange = useCallback((event, value) => {
        setHolidayArea(value?.id)
        setCompanyId(Cookies.get('company_id'));
    }, []);


    const initialFValues = {
        "search": " "
    }

    const {
        values,
        handleSearchClick,
    } = useForm1(initialFValues, true);

    // !Delete doctors
    const [deleteDoctor] = useDeleteDoctorsByIdMutation()

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

    const debouncedSearch = debounce(onSearch, 300);


    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <TextField
                                label="Search Holiday Type"
                                variant="outlined"
                                onChange={(e) => debouncedSearch(e)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                style={{ padding: '30px' }}
                                sx={{ m: 2 }}
                            />
                        </Grid>
                        <Grid item xs={2.5}>
                            <Autocomplete
                                options={areas}
                                getOptionLabel={(option) => option.title}
                                onChange={handleHolidayAreaChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Company Areas" />
                                )}
                                renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                            />
                        </Grid>
                    </Grid>
                </Box>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 900 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                {
                                    SearchDataCondition === true ?
                                        <>
                                            {
                                                SearchData.length === 0 ?
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
                                                    </TableRow> :
                                                    <>
                                                        {
                                                            SearchData.map((doctorsearch, index) => (
                                                                <TableRow hover tabIndex={-1} key={doctorsearch.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell TableCell component="th" scope="row" align="left">
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {doctorsearch.doctor_name.doctor_name}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">{doctorsearch.doctor_name.doctor_phone_number}</TableCell>
                                                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorsearch.id); handleClickOpen() }}>
                                                                        <Badge>
                                                                            <Iconify icon="eva:trash-2-outline" />
                                                                        </Badge>
                                                                    </IconButton>
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
                                                                            <Button autoFocus onClick={() => { deleteDoctor(selectedId); handleClose() }}>
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
                                        </> :
                                        <>
                                            {/* {searchQuery === "" && holidayArea === "" ?
                                                <DefaultHolidayArea /> :
                                                <>
                                                    {
                                                        DoctorData !== undefined ?
                                                            <>
                                                                {
                                                                    DoctorData.count === 0 ?
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
                                                                        </TableRow> : <>
                                                                            {
                                                                                DoctorData.results.map((doctorsearch, index) => (
                                                                                    <TableRow hover tabIndex={-1} key={doctorsearch.id}>
                                                                                        <TableCell>{index + 1}</TableCell>
                                                                                        <TableCell TableCell component="th" scope="row" align="left">
                                                                                            <Typography variant="subtitle2" noWrap>
                                                                                                {doctorsearch.doctor_name.doctor_name}
                                                                                            </Typography>
                                                                                        </TableCell>
                                                                                        <TableCell align="left">{doctorsearch.doctor_name.doctor_phone_number}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch.doctor_name.doctor_address}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch.doctor_name.doctor_qualification}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch.doctor_name.doctor_category}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch.is_investment === true ? "Invested" : "Not Invested"}</TableCell>

                                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorsearch.id); handleClickOpen() }}>
                                                                                            <Badge>
                                                                                                <Iconify icon="eva:trash-2-outline" />
                                                                                            </Badge>
                                                                                        </IconButton>
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
                                                                                                <Button autoFocus onClick={() => { deleteDoctor(selectedId); handleClose() }}>
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
                                                                            <TableCell colSpan={6}>
                                                                                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                                                                    {DoctorData ? (
                                                                                        <Pagination count={parseInt(DoctorData.count / 200) + 1} onChange={handleChangePage} />
                                                                                    ) : (
                                                                                        <Typography variant="body1">In Search</Typography>
                                                                                    )}
                                                                                </Box>
                                                                            </TableCell>
                                                                        </>
                                                                }
                                                            </> : null
                                                    }
                                                </>
                                            } */}
                                        </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isDrawerOpen && <EditHolidayArea
                        id={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }
                </Scrollbar>
            </Card>
        </>
    );
}

export default React.memo(FilterHolidayArea);