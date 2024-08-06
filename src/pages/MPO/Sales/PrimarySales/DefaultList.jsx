import React, { useState, useCallback } from 'react';
import {
    Badge,
    Button,
    TableRow,
    TableCell,
    Typography,
    IconButton,
    Pagination,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Iconify from '@/components/iconify/Iconify';
import {
    useGetAllPrimarySalesQuery,
    useDeletePrimarySalesByIdMutation
} from "../../../../api/MPOSlices/PrimarySalesApiSlice";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditPrimarySales from './EditPrimarySales';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const TABLE_HEAD = [
    { id: 'name', label: 'Name', alignRight: false },
    { id: 'company', label: 'Company', alignRight: false },
    { id: 'role', label: 'Role', alignRight: false },
    { id: 'isVerified', label: 'Verified', alignRight: false },
    { id: 'status', label: 'Status', alignRight: false },
    { id: '' },
];

const DefaultList = () => {

    //! For drawer 
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

    // ! Get all chemist wala
    const { data } = useGetAllPrimarySalesQuery(page);
    // 

    // !Delete chemists
    const [deleteChemist] = useDeletePrimarySalesByIdMutation()
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    return (
        <>
            {
                data === undefined ?
                    <>
                        {
                            eightArrays.map((key) => (
                                <TableRow key={key} >
                                    <TableCell></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                    <TableCell><Skeleton /></TableCell>
                                </TableRow>
                            ))}
                    </>
                    :
                    <>
                        {data && data.results.map((chem, index) => (
                            <>
                                <TableRow hover tabIndex={-1} key={chem.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        <Typography variant="subtitle2" noWrap>
                                            {chem.chemist_name.chemist_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">{chem.chemist_name.chemist_phone_number}</TableCell>
                                    <TableCell align="left">{chem.chemist_name.chemist_address}</TableCell>
                                    <TableCell align="left">{chem.chemist_name.chemist_gender}</TableCell>
                                    <TableCell align="left">
                                        {/* {
                                    {/* //!Edit */}
                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(chem.chemist_name.id)}>
                                            <Badge>
                                                <Iconify icon="eva:edit-fill" />
                                            </Badge>
                                        </IconButton>
                                        {/*//! Delete  */}
                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(chem.id); handleClickOpen() }}>
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
                                    {isDrawerOpen && <EditPrimarySales
                                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                                    />
                                    }
                                </TableRow>
                            </>
                        ))
                        }
                        {/* //!pagination */}
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                    {data ? (
                                        <Pagination count={parseInt(data.count / 8) + 1} onChange={handleChangePage} />
                                    ) : (
                                        <Typography variant="body1">In Search</Typography>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </>
            }
        </>
    );
}

export default React.memo(DefaultList);