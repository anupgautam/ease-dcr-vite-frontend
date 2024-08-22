import { debounce, parseInt } from 'lodash';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
    Pagination,
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
    useSearchDoctorsMutation,
    useDeleteDoctorsByIdMutation,
    useGetAllMPOAreasNoPageQuery,
    usePostAllMPONamesNoPageMutation,
    useGetAllDoctorByMpoAndMpoAreaQuery
} from '../../../api/MPOSlices/DoctorSlice';
import SearchIcon from '@mui/icons-material/Search';
import Test from './DefaultList';
import EditDoctor from './EditDoctor';
import Cookies from 'js-cookie'
import Scrollbar from '@/components/scrollbar/Scrollbar';


const TABLE_HEAD = [
    { id: 'doctor_name', label: 'Dr. Name', alignRight: false },
    { id: 'doctor_phone_number', label: 'Number', alignRight: false },
    { id: 'doctor_address', label: 'Address', alignRight: false },
    { id: 'doctor_qualification', label: 'Qualification', alignRight: false },
    { id: 'doctor_specialization', label: 'Specialization', alignRight: false },
    { id: 'doctor_category', label: 'Category', alignRight: false },
    { id: '' },
];

const DoctorSearch = () => {
    //! Get MPO Names
    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList.map(key => ({ id: key.id, title: key.user_name.first_name + ' ' + key.user_name.last_name }))
        }
        return [];
    }, [MpoList])

    useEffect(() => {
        if (Cookies.get('company_id')) {
            MpoData({ company_name: Cookies.get('company_id') })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [Cookies.get('company_id')])

    //! MPO Area
    const MPO_Area = useGetAllMPOAreasNoPageQuery({ id: Cookies.get('company_id'), mpo_name: Cookies.get('user_role') === 'admin' ? mpoName : Cookies.get('company_user_id') })

    const [mpoArea, setMPOArea] = useState('')

    const mpoAreas = useMemo(() => {
        if (MPO_Area?.data) {
            return MPO_Area.data.map(key => ({ id: key.id, title: key.area_name }));
        }
        return [];
    }, [MPO_Area]);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [selectedDivisionId, setSelectedDivisionId] = useState(null);

    const onEdit = useCallback((id, divisionId) => {
        setSelectedUpdateId(id);
        setSelectedDivisionId(divisionId);
        setIsDrawerOpen(true);
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

    //! Options
    const [companyId, setCompanyId] = useState();

    const handleOptionChange = useCallback((event, value) => {
        setCompanyId(Cookies.get('company_id'));
        setMPOArea(value?.id || "")
    }, [])

    const handleMPONameChange = useCallback((event, value) => {
        setMPOName(value?.id || "")
        setCompanyId(Cookies.get('company_id'));
    }, [])

    //! Pagination Logic
    const [page, setPage] = useState(1);

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Search Logic
    const { data: DoctorData } = useGetAllDoctorByMpoAndMpoAreaQuery({ company_name: Cookies.get('company_id'), mpo_area: mpoArea, mpo_name: Cookies.get('user_role') === 'admin' ? mpoName : Cookies.get('company_user_id'), page: page })

    const [SearchData, setSearchData] = useState([]);
    const [SearchDataCondition, setSearchDataCondition] = useState(false);

    const [SearchDoctor] = useSearchDoctorsMutation();

    const onSearch = (e) => {
        const searchQuery = e.target.value;

        // if (!mpoName) {
        //     setSearchDataCondition(false);
        //     setSearchData([]);
        //     return;
        // }

        if (searchQuery === '') {
            setSearchDataCondition(false);
            setSearchData([]);
        } else {
            SearchDoctor({ search: searchQuery, company_id: parseInt(Cookies.get('company_id')) })
                .then((res) => {
                    setSearchDataCondition(true);
                    if (res.data) {
                        setSearchData(res.data);
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    const initialFValues = {
        "search": " "
    }

    const {
        values,
        handleSearchClick,
    } = useForm1(initialFValues, true);

    //! onSearch
    const FilteredData = { mpo_area: mpoArea, mpo_name: mpoName, companyId: companyId, }


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
                    {
                        Cookies.get('user_role') === 'admin' &&
                        <Grid container spacing={2}>
                            <Grid item xs={5.5} sm={3}>
                                <TextField
                                    label="Search Doctor"
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
                            <Grid item xs={5} sm={3}>
                                <Autocomplete
                                    options={mpoNames}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleMPONameChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="MPO Name" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </Grid>
                            {mpoName &&
                                <Grid item xs={3} >
                                    <Autocomplete
                                        options={mpoAreas}
                                        getOptionLabel={(option) => option.title}
                                        onChange={handleOptionChange}
                                        renderInput={(params) => (
                                            <TextField {...params} label="MPO Area" />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                {option.title}
                                            </li>
                                        )}
                                    />
                                </Grid>
                            }
                        </Grid>
                    }
                </Box>

                <Scrollbar>
                    <TableContainer sx={{ minWidth: 900 }}>
                        <Table>
                            <UserListHead headLabel={TABLE_HEAD} />
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
                                                            SearchData?.map((doctorsearch, index) => (
                                                                <TableRow hover tabIndex={-1} key={doctorsearch?.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell component="th" scope="row" align="left">
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {doctorsearch?.doctor_name.doctor_name}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_address}</TableCell>
                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_phone_number}</TableCell>
                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_qualification}</TableCell>
                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_specialization?.category_name}</TableCell>
                                                                    <TableCell align="left">{doctorsearch?.doctor_name?.doctor_category}</TableCell>
                                                                    <TableCell align="left">
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorsearch?.id); handleClickOpen() }}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:trash-2-outline" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        }
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
                                                    </>
                                            }
                                        </> :
                                        <>
                                            {mpoName === "" || !mpoName ?
                                                <Test /> :
                                                <>
                                                    {
                                                        DoctorData !== undefined ?
                                                            <>
                                                                {
                                                                    DoctorData?.count === 0 ?
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
                                                                                DoctorData?.results.map((doctorsearch, index) => (
                                                                                    <TableRow hover tabIndex={-1} key={doctorsearch?.id}>
                                                                                        <TableCell>{index + 1}</TableCell>
                                                                                        <TableCell component="th" scope="row" align="left">
                                                                                            <Typography variant="subtitle2" noWrap>
                                                                                                {doctorsearch?.doctor_name?.doctor_name}
                                                                                            </Typography>
                                                                                        </TableCell>
                                                                                        <TableCell align="left">{doctorsearch?.doctor_name?.doctor_phone_number}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch?.doctor_name?.doctor_address}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch?.doctor_name?.doctor_qualification}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch?.doctor_name?.doctor_specialization?.category_name}</TableCell>
                                                                                        <TableCell align="left">{doctorsearch?.doctor_name?.doctor_category}</TableCell>
                                                                                        <TableCell align="left">
                                                                                            <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorsearch?.id); handleClickOpen() }}>
                                                                                                <Badge>
                                                                                                    <Iconify icon="eva:trash-2-outline" />
                                                                                                </Badge>
                                                                                            </IconButton>
                                                                                        </TableCell>

                                                                                    </TableRow>
                                                                                ))
                                                                            }
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
                                                                            {/* //! Pagination */}
                                                                            <TableRow>
                                                                                <TableCell colSpan={6}>
                                                                                    <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                                                                        {DoctorData ? (
                                                                                            <Pagination count={parseInt(DoctorData.count / 200) + 1} onChange={handleChangePage} />
                                                                                        ) : (
                                                                                            <Typography variant="body1">In Search</Typography>
                                                                                        )}
                                                                                    </Box>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        </>
                                                                }
                                                            </> : null
                                                    }
                                                </>
                                            }
                                        </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isDrawerOpen && <EditDoctor
                        id={selectedUpdateId} onClose={onCloseDrawer} divisionId={selectedDivisionId}
                    />
                    }
                </Scrollbar>
            </Card>
        </>
    );
}

export default React.memo(DoctorSearch)