import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllChemistsQuery } from '@/api/MPOSlices/ChemistSlice';
import { useSelector } from 'react-redux';


const ChemistCount = () => {
    const { company_user_role_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the chemists
    const { data } = useGetAllChemistsQuery({ id: company_user_role_id, page: page, mpo_name: user_role === "admin" ? "" : company_user_role_id });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                        Total Chemists: {data.count}
                    </Typography> : <Typography style={{ fontSize: '18px', fontWeight: '600' }}>Chemists</Typography>}
        </>
    )
}

export default React.memo(ChemistCount)