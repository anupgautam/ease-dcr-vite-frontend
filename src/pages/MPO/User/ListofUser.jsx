import React from 'react'
import {
    Container,
    Grid,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow
} from '@mui/material';
import Cookies from 'js-cookie'
import UserCount from './UserCount';
import UserSearch from './UserSearch';
import AddUser from './AddUser';
import {
    useGetAllDefaultUsersQuery,
} from '@/api/CompanySlices/companyUserRoleSlice';
import ExportToExcel from '@/reusable/utils/exportSheet';

const ListofUser = () => {
    // ! Get all users wala
    const { data } = useGetAllDefaultUsersQuery({ company_name: Cookies.get('company_id') });

    const headers = [
        { label: 'S.No.', key: 'sno' },
        { label: 'First Name', key: 'first_name' },
        { label: 'Middle Name', key: 'middle_name' },
        { label: 'Last Name', key: 'last_name' },
        { label: 'Company Name', key: 'company_name' },
        { label: 'Email', key: 'email' },
        { label: 'Head Quarter', key: 'head_quarter' },
        { label: 'Phone Number', key: 'phone_number' },
        { label: 'Role', key: 'role_name' },
    ];

    const templateData = data?.map((values, index) => ({
        sno: index + 1,
        first_name: values?.user_name?.first_name,
        middle_name: values?.user_name?.middle_name,
        last_name: values?.user_name?.last_name,
        company_name: values?.company_name?.company_name,
        email: values?.user_name?.email,
        head_quarter: values?.company_area?.company_area,
        phone_number: values?.user_name?.phone_number,
        role_name: values?.role_name?.role_name_value
    }))



    const data1 = () => {
        return (
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#2e8960" }}>
                            {
                                headers.map((key, index) => (
                                    <TableCell style={{ color: "white" }} key={index}>
                                        {key.label}
                                    </TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        )
    }



    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <UserCount />
                            </Box>
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: 'right' }}>
                                {data ?
                                    <>
                                        <ExportToExcel headers={headers} fileName={'UserLists'} data={templateData} />
                                    </> : <></>}
                            </Box>
                        </Grid>
                        <Grid item xs={1}>
                            <Box style={{ float: 'right' }}>
                                <AddUser />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <UserSearch />
            </Container>
        </>
    )
}


export default React.memo(ListofUser);