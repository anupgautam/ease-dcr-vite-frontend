import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import React, { useState, useEffect, useMemo, useCallback, useContext } from 'react';
// @mui
import {
    Card,
    Grid,
    Badge,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TextField,
    TableBody,
    InputAdornment,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Pagination,
    Box,
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import { Search } from '@mui/icons-material';
import { Clear } from '@mui/icons-material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// components
import Iconify from '@/components/iconify/Iconify';
import Label from '@/components/iconify/Iconify';
import Scrollbar from '@/components/iconify/Iconify';
// sections
import { UserListHead, UserListToolbar } from '../../../sections/@dashboard/user';
// mock
import USERLIST from '../../../_mock/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import SearchIcon from '@mui/icons-material/Search';
// import {
//     useGetApplicationsQuery,
//     useGetApplicationsByIdQuery,
//     useDeleteApplicationsByIdMutation,
//     useUpdateApplicationsMutation,
//     useSearchApplicationQuery
// } from '@/api/ApplicationSlices/ApplicationSlices';
import {
    useSearchSaleMutation
} from '@/api/SalesApiSlices/SalesApiSlices'
import {
    AppNewsUpdate,
} from '../../../sections/@dashboard/app';
import { CookieContext } from '@/App'


const TABLE_HEAD = [
    { id: 'user', label: 'User', alignRight: false },
    { id: 'sales', label: 'Sales', alignRight: false },
    { id: '' },
];

const DefaultSalesList = () => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const eightArrays = [0, 1, 2, 3, 4, 5, 6, 7]

    const [getSalesList] = useSearchSaleMutation();
    const companyId = parseInt(company_id);
    const [salesResults, setSalesResults] = useState([])

    useEffect(() => {
        getSalesList({ 'company_id': companyId }).then((res) => {
            setSalesResults(res)
        })
    }, [companyId])


    const [open, setOpen] = useState(false);
    return (
        <>
            <Card>
                <Scrollbar>
                    <TableContainer sx={{ minWidth: 400 }}>
                        <Table>
                            <UserListHead
                                headLabel={TABLE_HEAD}
                            />
                            <TableBody>
                                <>
                                    {
                                        salesResults === undefined ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow id={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{salesResults && salesResults?.data?.user_wise_sales?.map((sales, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={sales.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {sales.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left" color="green"> ₹ {sales.sales}</TableCell>
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
                <Box justifyContent={'center'} alignItems='right' display={'flex'}
                    sx={{ margin: "20px 0px" }
                    }>
                    {
                        salesResults?.data ?
                            <Typography justifyContent={'right'} alignItems="right" variant="subtitle1" color="green" noWrap>
                                Total Sales ₹ {salesResults?.data?.total_sales}
                            </Typography> : <>Sales Results Data</>}
                </Box>

            </Card>
        </>
    )
}

export default React.memo(DefaultSalesList);