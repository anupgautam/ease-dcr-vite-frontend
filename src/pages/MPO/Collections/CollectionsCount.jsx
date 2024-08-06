import React, { useState } from 'react'
import { Typography } from '@mui/material';
import { useGetAllCollectionsQuery } from '@/api/MPOSlices/CollectionsApiSlice';


const CollectionsCount = () => {
    const [page, setPage] = useState(1)
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }

    // !  Get all the chemists
    const { data } = useGetAllCollectionsQuery(page)
    return (
        <>
            {
                data ?
                    <Typography style={{fontSize:'18px',fontWeight:'600'}}>
                        Collections Count {data.count}
                    </Typography> : <Typography style={{fontSize:'18px',fontWeight:'600'}}>Collections Count</Typography>}
        </>
    )
}

export default CollectionsCount