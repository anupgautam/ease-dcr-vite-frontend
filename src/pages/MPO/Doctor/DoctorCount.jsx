import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllDoctorsQuery } from "../../../api/MPOSlices/DoctorSlice"
import { useSelector } from 'react-redux';


const DoctorCount = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetAllDoctorsQuery({ id: company_id, page: page, mpo_name: user_role === 'admin' ? "" : company_user_id });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Total Doctors: {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Doctors</Typography>}
        </>
    )
}

export default React.memo(DoctorCount)