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
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import {
    useDeleteHODCRsByIdMutation,
    useSearchHODCRQuery
} from '@/api/HighOrderSlices/hoDCRSlice';

import EditHoDCR from '../EditDCRs/EditHoDCR';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'visited_with', label: 'Visited With', alignRight: false },
    { id: '' },
    { id: '' },
];

const HODCR = ({ selectedUser, selectedMonth, selectedDate }) => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isEdited, setEdited] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = useCallback((id) => {
        setSelectedUpdateId(id);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const FilteredData = { year: selectedDate, user_id: user_role === 'admin' ? selectedUser : company_user_id, month: selectedMonth, date: '', company_name: company_id }

    //! Search Results 
    const results = useSearchHODCRQuery(FilteredData,
        // {
        //     skip: !user_role || !company_id || !selectedDate || !selectedMonth || !company_user_role_id
        // }
    );

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
    const [deleteTourPlan] = useDeleteHODCRsByIdMutation();

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
                                                        results.data && results.data.results.map((tourplan, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {tourplan.user_id.user_name.first_name + " " + tourplan.user_id.user_name.last_name}
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell align="left">{tourplan.shift.shift}</TableCell>
                                                                <TableCell align="left">{moment(tourplan.date).format('DD')}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {tourplan.visited_with.user_name.first_name + " " + tourplan.visited_with.user_name.last_name}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>
                                                                <Link to={`/dashboard/admin/all/user/dcrhodetail?id=${tourplan.id}`}>
                                                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }}>
                                                                        <Badge>
                                                                            <Iconify icon="mdi:eye" sx={{ color: 'primary.main' }} />
                                                                        </Badge>
                                                                    </IconButton>
                                                                </Link>
                                                                {/* //! Edit  */}
                                                                <TableCell align="left">
                                                                    {
                                                                        user_role === 'admin' &&
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id)} >
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    }
                                                                    {/* //! Delete  */}
                                                                    {
                                                                        user_role === 'admin' &&
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(tourplan.id); handleClickOpen() }}>
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
                                                                            Yes{selectedId}
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
                            <EditHoDCR
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

export default React.memo(HODCR);