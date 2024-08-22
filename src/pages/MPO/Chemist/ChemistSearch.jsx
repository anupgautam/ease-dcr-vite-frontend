import { debounce } from 'lodash';
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
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Pagination,
    Box,
    Grid,
    Autocomplete,
    InputAdornment
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Test from './DefaultList';
import Cookies from 'js-cookie'
import EditChemist from './EditChemist'

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import { useForm1 } from '../../../reusable/components/forms/useForm';
import SearchIcon from '@mui/icons-material/Search';

import {
    useSearchChemistsMutation,
    useDeleteChemistsByIdMutation,
    useGetChemistsByMpoAreaAndIdQuery,
} from '../../../api/MPOSlices/ChemistSlice';
import {
    useGetAllMPOAreasNoPageQuery, usePostAllMPONamesNoPageMutation
} from '../../../api/MPOSlices/DoctorSlice'
import Scrollbar from '@/components/scrollbar/Scrollbar';

const TABLE_HEAD = [
    { id: 'chemist_name', label: 'Name', alignRight: false },
    { id: 'chemist_phone_number', label: 'Number', alignRight: false },
    { id: 'chemist_address', label: 'Address', alignRight: false },
    { id: 'chemist_category', label: 'Category', alignRight: false },
    // { id: 'is_invested', label: 'Is Invested', alignRight: false },
    { id: '' },
];

