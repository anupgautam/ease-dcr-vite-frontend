import React, { useState, useCallback } from 'react';
import {
    Card,
    Table,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    Pagination,
    Box,
} from '@mui/material';

import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const TABLE_HEAD = [
    { id: 'stockist_name', label: 'Stockist Name', alignRight: false },
    { id: 'ordered_product', label: 'Product Name', alignRight: false },
    { id: 'ordered_quantity', label: 'Ordered Quantity', alignRight: false },
    { id: '' },
];

const DefaultStockistOrderedProduct = ({ data }) => {
    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e?.target?.ariaLabel
        let thisArray = data?.split(" ")
        setPage(thisArray[3]);
    }, [])

    return (
        <>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 600 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                <>
                                    {
                                        data?.length === 0 ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow key={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                        {/* <TableCell><Skeleton /></TableCell> */}
                                                        {/* <TableCell><Skeleton /></TableCell> */}
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{data && data?.map((key, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={key?.stockist_name}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                                        <Typography variant="subtitle2" noWrap>
                                                            {key?.stockist_name}
                                                        </Typography>
                                                        {/* </Stack> */}
                                                    </TableCell>
                                                    <TableCell align="left">{key?.ordered_product}</TableCell>
                                                    <TableCell align="left">{key?.ordered_quantity}</TableCell>
                                                </TableRow>
                                            ))
                                            }
                                            </>}
                                </>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                {/* //!pagination */}
                <Box justifyContent={'center'} alignItems='center' display={'flex'}
                    sx={{ margin: "20px 0px" }} >
                    {data && typeof data?.count === 'number' ?
                        <Pagination
                            count={parseInt(data?.count / 8) + 1}
                            onChange={handleChangePage}
                        /> : <></>}
                </Box>
            </Card>
        </>
    )
}

export default React.memo(DefaultStockistOrderedProduct)