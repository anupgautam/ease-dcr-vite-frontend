import React, { useState, useMemo, useCallback } from 'react';
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
    useGetAllSecondarySalesQuery,
    useDeleteSecondarySalesByIdMutation
} from "../../../../api/MPOSlices/SecondarySalesApiSlice";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useSelector } from 'react-redux';

import {
    useGetSecondarySalesByCompanyIdQuery
} from '../../../../api/OrderedProductslices/chemistOrderedProductSlice'


const DefaultList = () => {
    const { company_id } = useSelector((state) => state.cookie);;

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
    const { data } = useGetSecondarySalesByCompanyIdQuery(company_id);

    console.log(data)

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
                        {data && data?.map((chem, index) => (
                            <>
                                <TableRow hover tabIndex={-1} key={chem.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell component="th" scope="row" align="left">
                                        <Typography variant="subtitle2" noWrap>
                                            {chem.product_id.product_name.product_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="left">{chem.dcr_id.dcr.visited_chemist.chemist_name.chemist_name}</TableCell>
                                    <TableCell align="left">{chem.select_the_stockist.stockist_name.stockist_name}</TableCell>
                                    <TableCell align="left">Rs. {parseInt(chem.ordered_quantity) * parseInt(chem.product_id.product_name.product_price_per_strip_in_mrp)}</TableCell>
                                    <TableCell align="left">{chem.ordered_quantity}</TableCell>
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