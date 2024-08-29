import React, { useState, useEffect } from 'react';
import {
    Card,
    Table,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Typography,
    TableContainer,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { UserListHead } from '../../../sections/@dashboard/user';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useSelector } from 'react-redux';

import {
    usePostAllMPONamesNoPageMutation,
} from '../../../api/MPOSlices/DoctorSlice';
import Scrollbar from '@/components/scrollbar/Scrollbar';


const TABLE_HEAD = [
    { id: 'role_name', label: 'Role Name', alignRight: false },
    { id: '' },
];

const DefaultMPONames = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    // !Get MPO Names
    const [MpoData] = usePostAllMPONamesNoPageMutation()

    const [mpoName, setMPOName] = useState('');
    const [MpoList, setMpoList] = useState([]);


    const mpoNames = [];
    if (MpoList?.length !== 0) {
        MpoList?.map((key) => {
            mpoNames.push({
                id: key.id,
                title: key.user_name.first_name + ' ' + key.user_name.last_name
            })
        })
    }

    useEffect(() => {
        if (company_id) {
            MpoData({ company_name: company_id })
                .then((res) => {
                    setMpoList(res.data);
                })
                .catch((err) => {
                })
        }
    }, [company_id])

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
                                        mpoNames.length === 0 ? <>
                                            {
                                                eightArrays.map((key) => (
                                                    <TableRow key={key} >
                                                        <TableCell><Skeleton /></TableCell>
                                                        <TableCell><Skeleton /></TableCell>
                                                    </TableRow>
                                                ))}
                                        </> :
                                            <>{mpoNames && mpoNames.map((doctorevent, index) => (
                                                <TableRow hover tabIndex={-1} role="checkbox" key={doctorevent.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell component="th" scope="row" align="left">
                                                        <Typography variant="subtitle2" noWrap>
                                                            {doctorevent.title}
                                                        </Typography>
                                                    </TableCell>
                                                    {/*//! Delete  */}
                                                    {/* <TableCell align="right">
                                                        <IconButton color={'error'} sx={{ width: 40, height: 40, mt: 0.75 }} onClick={() => { setSelectedId(doctorevent.id); handleClickOpen() }}>
                                                            <Badge>
                                                                <Iconify icon="eva:trash-2-outline" />
                                                            </Badge>
                                                        </IconButton>
                                                    </TableCell> */}
                                                    <TableCell align="left">
                                                        <Link to={`/dashboard/admin/mpo/doctorevents?id=${doctorevent.id}&role=${doctorevent.title}`}>
                                                            <Button>VIEW Events</Button>

                                                        </Link>
                                                    </TableCell>

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
            </Card>
        </>
    )
}

export default React.memo(DefaultMPONames);