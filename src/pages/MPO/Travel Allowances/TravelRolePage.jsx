
import {
    Badge,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    IconButton,
    TableContainer,
} from "@mui/material";
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import Scrollbar from "@/components/scrollbar/Scrollbar";
import { UserListHead } from "../../../sections/@dashboard/user";
import { useGetAllCompanyUsersWithoutPaginationQuery } from "../../../api/CompanySlices/companyUserRoleSlice";

const TABLE_HEAD = [
    { id: 'user_name', label: 'User Name', alignRight: false },
    { id: 'head_quarter', label: 'Head Quarter', alignRight: false },
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: 'date_of_joining', label: 'Date of Joining', alignRight: false },
    // { id: 'dcr_feeded', label: 'DCR Feeded', alignRight: false },
    // { id: 'dcr_pending', label: 'DCR Pending', alignRight: false },
    { id: 'summary', label: 'Remark', alignRight: false },
];

const TravelRolePage = () => {
    const { company_id } = useSelector((state) => state.cookie);

    const userList = useGetAllCompanyUsersWithoutPaginationQuery({ id: company_id })
    console.log(userList?.data?.results)

    return (
        <>
            <Scrollbar>
                <TableContainer sx={{ minWidth: 900 }}>
                    <Table>
                        <UserListHead headLabel={TABLE_HEAD} />
                        <TableBody>
                            {
                                userList?.data?.results?.map((usersearch, index) => (
                                    <TableRow hover tabIndex={-1} key={`${usersearch.id}-${index}`}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell component="th" scope="row" align="left" >
                                            {/* <Stack direction="row" alignItems="center" spacing={2}> */}
                                            <Typography variant="subtitle2" noWrap>
                                                {usersearch.user_name.first_name + " " + usersearch.user_name.middle_name + " " + usersearch.user_name.last_name}
                                            </Typography>
                                            {/* </Stack> */}
                                        </TableCell>
                                        <TableCell align="left">{usersearch.company_area.company_area}</TableCell>
                                        <TableCell align="left">{usersearch.role_name.role_name_value}</TableCell>
                                        <TableCell align="left">
                                            {new Date(usersearch.user_name.date_of_joining).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </TableCell>
                                        {/* <TableCell align="left">{usersearch.dcr_feeded}</TableCell> */}
                                        {/* <TableCell align="left">{usersearch.dcr_pending}</TableCell> */}
                                        <TableCell align="left">
                                            <Link to={`/dashboard/admin/expenses/user?id=${usersearch.id}&role=${usersearch.role_name.role_name.role_name}`}>
                                                <Button>Summary</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Scrollbar>

        </>
    )
}
export default TravelRolePage