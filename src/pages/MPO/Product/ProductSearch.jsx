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
    useGetAllProductsQuery,
    useSearchProductsMutation,
    useDeleteProductsByIdMutation,
    useGetProductsByDivisionIdQuery
} from '../../../api/MPOSlices/ProductSlice';
import {
    useGetFilteredDivisionsQuery,
} from "../../../api/DivisionSilces/companyDivisionSlice";
import EditProduct from './EditProduct';
import SearchIcon from '@mui/icons-material/Search';
import Test from './DefaultList';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useSelector } from 'react-redux';

const TABLE_HEAD = [
    { id: 'product_name', label: 'Product Name', alignRight: false },
    { id: 'product_molecular_name', label: 'Molecular Name', alignRight: false },
    { id: 'product_price_per_strip_in_mrp', label: 'Product in MRP', alignRight: false },
    { id: 'product_price_per_stockist', label: 'Price per Stockist', alignRight: false },
    { id: '' },
];

const ProductSearch = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    //! Company Division
    const Division = useGetFilteredDivisionsQuery(company_id);


    const [companyDivision, setCompanyDivision] = useState('')
    const [companyId, setCompanyId] = useState();


    const companydivisions = useMemo(() => {
        if (Division?.data) {
            return Division?.data.map(key => ({ id: key.id, title: key.division_name }))
        }
        return [];
    }, [Division])

    const { data: productDivision } = useGetProductsByDivisionIdQuery({ company_name: company_id, division_name: companyDivision })

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
    const handleDivisionChange = useCallback((event, value) => {
        setCompanyDivision(value?.id || '')
        setCompanyId(parseInt(company_id));
    }, [])

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Get all users wala
    const { data } = useGetAllProductsQuery(page);

    const [searchResults, setSearchResults] = useState({ search: "" });
    const [searchProduct, results] = useSearchProductsMutation()
    const searchData = results.data;

    const [SearchData, setSearchData] = useState([]);
    const [SearchDataCondition, setSearchDataCondition] = useState(false);

    const [SearchChemist] = useSearchProductsMutation();

    const onSearch = (e) => {
        const searchQuery = e.target.value;
        if (searchQuery === '') {
            setSearchDataCondition(false);
            setSearchData([]);
        } else {
            SearchChemist({ search: searchQuery, company_id: parseInt(company_id) })
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
            searchProduct(values)
        }
    }, [values, searchProduct])

    //! onSearch
    const FilteredData = { company_division: companyDivision, companyId: companyId, }

    useEffect(() => {
        if (companyId || companyDivision) {

            searchProduct(FilteredData)
        }
    }, [companyId, companyDivision])

    // !Delete products
    const [deleteProduct] = useDeleteProductsByIdMutation()

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
                        user_role === 'admin' &&
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TextField
                                    label="Search Product"
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
                                    options={companydivisions}
                                    getOptionLabel={(option) => option.title}
                                    onChange={handleDivisionChange}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Company Divisions" />
                                    )}
                                    renderOption={(props, option) => (
                                        <li {...props} key={option.id}>
                                            {option.title}
                                        </li>
                                    )}
                                />
                            </Grid>
                            <Grid item xs={9}>

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
                                                SearchDataCondition.length === 0 ?
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
                                                            SearchData.map((productsearch, index) => (
                                                                <TableRow hover tabIndex={-1} key={productsearch.id}>
                                                                    <TableCell>{index + 1}</TableCell>
                                                                    <TableCell component="th" scope="row" align="left" >
                                                                        <Typography variant="subtitle2" noWrap>
                                                                            {productsearch.product_name.product_name}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">{productsearch.product_name.product_molecular_name}</TableCell>
                                                                    <TableCell align="left">Rs. {productsearch.product_name.product_price_per_strip_in_mrp}</TableCell>
                                                                    <TableCell align="left">Rs. {productsearch.product_name.product_price_for_stockist}</TableCell>
                                                                    <TableCell align="left">
                                                                        {/* //! Edit  */}
                                                                        {
                                                                            user_role === "admin" &&
                                                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(productsearch.id)} >
                                                                                <Badge>
                                                                                    <Iconify icon="eva:edit-fill" />
                                                                                </Badge>
                                                                            </IconButton>
                                                                        }
                                                                        {/* //! Delete  */}
                                                                        {
                                                                            user_role === "admin" &&
                                                                            <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(productsearch.id); handleClickOpen() }}>
                                                                                <Badge>
                                                                                    <Iconify icon="eva:trash-2-outline" />
                                                                                </Badge>
                                                                            </IconButton>
                                                                        }
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
                                                                            <Button autoFocus onClick={() => { deleteProduct(selectedId); handleClose() }}>
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
                                            {companyDivision === "" || !companyDivision ?
                                                <Test /> :
                                                <>
                                                    {
                                                        productDivision !== undefined ?
                                                            <>
                                                                {
                                                                    productDivision.count === 0 ?
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
                                                                                productDivision.results.map((productsearch, index) => (
                                                                                    <TableRow hover tabIndex={-1} key={productsearch.id}>
                                                                                        <TableCell>{index + 1}</TableCell>
                                                                                        <TableCell component="th" scope="row" align="left" >
                                                                                            <Typography variant="subtitle2" noWrap>
                                                                                                {productsearch.product_name.product_name}
                                                                                            </Typography>
                                                                                        </TableCell>
                                                                                        <TableCell align="left">{productsearch.product_name.product_molecular_name}</TableCell>
                                                                                        <TableCell align="left">Rs. {productsearch.product_name.product_price_per_strip_in_mrp}</TableCell>
                                                                                        <TableCell align="left">Rs. {productsearch.product_name.product_price_for_stockist}</TableCell>
                                                                                        <TableCell align="left">
                                                                                            {/* //! Edit  */}
                                                                                            {
                                                                                                user_role === "admin" &&
                                                                                                <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(productsearch.id)} >
                                                                                                    <Badge>
                                                                                                        <Iconify icon="eva:edit-fill" />
                                                                                                    </Badge>
                                                                                                </IconButton>
                                                                                            }
                                                                                            {/* //! Delete  */}
                                                                                            {
                                                                                                user_role === "admin" &&
                                                                                                <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(productsearch.id); handleClickOpen() }}>
                                                                                                    <Badge>
                                                                                                        <Iconify icon="eva:trash-2-outline" />
                                                                                                    </Badge>
                                                                                                </IconButton>
                                                                                            }
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
                                                                                                <Button autoFocus onClick={() => { deleteProduct(selectedId); handleClose() }}>
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
                                                                                        {productDivision ? (
                                                                                            <Pagination count={parseInt(productDivision.count / 30) + 1} onChange={handleChangePage} />
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
                    {isDrawerOpen && <EditProduct
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }
                </Scrollbar>
            </Card>
        </>
    );
}
export default ProductSearch;