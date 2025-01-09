import React, { useMemo, useState, useEffect, useCallback } from 'react';
//! @mui
import {
    Card,
    Table,
    TableRow,
    TableBody,
    Button,
    TableCell,
    Typography,
    TableContainer,
    Box,
    Grid,
    Container,
    Dialog,
    DialogTitle,
    DialogActions,
    IconButton,
    Badge
} from '@mui/material';
import 'react-datepicker/dist/react-datepicker.css';
import "nepali-datepicker-reactjs/dist/index.css"

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Iconify from '@/components/iconify/Iconify';
import Label from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import { toast } from 'react-toastify'
import Scrollbar from '@/components/scrollbar/Scrollbar';
import { useSelector } from 'react-redux';
import { useDeleteContactByIdMutation, useGetAllContactsQuery } from '../../../api/MPOSlices/contactApiSlice';

const TABLE_HEAD = [
    { id: 'user_id', label: 'User Name', alignRight: false },
    { id: 'email', label: 'Email', alignRight: false },
    { id: 'phone_number', label: 'Phone Number', alignRight: false },
    { id: 'message', label: 'Message', alignRight: false },
    { id: '' },
];

const ListOfContacts = () => {

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const { data } = useGetAllContactsQuery()
    const [openDialogue, setOpenDialogue] = useState(false);

    const [selectedId, setSelectedId] = useState(null);

    const [deleteContact] = useDeleteContactByIdMutation();

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleDelete = async (id) => {
        try {
            const response = await deleteContact(id);
            if (response?.data) {
                toast.success(`Contact Deleted.`)
            } else if (response?.error) {
                toast.error(`Error: ${response?.error?.data?.message || "Failed to delete Contact"}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        }
    };

    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={10}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Contacts</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container>
                            <Grid item xs={10}>
                                <Box style={{ float: 'right', marginBottom: "25px" }}>
                                    {/* <ExportToExcel headers={headers} fileName={`Chemists`} data={templateData} /> */}
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Card>

                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 1200 }}>
                            <Table>
                                <UserListHead
                                    headLabel={TABLE_HEAD}
                                />
                                <TableBody>
                                    {data === undefined ? (
                                        <>
                                            {eightArrays.map((key) => (
                                                <TableRow key={key}>
                                                    <TableCell><Skeleton /></TableCell>
                                                    <TableCell><Skeleton /></TableCell>
                                                    <TableCell><Skeleton /></TableCell>
                                                    <TableCell><Skeleton /></TableCell>
                                                    <TableCell><Skeleton /></TableCell>
                                                    <TableCell><Skeleton /></TableCell>
                                                    <TableCell><Skeleton /></TableCell>
                                                </TableRow>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {data && data?.map((doc, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={doc?.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {doc?.full_name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">{doc?.email}</TableCell>
                                                    <TableCell align="left">{doc?.contact_number}</TableCell>
                                                    <TableCell align="left">{doc?.message}
                                                    </TableCell>
                                                    <TableCell align="left">
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doc.id); handleClickOpen() }}>
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
                                                            <Button autoFocus onClick={() => { handleDelete(selectedId); handleClose() }}>
                                                                Yes
                                                            </Button>
                                                            <Button onClick={handleClose} autoFocus>
                                                                No
                                                            </Button>
                                                        </DialogActions>
                                                    </Dialog>
                                                </TableRow>
                                            ))}
                                        </>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Scrollbar>
                </Card>
            </Container>
        </>
    )
}

export default React.memo(ListOfContacts);