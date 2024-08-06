import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllDoctorsQuery } from "../../../api/MPOSlices/DoctorSlice"
import Cookies from 'js-cookie'


const DoctorCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetAllDoctorsQuery({ id: Cookies.get("company_id"), page: page, mpo_name: Cookies.get('user_role') === 'admin' ? "" : Cookies.get('company_user_id') });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Doctors {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Doctors</Typography>}
        </>
    )
}

export default React.memo(DoctorCount)