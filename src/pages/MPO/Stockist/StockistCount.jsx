import React, { useState } from 'react'
import { Typography } from '@mui/material';
import { useGetAllStockistsQuery } from '@/api/MPOSlices/StockistSlice';
import { useGetcompanyUserRolesByIdQuery } from '@/api/CompanySlices/companyUserRoleSlice';
import { useSelector } from 'react-redux';


const StockistCount = () => {
    const { company_id, user_role, company_user_role_id } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = (e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }

    // !  Get all the stockist
    const { data: CompanyAreaId } = useGetcompanyUserRolesByIdQuery(company_user_role_id, {
        skip: !company_user_role_id
    });

    const { data } = useGetAllStockistsQuery({ id: company_id, page: page, company_area: user_role === 'admin' ? "" : CompanyAreaId?.company_area?.id }, {
        skip: !company_id || !page || !user_role
    });
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