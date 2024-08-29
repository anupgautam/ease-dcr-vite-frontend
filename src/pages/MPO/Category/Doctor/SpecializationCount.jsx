import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import {
    useGetDoctorsSpecializationQuery,
} from '../../../../api/MPOSlices/DoctorSlice'
import { useSelector } from 'react-redux';


const SpecializationCount = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    const { data } = useGetDoctorsSpecializationQuery(company_id);
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