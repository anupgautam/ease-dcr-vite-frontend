import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Badge,
    Table,
    Paper,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Box,
    Pagination
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import 'react-datepicker/dist/react-datepicker.css';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import {
    useDeleteStockistsDCRByIdMutation,
    useSearchStockistsDCRQuery
} from '../../../../api/DCRs Api Slice/stockistDCR/StockistDCRSlice';

import EditStockistDCR from '../EditDCRs/EditStockistDCR';
import { useDispatch } from 'react-redux';
import { addSelectedUser } from '@/reducers/dcrSelectData';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import Cookies from 'js-cookie';
import moment from 'moment';


const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'month', label: 'Month', alignRight: false },
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: '' },
];

const StockistDCR = ({ selectedUser, selectedMonth, selectedDate }) => {

    const dispatch = useDispatch()

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isEdited, setEdited] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id, user_id) => {
        setSelectedUpdateId(id);
        dispatch(addSelectedUser(user_id));
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const FilteredData = { company_name: Cookies.get('company_id'), user_id: selectedUser, month: selectedMonth, date: selectedDate }

    //! Search Results 
    const results = useSearchStockistsDCRQuery(FilteredData);

    //!States
    const [fetchedResults, setFetchedResults] = useState(null);
    const [filterArray, setFilterArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const elementsPerPage = 8;

    //! Copy array element 
    useEffect(() => {
        if (results && results.data && results.data.results && Array.isArray(results.data.results)) {
            const arrayWala = [...results.data.results];
            setFilterArray(arrayWala);
        }
    }, [results]);

    //! Corrected
    const handlePageChange = useCallback((event, newPage) => {
        setCurrentPage(newPage);
    }, []);

    const startIndex = (currentPage - 1) * elementsPerPage;
    const endIndex = startIndex + elementsPerPage;

    const currentPageData = filterArray.slice(startIndex, endIndex);

    // !Delete TourPlan
    const [deleteTourPlan] = useDeleteStockistsDCRByIdMutation();

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

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    return (
        <>
            <Card>
                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    headLabel={TABLE_HEAD}
                                />
                                <TableBody>
                                    <>
                                        {
                                            results.data === undefined ? <>
                                                {
                                                    eightArrays.map((key) => (
                                                        <TableRow key={key} >
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            <TableCell><Skeleton /></TableCell>
                                                            {/* <TableCell><Skeleton /></TableCell> */}
                                                            {/* <TableCell><Skeleton /></TableCell> */}
                                                        </TableRow>
                                                    ))}
                                            </> :
                                                <>
                                                    {results.data && results.data.count == 0 ?
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
                                                                        {/* No results found for &nbsp; */}
                                                                        {/* <strong>&quot;{selectedOption}&quot;</strong>. */}
                                                                        <strong>Requested Data Not found</strong>.
                                                                        <br /> Try checking for typos or using complete words.
                                                                        <br />
                                                                        <br />
                                                                        <br />
                                                                        <br />
                                                                        <br />
                                                                    </Typography>
                                                                </Paper>
                                                            </TableCell>
                                                        </TableRow>
                                                        :
                                                        results.data && currentPageData.map((tourplan, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {tourplan.mpo_name.user_name.first_name + " " + tourplan.mpo_name.user_name.last_name}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>
                                                                <TableCell align="left">{tourplan.dcr.shift.shift}</TableCell>
                                                                <TableCell align="left">{moment(tourplan.dcr.dcr.date).format('DD')}</TableCell>
                                                                {/* <TableCell align="left">{tourplan.dcr.dcr.year}</TableCell> */}
                                                                <TableCell align="left">{tourplan.dcr.dcr.month}</TableCell>
                                                                {/* <TableCell align="left">{tourplan?.dcr?.dcr?.visited_area?.company_area?.area_name}</TableCell> */}
                                                                <TableCell component="th" scope="row" align="left">
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {tourplan.dcr.dcr.visited_stockist.stockist_name.stockist_name}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>

                                                                {/* //! Edit  */}
                                                                <TableCell align="left">
                                                                    {
                                                                        Cookies.get('user_role') === 'admin' &&
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.dcr.dcr.id, tourplan.mpo_name.id)} >
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    }
                                                                    {/* //! Delete  */}
                                                                    {
                                                                        Cookies.get('user_role') === 'admin' &&
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(tourplan.dcr.dcr.id); handleClickOpen() }}>
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
                                                                        <Button autoFocus onClick={() => { deleteTourPlan(selectedId); handleClose() }}>
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
                                                </>}
                                    </>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {isDrawerOpen &&
                            <EditStockistDCR
                                idharu={selectedUpdateId}
                                onClose={onCloseDrawer}
                                setEdited={setEdited}
                            />
                        }
                    </Scrollbar>
                    {/* //!pagination */}
                    <Box justifyContent={'center'} alignItems='center' display={'flex'}
                        sx={{ margin: "20px 0px" }} >
                        {results ?
                            <Pagination
                                count={Math.ceil(filterArray.length / elementsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                            /> : <></>}
                    </Box>
                </Card>
            </Card>
        </>
    )
}

export default React.memo(StockistDCR);