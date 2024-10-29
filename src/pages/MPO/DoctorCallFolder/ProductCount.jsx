import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllProductsQuery } from '@/api/MPOSlices/ProductSlice';
import { useSelector } from 'react-redux';

const ProductCount = () => {
    const { company_id, user_role, company_division_name } = useSelector((state) => state.cookie);

    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the products
    const { data } = useGetAllProductsQuery({ id: company_id, page: page, division_name: user_role === 'admin' ? "" : company_division_name }, {
        skip: !company_id || !user_role || !company_division_name
    });
    return (
        <>
            {
                data ?
                    <Typography style={{ fontSize: "18px", fontWeight: '600' }} >
                        Total Products: {data.count}
                    </Typography> : <Typography style={{ fontSize: "18px", fontWeight: '600' }}>Products</Typography>}
        </>
    )
}

export default React.memo(ProductCount)