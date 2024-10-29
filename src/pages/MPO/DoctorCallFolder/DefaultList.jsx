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
    Card,
    TableContainer,
    Table,
    TableBody
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Iconify from '@/components/iconify/Iconify';
import {
    useGetAllProductsQuery,
    useDeleteProductsByIdMutation
} from "../../../api/MPOSlices/ProductSlice";
import {
    useGetDoctorCallQuery,
    useDeleteDoctorCallByIdMutation
} from '../../../api/MPOSlices/DoctorCallFolderSlice'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditProduct from './EditProduct';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import { UserListHead } from '../../../sections/@dashboard/user';
import Scrollbar from '../../../components/scrollbar/Scrollbar';

const TABLE_HEAD = [
    { id: 'image', label: 'Product Image', alignRight: false },
    { id: 'product_name', label: 'Product Name', alignRight: false },
    { id: '' },
];

const DefaultList = () => {
    const { company_id, user_role, company_division_name } = useSelector((state) => state.cookie);

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [mpoGetId, setMpoGetId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedUpdateId, setSelectedUpdateId] = useState(null);
    const [open, setOpen] = useState(false);

    const onEdit = useCallback((id, mpoId) => {
        setSelectedUpdateId(id);
        setMpoGetId(mpoId);
        setIsDrawerOpen(true);
    }, []);

    const onCloseDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    //! Dialogue

    const [openDialogue, setOpenDialogue] = useState(false);
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    const handleClickImage = (image) => {
        setOpenImage(true);
        setSelectedImage(image)
    }

    const handleCloseImage = () => {
        setOpenImage(false);
        setSelectedImage(null)
    }

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Get all products wala
    // const { data } = useGetAllProductsQuery({ id: company_id, page: page, division_name: user_role === 'admin' ? "" : company_division_name }, {
    //     skip: !company_id || !user_role || !company_division_name
    // });

    const DoctorCall = useGetDoctorCallQuery({ id: company_id })


    // !Delete product
    const [deleteProduct] = useDeleteDoctorCallByIdMutation()
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    return (
        <>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 800, overflow: 'auto' }}>
                        <Table>
                            <UserListHead headLabel={TABLE_HEAD} />
                            <TableBody>
                                {
                                    DoctorCall?.data === undefined ?
                                        eightArrays.map((key) => (
                                            <TableRow key={key} >
                                                <TableCell><Skeleton /></TableCell>
                                                <TableCell><Skeleton /></TableCell>
                                                <TableCell><Skeleton /></TableCell>
                                            </TableRow>
                                        ))
                                        :
                                        DoctorCall.data.map((product, index) => (
                                            <TableRow hover tabIndex={-1} role="checkbox" key={product.id}>
                                                <TableCell sx={{ position: 'sticky', left: 0 }}>{index + 1}</TableCell>
                                                <TableCell component="th" scope="row" align="left" sx={{ position: 'sticky', left: 0 }}>
                                                    <img
                                                        src={product.image}
                                                        alt={product.product_id.product_name.product_name}
                                                        onClick={() => handleClickImage(product.image)}
                                                        style={{
                                                            width: 40,
                                                            height: 40,
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                        }}
                                                    />

                                                </TableCell>
                                                <TableCell component="th" scope="row" align="left" sx={{ position: 'sticky', left: 0 }}>
                                                    <Typography variant="subtitle2" noWrap>
                                                        {product.product_id.product_name.product_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="left">
                                                    {user_role === "admin" &&
                                                        <IconButton color="primary" sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(product.id)}>
                                                            <Badge>
                                                                <Iconify icon="eva:edit-fill" />
                                                            </Badge>
                                                        </IconButton>
                                                    }
                                                    {user_role === "admin" &&
                                                        <IconButton color="error" sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(product.id); handleClickOpen(); }}>
                                                            <Badge>
                                                                <Iconify icon="eva:trash-2-outline" />
                                                            </Badge>
                                                        </IconButton>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                        ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>
            </Card>
            <Dialog open={openImage} onClose={handleCloseImage}>
                <img src={selectedImage} alt="Selected" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            </Dialog>
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
                    <Button autoFocus onClick={() => { deleteProduct(selectedId); handleClose(); }}>
                        Yes
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            {isDrawerOpen && <EditProduct idharu={selectedUpdateId} mpoGet={mpoGetId} onClose={onCloseDrawer} />}
        </>
    );
}

export default React.memo(DefaultList);