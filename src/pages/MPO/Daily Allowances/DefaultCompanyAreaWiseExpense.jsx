import React, { useState,useCallback } from 'react';
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

import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import Cookies from 'js-cookie'
import {
    useGetAllCompanyAreaWiseExpensesQuery,
    useDeleteCompanyAreaWiseExpensesByIdMutation,
} from '@/api/CompanySlices/companyAreaWiseExpenses';
import EditCompanyAreaWiseExpenses from './EditCompanyAreaWiseExpenses';


const TABLE_HEAD = [
    { id: 'expenses_rate', label: 'Expenses Rate', alignRight: false },
    { id: 'company_area', label: 'Company Area', alignRight: false },
    { id: '' },
];

const DefaultCompanyAreaWiseExpense = () => {

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

    // !Get Tour Plans
    const { data } = useGetAllCompanyAreaWiseExpensesQuery({
        id: Cookies.get('company_id'), page: page
    });

    // !Delete TourPlan
    const [deleteCompanyAreaWiseExpense] = useDeleteCompanyAreaWiseExpensesByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

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
                                                    <TableRow id={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>
                                                {data && data?.results?.map((areawiseExpense, index) => (
                                                    <TableRow hover tabIndex={-1} role="checkbox" key={areawiseExpense.id}>
                                                        <TableCell>{index + 1}</TableCell>
                                                        <TableCell component="th" scope="row" align="left">
                                                            {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                            <Typography variant="subtitle2" noWrap>
                                                                {areawiseExpense.expenses_rate}
                                                            </Typography>
                                                            {/* </Stack> */}
                                                        </TableCell>
                                                        {/* <TableCell align="left">{areawiseExpense.expenses_rate}</TableCell> */}
                                                        <TableCell align="left">{areawiseExpense.area_name.company_area.area_name}</TableCell>
                                                        <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(areawiseExpense.id)}>
                                                            <Badge>
                                                                <Iconify icon="eva:edit-fill" />
                                                            </Badge>
                                                        </IconButton>
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(areawiseExpense.id); handleClickOpen() }}>
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
                                                                <Button autoFocus onClick={() => { deleteCompanyAreaWiseExpense(selectedId); handleClose() }}>
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
                    {isDrawerOpen && <EditCompanyAreaWiseExpenses
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    }

                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                    sx={{ margin: "20px 0px" }} >
                    {data ?
                        <Pagination
                            count={parseInt(data.count / 8) + 1}
                            onChange={handleChangePage}
                        /> : <></>}
                </Box>
            </Card>
        </>
    )
}

export default React.memo(DefaultCompanyAreaWiseExpense);