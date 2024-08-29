import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetUploadQuery } from '../../../api/Uploads/uploadApiSlice'
import { useSelector } from 'react-redux';


const UploadCount = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the uploads
    const { data } = useGetUploadQuery({ page: page, id: company_id });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: "600" }}>
                        Total Uploads: {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: "600" }}>Upload Count</Typography>}
        </>
    )
}

export default React.memo(UploadCount)