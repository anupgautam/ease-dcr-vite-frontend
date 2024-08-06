import { useState, useEffect } from 'react';
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
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import SearchIcon from '@mui/icons-material/Search';
import Test from './DefaultList';
import Cookies from 'js-cookie'
import EditCollections from './EditCollections'

import Iconify from '@/components/iconify/Iconify';
import Label from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';

import { useForm1 } from '../../../reusable/components/forms/useForm';

import {
    useGetAllCollectionsQuery,
    useSearchCollectionsMutation,
    useDeleteCollectionsByIdMutation
} from '../../../api/MPOSlices/CollectionsApiSlice';


const TABLE_HEAD = [
    { id: 'chemist_name', label: 'Chemist Name', alignRight: false },
    { id: 'chemist_phone_number', label: 'Chemist Number', alignRight: false },
    { id: 'chemist_address', label: 'Chemist Address', alignRight: false },
    { id: 'chemist_gender', label: 'Gender', alignRight: false },
    { id: '' },
];

const CollectionsSearch = () => {

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = (id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    };

    const onCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }

    // ! Get all chemists wala
    const { data } = useGetAllCollectionsQuery(page);


    const [filterArray, setFilterArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const elementsPerPage = 8;
    const [searchResults, setSearchResults] = useState({ search: "" });
    const [searchChemist, results, isSuccess] = useSearchCollectionsMutation()

    //! Copy array element 
    useEffect(() => {
        if (results && results.data && results.data.results && Array.isArray(results.data.results)) {
            const arrayWala = [...results.data.results];
            setFilterArray(arrayWala);
        }
    }, [results]);

    //! Corrected
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * elementsPerPage;
    const endIndex = startIndex + elementsPerPage;

    const currentPageData = filterArray.slice(startIndex, endIndex);

    // !on search
    const onSearch = (e) => {
        const searchQuery = e.target.value;
        const company_id = Cookies.get('company_id');
        setSearchResults({ search: searchQuery, company_id })
        searchChemist(searchResults);
    }

    const initialFValues = {
        "search": " "
    }

    const {
        values,
        handleSearchClick,
    } = useForm1(initialFValues, true);

    useEffect(() => {
        searchChemist(values)
    }, [values])

    // !Delete chemists
    const [deleteChemist] = useDeleteCollectionsByIdMutation()

    //! Dialogue 
    const [openDialogue, setOpenDialogue] = useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = () => {
        setOpenDialogue(true)
    }

    const handleClose = () => {
        setOpenDialogue(false)
    }

    return (
        <>
            <Card>
                <Box style={{ padding: "20px" }}>
                    <Grid container spacing={0}>
                        <Grid item xs={3}>
                            <Grid container>
                                <Grid item xs={9}>
                                    <TextField
                                        label="Search Chemists"
                                        variant="outlined"
                                        onChange={(e) => onSearch(e)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ m: 2 }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={9}>

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
                                {(searchResults?.search?.length <= 3) ?
                                    <Test /> :
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
                                                        results?.data && results?.data?.map((chemistsearch, index) => (
                                                            <TableRow hover tabIndex={-1} key={chemistsearch.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell TableCell component="th" scope="row" align="left">
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {chemistsearch.chemist_name.chemist_name}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>
                                                                <TableCell align="left">{chemistsearch.chemist_name.chemist_phone_number}</TableCell>
                                                                <TableCell align="left">{chemistsearch.chemist_name.chemist_address}</TableCell>
                                                                <TableCell align="left">{chemistsearch.chemist_name.chemist_gender}</TableCell>
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
                                    </>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {isDrawerOpen && <EditCollections
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }
                </Scrollbar>
            </Card>
        </>
    );
}

export default CollectionsSearch;