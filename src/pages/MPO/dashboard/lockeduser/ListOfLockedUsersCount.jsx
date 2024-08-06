import React, { useState,useCallback } from 'react'
import { Typography } from '@mui/material';
import {
    useGetLockedUsersQuery,
} from '@/api/MPOSlices/TourPlanSlice.js';
import Cookies from 'js-cookie'


const ListOfLockedUsersCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    },[])

    // !  Get all the company areas
    const { data } = useGetLockedUsersQuery(Cookies.get('company_id'));

    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600', marginBottom: "20px" }}>
                        Locked Users 
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>Locked Users</Typography>}
        </>
    )
}

export default React.memo(ListOfLockedUsersCount)