import React from 'react'
import ListOfSales from './ListOfSales'
import { Typography, Box } from '@mui/material';

const ListOfSalesController = () => {
    return (
        <>
            <Box style={{ marginBottom: '30px' }}>
                <Typography style={{ fontWeight: '600', fontSize: '20px' }}>
                    Sales
                </Typography>
            </Box>
            <ListOfSales />
        </>
    )
}

export default ListOfSalesController
