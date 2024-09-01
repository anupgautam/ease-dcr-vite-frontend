import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import {
    useAreaMPOQuery,
} from '@/api/MPOSlices/TourPlanSlice.js';
import { useSelector } from 'react-redux';


const MPOAreasCount = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the company areas
    const { data } = useAreaMPOQuery({ company_name: company_id, mpo_name: user_role === 'admin' ? "" : company_user_id },
        {
            skip: !company_id || !user_role || !company_user_id,
        }
    );
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                        Total MPO Areas: {data?.length}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>MPO Areas</Typography>}
        </>
    )
}

export default React.memo(MPOAreasCount)