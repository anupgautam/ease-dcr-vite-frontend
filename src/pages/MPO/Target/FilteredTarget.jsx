import React, { useState, useCallback } from 'react'
import {
    useDeleteTargetsByIdMutation,
    useGetTargetsByFilterQuery
} from '@/api/ExpensesSlices/targetSlices';
import {
    Badge,
    Button,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Pagination,
    Box
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Iconify from '@/components/iconify/Iconify';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import EditTarget from './EditTarget';
import { BSDate } from 'nepali-datepicker-react';
import { getNepaliMonthName } from '@/reusable/utils/reuseableMonth';
import { useSelector } from 'react-redux';

const FilteredTarget = ({ selectedYear, selectedRole }) => {

    const now = new BSDate().now();
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const monthData = getNepaliMonthName(now._date.month);
    const yearData = now._date.year;

    const { data } = useGetTargetsByFilterQuery({ selectedYear, selectedRole, company_name: company_id });

    const [deleteTarget] = useDeleteTargetsByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);

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

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    return (
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
                            </TableRow>
                        ))}
                </> :
                    <>{data && data?.map((target, index) => (
                        <TableRow hover tabIndex={-1} role="checkbox" key={target.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left">
                                <Typography variant="subtitle2" noWrap>
                                    {target?.target_to?.user_name?.first_name + " " + target?.target_to?.user_name?.last_name}
                                </Typography>
                            </TableCell>
                            <TableCell align="left">{target?.target_from?.user_name?.first_name + " " + target?.target_from?.user_name?.last_name}</TableCell>
                            <TableCell align="left">{target?.year}</TableCell>
                            <TableCell align="left">{target?.target_amount}</TableCell>
                            <TableCell align="left">{target?.sales}</TableCell>
                            <TableCell align="left">
                                {user_role === "admin" && <>
                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(target.id)}>
                                        <Badge>
                                            <Iconify icon="eva:edit-fill" />
                                        </Badge>
                                    </IconButton>
                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(target.id); handleClickOpen() }}>
                                        <Badge>
                                            <Iconify icon="eva:trash-2-outline" />
                                        </Badge>
                                    </IconButton>
                                </>
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
                                    <Button autoFocus onClick={() => { deleteTarget(selectedId); handleClose() }}>
                                        Yes
                                    </Button>
                                    <Button
                                        onClick={handleClose}
                                        autoFocus>
                                        No
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            {isDrawerOpen && <EditTarget
                                idharu={selectedUpdateId} onClose={onCloseDrawer}
                            />
                            }
                        </TableRow>
                    ))
                    }
                    </>}
        </>
    )
}

export default React.memo(FilteredTarget)