const ChemistSearch = () => {
    //! MPO Data
    const [MpoData] = usePostAllMPONamesNoPageMutation()
    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);

    const mpoNames = useMemo(() => {
        if (MpoList) {
            return MpoList?.map(key => ({ id: key?.id, title: key?.user_name?.first_name + ' ' + key?.user_name?.middle_name + ' ' + key?.user_name?.last_name }))
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
    const MPO_Area = useGetAllMPOAreasNoPageQuery({ id: Cookies.get('company_id'), mpo_name: mpoName })

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

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, [])

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, [])

    //! Options
    const [companyId, setCompanyId] = useState();

    const handleOptionChange = useCallback((event, value) => {
        setCompanyId(parseInt(Cookies.get('company_id')));
        setMPOArea(value?.id || "")
    }, [])

    const handleMPONameChange = useCallback((event, value) => {
        setMPOName(value?.id || "")
        setCompanyId(parseInt(Cookies.get('company_id')));
    }, [])

    //! Pagination Logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    //! Search Logic
    const { data: chemistData } = useGetChemistsByMpoAreaAndIdQuery({ company_name: Cookies.get('company_id'), mpo_area: mpoArea, mpo_name: mpoName, page: page })

    const [searchResults, setSearchResults] = useState({ search: "" });
    const [searchChemist, results] = useSearchChemistsMutation()

    const [SearchData, setSearchData] = useState([]);
    const [SearchDataCondition, setSearchDataCondition] = useState(false);

    const [SearchChemist] = useSearchChemistsMutation();

    const onSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery === '') {
            setSearchDataCondition(false);
            setSearchData([]);
        } else {
            SearchChemist({ search: searchQuery, company_id: parseInt(Cookies.get('company_id')) })
                .then((res) => {
                    if (res.data) {
                        setSearchDataCondition(true);
                        setSearchData(res.data);
                    }
                })
                .catch((err) => {
                });
        }
    };

    const initialFValues = {
        "search": " "
    }

    const {
        values,
        handleSearchClick,
    } = useForm1(initialFValues, true);

    useEffect(() => {
        if (values.search.trim()) {
            searchChemist(values)
        }
    }, [values, searchChemist])

    // const [filterArray, setFilterArray] = useState([]);
    // const [currentPage, setCurrentPage] = useState(1);
    // const elementsPerPage = 8;
    //! Copy array element 
    useEffect(() => {
        if (results && results?.data && results?.data?.results && Array.isArray(results?.data?.results)) {
            const arrayWala = [...results?.data?.results];
            setFilterArray(arrayWala);
        }
    }, [results]);

    //! onSearch
    const FilteredData = { mpo_area: mpoArea, mpo_name: mpoName, companyId: companyId }

    useEffect(() => {
        if (companyId || mpoArea || mpoName) {

            searchChemist(FilteredData)
        }
    }, [companyId, mpoArea, mpoName])

    // !Delete chemists
    const [deleteChemist] = useDeleteChemistsByIdMutation()

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
                        Cookies.get('user_role') === "admin" &&
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TextField
                                    label="Search Chemist"
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
                            <Grid item xs={3}>
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
                                <Grid item xs={3}>
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
                    <TableContainer sx={{ minWidth: 800 }}>
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
                                                            SearchData?.map((chemistsearch, index) => (
                                                                <TableRow hover tabIndex={-1} key={chemistsearch.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell component="th" scope="row" align="left">
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {chemistsearch.chemist_name.chemist_name}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">{chemistsearch.chemist_name.chemist_phone_number}</TableCell>
                                                                    <TableCell align="left">{chemistsearch.chemist_name.chemist_address}</TableCell>
                                                                    <TableCell align="left">{chemistsearch.chemist_name.chemist_category}</TableCell>
                                                                    {/* <TableCell align="left">{chemistsearch.is_investment === true ? "Invested" : "Not Invested"}</TableCell> */}
                                                                    <TableCell align="left">
                                                                        {/* //! Edit  */}
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => {
                                                                            onEdit(chemistsearch.chemist_name.id)
                                                                        }}>
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                        {/* //! Delete  */}
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(chemistsearch.id); handleClickOpen() }}>
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
                                                                            <Button autoFocus onClick={() => { deleteChemist(selectedId); handleClose() }}>
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
                                            {mpoName === "" || !mpoName ?
                                                <Test /> :
                                                <>
                                                    {
                                                        chemistData !== undefined ?
                                                            <>
                                                                {
                                                                    chemistData?.count === 0 ?
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
                                                                                chemistData?.results?.map((chemistsearch, index) => (
                                                                                    <TableRow hover tabIndex={-1} key={chemistsearch.id}>
                                                                                        <TableCell>{index + 1}</TableCell>
                                                                                        <TableCell component="th" scope="row" align="left">
                                                                                            {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                                            <Typography variant="subtitle2" noWrap>
                                                                                                {chemistsearch.chemist_name.chemist_name}
                                                                                            </Typography>
                                                                                            {/* </Stack> */}
                                                                                        </TableCell>
                                                                                        <TableCell align="left">{chemistsearch.chemist_name.chemist_phone_number}</TableCell>
                                                                                        <TableCell align="left">{chemistsearch.chemist_name.chemist_address}</TableCell>
                                                                                        <TableCell align="left">{chemistsearch.chemist_name.chemist_category}</TableCell>
                                                                                        {/* <TableCell align="left">{chemistsearch.is_investment === true ? "Invested" : "Not Invested"}</TableCell> */}
                                                                                        {/* //! Edit  */}
                                                                                        <TableCell align="left">
                                                                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => {
                                                                                                onEdit(chemistsearch.chemist_name.id)
                                                                                            }}>
                                                                                                <Badge>
                                                                                                    <Iconify icon="eva:edit-fill" />
                                                                                                </Badge>
                                                                                            </IconButton>
                                                                                            {/* //! Delete  */}
                                                                                            <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(chemistsearch.id); handleClickOpen() }}>
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
                                                                                                <Button autoFocus onClick={() => { deleteChemist(selectedId); handleClose() }}>
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
                                                                            {/* //!pagination */}
                                                                            <TableRow>
                                                                                <TableCell colSpan={6}>
                                                                                    <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                                                                        {chemistData ? (
                                                                                            <Pagination count={parseInt(chemistData.count / 200) + 1} onChange={handleChangePage} />
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
                    {isDrawerOpen && <EditChemist
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }
                </Scrollbar>
            </Card>
        </>
    );
}

export default ChemistSearch;