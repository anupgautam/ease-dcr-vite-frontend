import { useState } from 'react';
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
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Iconify from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import {
    useGetChemistsCategoryQuery,
    useDeleteChemistsCategoryByIdMutation
} from '../../../../api/MPOSlices/ChemistSlice'

const TABLE_HEAD = [
    { id: 'category_name', label: 'Category Name', alignRight: false },
    { id: '' },
];

const DefaultCategory = () => {

    //! For drawer 

    const [selectedId, setSelectedId] = useState(null);

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

    //! Get Categories
    const { data } = useGetChemistsCategoryQuery();

    // !Delete TourPlan
    const [deleteCategories] = useDeleteChemistsCategoryByIdMutation();
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

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
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data && data.map((categories, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={categories.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {categories.category_name.category_name}
                                                        </Typography>
                                                        {/* </Stack> */}
                                                    </TableCell>
                                                    {/* <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(categories.id)}>
                                                        <Badge>
                                                            <Iconify icon="eva:edit-fill" />
                                                        </Badge>
                                                    </IconButton> */}
                                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(categories.id); handleClickOpen() }}>
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
                                                            <Button autoFocus onClick={() => { deleteCategories(selectedId); handleClose() }}>
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
                    {/* {isDrawerOpen && <EditChemistCategories
                        idharu={selectedUpdateId} onClose={onCloseDrawer}
                    />
                    } */}

                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                    sx={{ margin: "20px 0px" }} >
                    {/* {data ?
                        <Pagination
                            count={parseInt(data.count / 8) + 1}
                            onChange={handleChangePage}
                        /> : <></>} */}
                </Box>
            </Card>
        </>
    )
}

export default DefaultCategory;