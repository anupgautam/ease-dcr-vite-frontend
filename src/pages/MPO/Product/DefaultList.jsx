import React, { useState, useCallback } from 'react';
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
import {
    useGetAllProductsQuery,
    useDeleteProductsByIdMutation
} from "../../../api/MPOSlices/ProductSlice";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import EditProduct from './EditProduct';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

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
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    const handleClickOpen = useCallback(() => {
        setOpenDialogue(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpenDialogue(false);
    }, []);

    //!Pagination logic
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // ! Get all products wala
    const { data } = useGetAllProductsQuery({ id: company_id, page: page, division_name: user_role === 'admin' ? "" : company_division_name }, {
        skip: !company_id || !user_role || !company_division_name
    });


    // !Delete product
    const [deleteProduct] = useDeleteProductsByIdMutation()
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const handleDelete = async (id) => {
        try {
            const response = await deleteProduct(id);
            if (response?.data) {
                toast.success(`${response?.data?.msg}`)
            } else if (response?.error) {
                toast.error(`Error: ${response.error.data?.message || "Failed to delete Product"}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred during deletion.");
        } finally {
            handleClose();
        }
    };

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
                                <TableCell><Skeleton /></TableCell>
                            </TableRow>
                        ))}
                </> :
                    <>{data && data.results.map((product, index) => (
                        <TableRow hover tabIndex={-1} role="checkbox" key={product.id}>
                            <TableCell sx={{
                                position: 'sticky',
                                left: 0,
                            }}>{index + 1}</TableCell>
                            <TableCell component="th" scope="row" align="left" sx={{
                                position: 'sticky',
                                left: 0,
                            }}>
                                <Typography variant="subtitle2" noWrap>
                                    {product.product_name.product_name}
                                </Typography>
                                {/* </Stack> */}
                            </TableCell>
                            <TableCell align="left">{product.product_name.product_molecular_name}</TableCell>
                            <TableCell align="left">{product.product_type}</TableCell>
                            <TableCell align="left">Rs. {product.product_name.product_price_per_strip_in_mrp}</TableCell>
                            <TableCell align="left">Rs. {product.product_name.product_price_for_stockist
                            }</TableCell>
                            <TableCell align="left">{product.division_name.division_name
                            }</TableCell>
                            <TableCell align="left">
                                {/* //!Edit */}
                                {
                                    user_role === "admin" &&
                                    <IconButton color={'primary'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={(e) => onEdit(product.id)} >
                                        <Badge>
                                            <Iconify icon="eva:edit-fill" />
                                        </Badge>
                                    </IconButton>
                                }
                                {/*//! Delete  */}
                                {
                                    user_role === "admin" &&
                                    <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(product.id); handleClickOpen() }}>
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
                                        Yes
                                    </Button>
                                    <Button
                                        onClick={handleClose}
                                        autoFocus>
                                        No
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            {isDrawerOpen && <EditProduct
                                idharu={selectedUpdateId} mpoGet={mpoGetId} onClose={onCloseDrawer}
                            />
                            }
                        </TableRow>
                    ))
                    }
                        <TableRow>
                            <TableCell colSpan={6}>
                                <Box justifyContent="center" alignItems="center" display="flex" margin="8px 0px">
                                    {data ? (
                                        <Pagination count={parseInt(data.count / 30) + 1} onChange={handleChangePage} />
                                    ) : (
                                        <Typography variant="body1">In Search</Typography>
                                    )}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </>}
        </>
    );
}

export default React.memo(DefaultList);