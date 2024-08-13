import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import {
    useGetDoctorsSpecializationQuery,
} from '../../../../api/MPOSlices/DoctorSlice'
import Cookies from 'js-cookie'


const SpecializationCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetDoctorsSpecializationQuery(Cookies.get('company_id'));
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Total Specializations: {data?.length}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Specializations</Typography>}
        </>
    )
}

export default React.memo(SpecializationCount)