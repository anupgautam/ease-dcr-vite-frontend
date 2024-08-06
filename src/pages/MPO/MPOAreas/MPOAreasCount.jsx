import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import {
    useAreaMPOQuery,
} from '@/api/MPOSlices/TourPlanSlice.js';
import Cookies from 'js-cookie'


const MPOAreasCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the company areas
    const { data } = useAreaMPOQuery({ company_name: Cookies.get('company_id'), mpo_name: Cookies.get('user_role') === 'admin' ? "" : Cookies.get('company_user_id') });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                        MPO Areas {data?.length}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>MPO Areas</Typography>}
        </>
    )
}

export default React.memo(MPOAreasCount)