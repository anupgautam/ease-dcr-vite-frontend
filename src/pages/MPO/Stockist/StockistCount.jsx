import React, { useState } from 'react'
import { Typography } from '@mui/material';
import { useGetAllStockistsQuery } from '@/api/MPOSlices/StockistSlice';
import Cookies from 'js-cookie'
import { useGetcompanyUserRolesByIdQuery } from '@/api/CompanySlices/companyUserRoleSlice';


const StockistCount = () => {
    const [page, setPage] = useState(1)
    
    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }

    // !  Get all the stockist
    const { data: CompanyAreaId } = useGetcompanyUserRolesByIdQuery(Cookies.get('company_user_id'));
    const { data } = useGetAllStockistsQuery({ id: Cookies.get('company_id'), page: page, company_area: Cookies.get('user_role') === 'admin' ? "" : CompanyAreaId?.company_area?.id });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: "600" }}>
                        Total Stockists: {data.count}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: "600" }}>Stockists</Typography>}
        </>
    )
}

export default React.memo(StockistCount)