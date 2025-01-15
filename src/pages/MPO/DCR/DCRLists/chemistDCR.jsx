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
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from 'react-toastify';

import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';

import {
    useDeleteChemistsDCRByIdMutation,
    useSearchChemistsDCRQuery
} from '@/api/DCRs Api Slice/chemistDCR/ChemistDCRSlice';

import { useDispatch } from 'react-redux';
import { addSelectedUser } from '@/reducers/dcrSelectData';
import EditChemistDCR from '../EditDCRs/EditChemistDCR';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import moment from 'moment';
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'visited_area', label: 'Visited Area', alignRight: false },
    { id: 'chemist_name', label: 'Chemist Name', alignRight: false },
    { id: '', label: '', alignRight: false },

];

const ChemistDCR = ({ selectedUser, selectedMonth, selectedDate, dateOnly }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const dispatch = useDispatch();

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [isEdited, setEdited] = useState(false);



    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);

    const onEdit = (id, user_id) => {
        setSelectedUpdateId(id);
        dispatch(addSelectedUser(user_id))
        setIsDrawerOpen(true);
    }

    const onCloseDrawer = () => {
        setIsDrawerOpen(false);
    }

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }


    //! onSearch
    const FilteredData = { company_name: company_id, user_id: user_role === "admin" ? selectedUser : company_user_role_id, month: user_role === "admin" ? "" : selectedMonth, date: user_role === "admin" ? "" : selectedDate, fullDate: user_role === "admin" ? dateOnly : "" }

    //! Search Results 
    const results = useSearchChemistsDCRQuery(FilteredData);

    //!States
    const [filterArray, setFilterArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const elementsPerPage = 8;

    //! Copy array element 
    useEffect(() => {
        if (results && results?.data && results?.data?.results && Array.isArray(results?.data?.results)) {
            const arrayWala = [...results?.data?.results];
            setFilterArray(arrayWala);
        }
    }, [results]);

    //! Corrected
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    }

    const startIndex = (currentPage - 1) * elementsPerPage;
    const endIndex = startIndex + elementsPerPage;

    const currentPageData = filterArray.slice(startIndex, endIndex);

    // !Delete TourPlan
    const [deleteTourPlan] = useDeleteChemistsDCRByIdMutation();

    const handleDelete = async (id) => {
        try {
            const response = await deleteTourPlan(id);
            if (response?.data) {
                toast.success(`${response?.data?.msg}`)
            } else if (response?.error) {
                toast.error(`Error: ${response?.error?.data?.message || "Failed to delete Tourplan."}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        } finally {
            handleClose();
        }
    };

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
                                                            <TableCell><Skeleton /></TableCell>
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
                                                        results?.data && currentPageData.map((tourplan, index) => (
                                                            <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {tourplan?.mpo_name?.user_name?.first_name + " " + tourplan?.mpo_name?.user_name?.last_name}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>
                                                                <TableCell align="left">{tourplan?.shift?.shift}</TableCell>
                                                                <TableCell align="left">{moment(tourplan?.dcr?.date).format('DD')}</TableCell>
                                                                <TableCell align="left">{tourplan?.dcr?.visited_area?.area_name}</TableCell>
                                                                <TableCell component="th" scope="row" align="left">
                                                                    {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                                    <Typography variant="subtitle2" noWrap>
                                                                        {tourplan?.dcr?.visited_chemist?.chemist_name?.chemist_name}
                                                                    </Typography>
                                                                    {/* </Stack> */}
                                                                </TableCell>
                                                                <TableCell align="left">

                                                                    <Link to={`/dashboard/admin/all/user/dcrchemistdetail?id=${tourplan.id}`}>
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }}>
                                                                            <Badge>
                                                                                <Iconify icon="mdi:eye" sx={{ color: 'primary.main' }} />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    </Link>
                                                                    {/* //! Edit  */}
                                                                    {
                                                                        user_role === 'admin' &&
                                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan?.dcr?.id, tourplan?.mpo_name?.id)} >
                                                                            <Badge>
                                                                                <Iconify icon="eva:edit-fill" />
                                                                            </Badge>
                                                                        </IconButton>
                                                                    }
                                                                    {/* //! Delete  */}
                                                                    {
                                                                        user_role === 'admin' &&
                                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(tourplan?.dcr?.id); handleClickOpen() }}>
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
                                                                        <Button autoFocus onClick={() => { handleDelete(selectedId); handleClose() }}>
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
                            <EditChemistDCR
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

export default React.memo(ChemistDCR);