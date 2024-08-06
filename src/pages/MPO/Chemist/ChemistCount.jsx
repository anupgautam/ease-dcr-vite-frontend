import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllChemistsQuery } from '@/api/MPOSlices/ChemistSlice';
import Cookies from 'js-cookie'


const ChemistCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the chemists
    const { data } = useGetAllChemistsQuery({ id: Cookies.get("company_id"), page: page, mpo_name: Cookies.get('user_role') === "admin" ? "" : Cookies.get('company_user_id') });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Chemists {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Chemists</Typography>}
        </>
    )
}

export default React.memo(ChemistCount)