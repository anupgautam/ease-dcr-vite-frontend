import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetUploadQuery } from '../../../api/Uploads/uploadApiSlice'
import Cookies from 'js-cookie'


const UploadCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the uploads
    const { data } = useGetUploadQuery({ page: page, id: Cookies.get('company_id') });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: "600" }}>
                        Uploads {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: "600" }}>Upload Count</Typography>}
        </>
    )
}

export default React.memo(UploadCount)