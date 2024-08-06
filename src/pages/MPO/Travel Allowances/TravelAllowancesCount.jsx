import React, { useCallback, useState } from 'react'
import { Typography } from '@mui/material';


const TravelAllowancesCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    return (
        <>
            <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                Allowances
            </Typography>
        </>
    )
}
export default React.memo(TravelAllowancesCount)