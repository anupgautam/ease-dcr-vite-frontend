import React, { useState, } from 'react';
import {
    Card,
    Badge,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
    Pagination,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Iconify from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import 'react-loading-skeleton/dist/skeleton.css'

import EditDCR from '../EditDCRs/EditDCR';
import {
    useDeleteDoctorsDCRByIdMutation,
    useGetAllDataofDCRDoctorQuery
} from '../../../../api/DCRs Api Slice/doctorDCR/DoctorDCRSlice';
import { addSelectedUser } from '@/reducers/dcrSelectData';
import { useDispatch } from 'react-redux';
import Scrollbar from '@/components/scrollbar/Scrollbar';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';


const TABLE_HEAD = [
    { id: 'mpo_name', label: 'MPO Name', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'visited_area', label: 'Visited Area', alignRight: false },
    { id: 'doctor_name', label: 'Doctor Name', alignRight: false },
    { id: '' },
];

const DefaultDoctorDCR = ({ selectedUser, dateOnly }) => {
    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const dispatch = useDispatch();
    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);


    const onEdit = (id, user_id) => {
        setSelectedUpdateId(id);
        dispatch(addSelectedUser(user_id));
        setIsDrawerOpen(true);
    }

    const onCloseDrawer = () => {
        setIsDrawerOpen(false);
    }

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

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }

    // !Get Tour Plans
    const { data } = useGetAllDataofDCRDoctorQuery({ page: page, id: user_role === "admin" ? selectedUser : company_user_role_id });


    const [deleteTourPlan] = useDeleteDoctorsDCRByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const handleDelete = async (id) => {
        try {
            const response = await deleteTourPlan(id);
            if (response?.data) {
                toast.success(`${response?.data?.message}`)
            } else if (response?.error) {
                toast.error(`Error: ${response.error.data?.message || "Failed to delete DCR."}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        } finally {
            handleClose();
        }
    };

    return (
        <>
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
                                        data === undefined ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow key={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        {/* <TableCell><Skeleton /></TableCell> */}
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data && data?.results.map((tourplan, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={tourplan.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {tourplan?.mpo_name?.user_name?.first_name + " " + tourplan?.mpo_name?.user_name?.last_name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">{tourplan?.shift?.shift}</TableCell>
                                                    <TableCell align="left">{tourplan?.dcr?.date}</TableCell>
                                                    {/* <TableCell align="left">{moment(tourplan?.dcr?.date).format('DD')}</TableCell> */}
                                                    <TableCell align="left">{tourplan.dcr.visited_area.area_name}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {tourplan?.dcr?.visited_doctor?.doctor_name?.doctor_name}
                                                        </Typography>
                                                    </TableCell>
                                                    {/* <TableCell align="left">
                                                        {
                                                            user_role === 'admin' &&
                                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(tourplan.id, tourplan.mpo_name.id)}>
                                                                <Badge>
                                                                    <Iconify icon="eva:edit-fill" />
                                                                </Badge>
                                                            </IconButton>
                                                        }
                                                        {
                                                            user_role === 'admin' &&
                                                            <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(tourplan.dcr.dcr.id); handleClickOpen() }}>
                                                                <Badge>
                                                                    <Iconify icon="eva:trash-2-outline" />
                                                                </Badge>
                                                            </IconButton>
                                                        }
                                                    </TableCell> */}
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
                    {isDrawerOpen && <EditDCR
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }

                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                    sx={{ margin: "20px 0px" }} >
                    {data ?
                        <Pagination
                            count={parseInt(data.count / 200) + 1}
                            onChange={handleChangePage}
                        /> : <></>}
                </Box>
            </Card>
        </>
    )
}

export default React.memo(DefaultDoctorDCR);