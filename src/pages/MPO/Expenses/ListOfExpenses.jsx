import { useState, useEffect } from 'react';
import {
    Card,
    FormControl,
    Box,
    Grid,
    Container
} from '@mui/material';
import { useTheme } from "@mui/material/styles";
import Controls from '@/reusable/forms/controls/Controls';
import { useGetAllCompanyUserRoleByRoleNameQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import DefaultExpenses from './DefaultExpenses';

const ExpensesList = () => {
    const getAllCompanyUser = useGetAllCompanyUserRoleByRoleNameQuery('mpo')
    const [companyUserList, setCompanyUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    

    useEffect(() => {
        let dataList = []
        if (getAllCompanyUser?.data) {
            getAllCompanyUser.data.map((key) => {
                dataList.push({ id: key.id, title: key.user_name.first_name + " " + key.user_name.last_name })
            })
        }
        setCompanyUserList(dataList);
    }, [getAllCompanyUser])
    

    const Year = [
        { id: '2023', title: '2023' },
        { id: '2024', title: '2024' },
        { id: '2025', title: '2025' },
        { id: '2026', title: '2026' },
        { id: '2027', title: '2027' },
        { id: '2028', title: '2028' },
        { id: '2029', title: '2029' },
        { id: '2030', title: '2030' },
        { id: '2031', title: '2031' },
        { id: '2032', title: '2032' },
        { id: '2033', title: '2033' }]
    const Month = [
        { id: "January", title: 'January' },
        { id: "February", title: 'February' },
        { id: 'March', title: 'March' },
        { id: 'April', title: 'April' },
        { id: 'May', title: 'May' },
        { id: 'June', title: 'June' },
        { id: 'July', title: 'July' },
        { id: 'August', title: 'August' },
        { id: 'September', title: 'September' },
        { id: 'October', title: 'October' },
        { id: 'November', title: 'November' },
        { id: 'December', title: 'December' }]

    const theme = useTheme();

    return (
        <>
            <Container>
                <Card>
                    <Box style={{ padding: "20px" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <FormControl>

                                    <Controls.Select
                                        labelId="mpo-select-label"
                                        id="mpo-select"
                                        options={companyUserList}
                                        onChange={(e) => { setSelectedUser(e.target.value) }}
                                        label="User Name"
                                    />
                                </FormControl>
                            </Grid>

                            <Grid item xs={2}>

                            </Grid>
                            <Grid item xs={2}>
                                <FormControl>

                                    <Controls.Select
                                        labelId="mpo-select-label"
                                        id="mpo-select"
                                        options={Year}
                                        onChange={(e) => { setSelectedYear(e.target.value) }}
                                        label="Year"
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>
                                <FormControl>

                                    <Controls.Select
                                        labelId="mpo-select-label"
                                        id="mpo-select"
                                        options={Month}
                                        onChange={(e) => { setSelectedMonth(e.target.value) }}
                                        label="Month"
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Box>
                    <DefaultExpenses
                        user={21}
                        year={selectedYear}
                        month={selectedMonth} />

                </Card>
                {/* <Card>
            <Scrollbar>
                        <TableContainer>
                        <Table>
                                <TableBody>
                                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        const { id, name, role, status, company, avatarUrl, isVerified } = row;
                                        const selectedUser = selected.indexOf(name) !== -1;

                                        return (
                                            <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                                                </TableCell>
                                                <TableCell component="th" scope="row" padding="none">
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar alt={name} @={avatarUrl} />
                                                        <Typography variant="subtitle2" noWrap>
                                                            {name}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>

                                                <TableCell align="left">{company}</TableCell>

                                                <TableCell align="left">{role}</TableCell>

                                                <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell>

                                                <TableCell align="left">
                                                    <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label>
                                                </TableCell>

                                                <TableCell align="right">
                                                    <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                                                        <Iconify icon={'eva:more-vertical-fill'} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>

                                {isNotFound && (
                                    <TableBody>
                                        <TableRow>
                                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                <Paper
                                                    sx={{
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    <Typography variant="h6" paragraph>
                                                        Not found
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        No results found for &nbsp;
                                                        <strong>&quot;{filterName}&quot;</strong>.
                                                        <br /> Try checking for typos or using complete words.
                                                    </Typography>
                                                </Paper>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )}
                            </Table>
                        </TableContainer>
                    </Scrollbar>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={USERLIST.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Card> */}

            </Container>
        </>
    )
}

export default ExpensesList;