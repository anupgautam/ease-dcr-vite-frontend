import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllCompanyAreaWiseExpensesQuery } from '@/api/CompanySlices/companyAreaWiseExpenses';


const CompanyAreaWiseExpenseCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the chemists
    const { data } = useGetAllCompanyAreaWiseExpensesQuery(page)
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }}>
                        Total Daily Allowances: {data.count}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>Daily Allowances Count</Typography>}
        </>
    )
}

export default React.memo(CompanyAreaWiseExpenseCount)