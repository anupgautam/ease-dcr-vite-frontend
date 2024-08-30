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
    useGetAllStockistsQuery,
    useSearchStockistsMutation,
    useDeleteStockistsByIdMutation,
    useGetStockistsByCompanyAreaQuery
} from '../../../api/MPOSlices/StockistSlice';
import {
    useGetAllCompanyAreasQuery,
} from "../../../api/CompanySlices/companyAreaSlice";

import EditStockist from './EditStockist';
import SearchIcon from '@mui/icons-material/Search';
import Test from './DefaultList';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'stockist_contact_number', label: 'Stockist Number', alignRight: false },
    { id: 'stockist_address', label: 'Stockist Address', alignRight: false },
    { id: 'stockist_category', label: 'Stockist Category', alignRight: false },
    { id: '' },
];

const StockistSearch = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Get Company Area
    const Company_Areas = useGetAllCompanyAreasQuery(company_id);

    const [companyArea, setCompanyArea] = useState('');
    const [companyId, setCompanyId] = useState(company_id);

    const companyareas = useMemo(() => {
        if (Company_Areas?.data) {
            return Company_Areas.data.map(key => ({ id: key.id, title: key.company_area }));
        }
        return [];
    }, [Company_Areas]);

    const { data: StockistData } = useGetStockistsByCompanyAreaQuery({ company_name: parseInt(company_id), company_area: user_role === "admin" ? companyArea : company_user_id });

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Options
    const handleCompanyNameChange = (event, value) => {
        setCompanyArea(value?.id || '');
        setCompanyId(company_id);
    };

    //!Pagination logic
    const [page, setPage] = useState(1);
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel;
        let thisArray = data.split(" ");
        setPage(thisArray[3]);
    }

    // ! Search Logic
    // const { data: AllStockistsData } = useGetAllStockistsQuery({
    //     id: parseInt(company_id),
    //     page: page,
    //     company_area: user_role === 'admin' ? "" : company_user_id
    // });

    const [SearchData, setSearchData] = useState([]);
    const [SearchDataCondition, setSearchDataCondition] = useState(false);

    const [searchStockist, results] = useSearchStockistsMutation();
    const searchData = results.data;


    const [SearchChemist] = useSearchStockistsMutation();

    const onSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery === '') {
            setSearchDataCondition(false);
            setSearchData([]); // Clear the search data immediately
        } else {
            SearchChemist({ search: searchQuery, company_id: parseInt(company_id) })
                .then((res) => {
                    if (res.data) {
                        setSearchDataCondition(true);
                        setSearchData(res.data);
                    }
                })
                .catch((err) => {
                    // Handle error
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
            searchStockist(values);
        }
    }, [values, searchStockist]);

    // !Delete stockists
    const [deleteStockist] = useDeleteStockistsByIdMutation();

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    const debouncedSearch = debounce(onSearch, 300);

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    {
                        user_role === 'admin' &&
                        <Grid container spacing={2}>
                            <Grid item xs={5} sm={3}>
                                <TextField
                                    label="Search Stockist"
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
                                    options={companyareas}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleCompanyNameChange}
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
                                                            SearchData.map((stockistsearch, index) => (
                                                                <TableRow hover tabIndex={-1} key={stockistsearch.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell component="th" scope="row" align="left">
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {stockistsearch.stockist_name.stockist_name}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">{stockistsearch.stockist_name.stockist_contact_number}</TableCell>
                                                                    <TableCell align="left">{stockistsearch.stockist_name.stockist_address}</TableCell>
                                                                    <TableCell align="left">{stockistsearch.stockist_name.stockist_category}</TableCell>
                                                                    <TableCell align="left">
                                                                        {/* //! Edit  */}
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(stockistsearch.stockist_name.id)} >
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                        {/* //! Delete  */}
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(stockistsearch.id); handleClickOpen() }}>
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
                                                                            <Button autoFocus onClick={() => { deleteStockist(selectedId); handleClose() }}>
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
                                            {companyArea === "" || !companyArea ?
                                                <Test /> :
                                                <>
                                                    {
                                                        StockistData !== undefined ?
                                                            <>
                                                                {
                                                                    StockistData?.count === 0 ?
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
                                                                                StockistData?.results.map((stockistsearch, index) => (
                                                                                    <TableRow hover tabIndex={-1} key={stockistsearch.id}>
                                                                                        <TableCell>{index + 1}</TableCell>
                                                                                        <TableCell component="th" scope="row" align="left">
                                                                                            <Typography variant="subtitle2" noWrap>
                                                                                                {stockistsearch.stockist_name.stockist_name}
                                                                                            </Typography>
                                                                                        </TableCell>
                                                                                        <TableCell align="left">{stockistsearch.stockist_name.stockist_contact_number}</TableCell>
                                                                                        <TableCell align="left">{stockistsearch.stockist_name.stockist_address}</TableCell>
                                                                                        <TableCell align="left">{stockistsearch.stockist_name.stockist_category}</TableCell>
                                                                                        <TableCell align="left">
                                                                                            {/* //! Edit  */}
                                                                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(stockistsearch.stockist_name.id)} >
                                                                                                <Badge>
                                                                                                    <Iconify icon="eva:edit-fill" />
                                                                                                </Badge>
                                                                                            </IconButton>
                                                                                            {/* //! Delete  */}
                                                                                            <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(stockistsearch.id); handleClickOpen() }}>
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
                                                                                                <Button autoFocus onClick={() => { deleteStockist(selectedId); handleClose() }}>
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
                                                                                        {StockistData ? (
                                                                                            <Pagination count={parseInt(StockistData.count / 200) + 1} onChange={handleChangePage} />
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
                    {isDrawerOpen && <EditStockist
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />}
                </Scrollbar>
            </Card>
        </>
    );
}

export default React.memo(StockistSearch);
