import React, { useState, useCallback } from 'react';
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
    Box,
    Grid,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import USERLIST from '@/_mock/user';
import 'react-loading-skeleton/dist/skeleton.css'
import { toast } from 'react-toastify';

import {
    useGetDoctorsSpecializationQuery,
    useDeleteDoctorsSpecializationByIdMutation
} from '../../../../api/MPOSlices/DoctorSlice'
import EditDoctorSpecialization from './EditDoctorSpecialization';
import ExportToExcel from '@/reusable/utils/exportSheet';
import { useSelector } from 'react-redux';


const TABLE_HEAD = [
    { id: 'doctor_specialization', label: 'Doctor Specialization', alignRight: false },
    { id: '' },
    // { id: '' },
];

const DefaultSpecialization = () => {
    const { company_id } = useSelector((state) => state.cookie);

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

    //! Get Categories
    const { data } = useGetDoctorsSpecializationQuery(company_id);

    // !Delete Doctor Category
    const [deleteCategories] = useDeleteDoctorsSpecializationByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const handleDelete = async (id) => {
        try {
            const response = await deleteCategories(id);
            if (response?.data) {
                toast.success(`${response?.data?.msg}`)
            } else if (response?.error) {
                toast.error(`Error: ${response.error.data?.message || "Failed to delete Doctor Specilization"}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        } finally {
            handleClose();
        }
    };

    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'Doctor Specialization', key: 'doctor_specialization' },
    ];

    const templateData = data && data?.map((values, index) => ({
        sno: index + 1,
        doctor_specialization: values?.category_name,
    }))

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
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data && data?.map((categories, index) => (
                                                <TableRow hover tabIndex={-1} key={categories.id || `fallback-key-${index}`}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {categories.category_name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(categories.id)}>
                                                            <Badge>
                                                                <Iconify icon="eva:edit-fill" />
                                                            </Badge>
                                                        </IconButton>
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(categories.id); handleClickOpen() }}>
                                                            <Badge>
                                                                <Iconify icon="eva:trash-2-outline" />
                                                            </Badge>
                                                        </IconButton>
                                                    </TableCell>

                                                </TableRow>
                                            ))
                                            }
                                            </>}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
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
            {isDrawerOpen && <EditDoctorSpecialization
                idharu={selectedUpdateId} onClose={onCloseDrawer}
            />
            }
        </>
    )
}

export default React.memo(DefaultSpecialization);