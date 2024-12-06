import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { TableRow, TableCell, Typography } from '@mui/material';
import { useGetAllcompanyUserRolesQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UserRow from './UserRow';
import PaginationControl from './PaginationControl';
import MessageNotification from './MessageNotification';
import { useSelector } from 'react-redux';

const DefaultUser = ({ filterValue, handleChangeStatus, UserLogin }) => {
    const { company_id } = useSelector((state) => state.cookie);
    const [page, setPage] = useState(1);
    const [openDialogues, setOpenDialogues] = useState({});
    const [SuccessMessage, setSuccessMessage] = useState({ show: false, message: '' });
    const [ErrorMessage, setErrorMessage] = useState({ show: false, message: '' });


    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel;
        let thisArray = data.split(" ");
        setPage(thisArray[3]);
    }, []);

    const { data, refetch, isFetching, isLoading, error } = useGetAllcompanyUserRolesQuery(
        { company_name: company_id, page: page, is_active: filterValue },
        {
            skip: !company_id || !page
        }
    );



    const totalPages = useMemo(() => Math.ceil((data?.count || 0) / 200), [data]);

    return (
        <>
            {data ? (
                <>
                    {data?.results?.map((user, index) => (
                        <UserRow
                            key={user.id}
                            user={user}
                            UserLogin={UserLogin}
                            index={index}
                            handleChangeStatus={handleChangeStatus}
                            handleClickOpen={(userId) => setOpenDialogues((prev) => ({ ...prev, [userId]: true }))}
                            openDialogues={openDialogues}
                            handleClose={() => setOpenDialogues({})}
                            UserLocks={() => setSuccessMessage({ show: true, message: 'User Unlocked' })}
                        />
                    ))}
                    <PaginationControl
                        totalPages={totalPages}
                        page={page}
                        handleChangePage={handleChangePage}
                        loading={false}
                    />
                </>
            ) : (
                <Skeleton />
            )}

            {SuccessMessage.show && <MessageNotification message={SuccessMessage.message} type="success" />}
            {ErrorMessage.show && <MessageNotification message={ErrorMessage.message} type="error" />}
        </>
    );
};

export default React.memo(DefaultUser);
