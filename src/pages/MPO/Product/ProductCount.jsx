import React, { useState, useCallback } from 'react'
import { Typography } from '@mui/material';
import { useGetAllProductsQuery } from '@/api/MPOSlices/ProductSlice';
import Cookies from 'js-cookie'


const ProductCount = () => {
    const [page, setPage] = useState(1)

    const handleChangePage = useCallback((e) => {
        const data = e.target.ariaLabel
        let thisArray = data.split(" ")
        setPage(thisArray[3]);
    }, [])

    // !  Get all the products
    const { data } = useGetAllProductsQuery({ id: Cookies.get('company_id'), page: page, division_name: Cookies.get('user_role') === 'admin' ? "" : Cookies.get('company_division_name') });
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