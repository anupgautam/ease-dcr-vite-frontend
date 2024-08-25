import { useState, useEffect, useContext } from 'react';
import {
    Card,
    Table,
    Stack,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
    Pagination,
    Box,
} from '@mui/material';
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Scrollbar from '@/components/iconify/Iconify';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useGetAllDetailedExpensesMutation } from '@/api/ExpensesSlices/expensesSlices';
import { CookieContext } from '@/App'


const TABLE_HEAD = [
    { id: 'date', label: 'Date', alignRight: false },
    { id: 'area_expenses', label: 'Area Expenses', alignRight: false },
    { id: 'miscellaneous_expenses', label: 'Miscellaneous Expenses', alignRight: false },
    { id: 'shift', label: 'Shift', alignRight: false },
    { id: '' },
];

const DefaultExpenses = ({ user, year, month }) => {
    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    //! For drawer 
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [expenses, setExpenses] = useState([]);

    const [detailedExpenses] = useGetAllDetailedExpensesMutation();

    useEffect(() => {
        detailedExpenses({ 'mpo_name': user, 'company_name': company_id, 'year': year, 'month': month }).then(
            (res) => {

                setExpenses(res.data)
            })

    }, [user, year, month])

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    //!Pagination logic
    const [page, setPage] = useState(1)
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }
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
                                        expenses.length === 0 ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow id={key} >
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
                                            <>{expenses && expenses.results.map((expense, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={expense.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" padding="none">
                                                        <Stack direction="row" alignItems="center" spacing={2}>
                                                            <Typography variant="subtitle2" noWrap>
                                                                {expense.date}
                                                            </Typography>
                                                        </Stack>
                                                    </TableCell>
                                                    <TableCell align="left">{expense.area_expenses}</TableCell>
                                                    <TableCell align="left">{expense.miscellaneous_expenses}</TableCell>
                                                    <TableCell align="left">{expense.shift}</TableCell>
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
                    {expenses ?
                        <Pagination
                            count={parseInt(expenses.count / 8) + 1}
                            onChange={handleChangePage}
                        /> : <></>}
                </Box>
            </Card>
        </>
    )
}

export default DefaultExpenses