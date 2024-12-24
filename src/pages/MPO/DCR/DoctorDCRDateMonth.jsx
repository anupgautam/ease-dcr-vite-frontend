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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const DoctorDCRDateMonth = ({}) => {
    return (
        <Scrollbar>
            <TableContainer sx={{ minWidth: 900 }}>
                <Table>
                    <UserListHead headLabel={TABLE_HEAD} />
                    <TableBody>
                        {/* {data && data.results.map((doc, index) => (
                            <TableRow hover tabIndex={-1} role="checkbox" key={doc?.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell component="th" scope="row" align="left">
                                    <Typography variant="subtitle2" noWrap>
                                        {doc?.doctor_name?.doctor_name}
                                    </Typography>
                                </TableCell>
                                <TableCell align="left">{doc?.doctor_name?.doctor_phone_number}</TableCell>
                                <TableCell align="left">{doc?.doctor_name?.doctor_territory.area_name}</TableCell>
                                <TableCell align="left">{doc?.doctor_name?.doctor_qualification}</TableCell>
                                <TableCell align="left">{doc?.doctor_name?.doctor_specialization?.category_name}</TableCell>
                                <TableCell align="left">{doc?.doctor_name?.doctor_category}</TableCell>
                                {user_role === 'admin' && (
                                    <>
                                        <TableCell align="left">
                                            <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(doc.id, doc.doctor_name.id)} >
                                                <Badge>
                                                    <Iconify icon="eva:edit-fill" />
                                                </Badge>
                                            </IconButton>
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
                                                <Button autoFocus onClick={() => { deleteDoctor(selectedId); handleClose() }}>
                                                    Yes
                                                </Button>
                                                <Button onClick={handleClose} autoFocus>
                                                    No
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                        {isDrawerOpen &&
                                            <EditDoctor
                                                id={selectedUpdateId}
                                                onClose={onCloseDrawer}
                                                divisionId={selectedDivisionId}
                                            />
                                        }
                                    </>
                                )}
                            </TableRow>
                        ))} */}
                    </TableBody>
                </Table>
            </TableContainer>
            {/* {isDrawerOpen && <EditDoctor
                id={selectedUpdateId} onClose={onCloseDrawer} divisionId={selectedDivisionId}
            />
            } */}
        </Scrollbar>
    )
}
export default DoctorDCRDateMonth