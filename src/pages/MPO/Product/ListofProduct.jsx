import React from 'react'
import {
    Stack,
    Container,
    Grid,
    Box
} from '@mui/material';

import ProductCount from './ProductCount';
import ProductSearch from './ProductSearch';
import AddProduct from './AddProduct';
import ExportProduct from './exportProduct';
import Cookies from 'js-cookie';

const ListofProduct = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={1}>
                        <Grid item xs={9}>
                            <ProductCount />
                        </Grid>
                        <Grid item xs={2}>
                            {
                                Cookies.get('user_role') === 'admin' &&
                                <Box style={{ float: "right" }}>
                                    <ExportProduct />
                                </Box>
                            }
                        </Grid>
                        <Grid item xs={1}>
                            {
                                Cookies.get('user_role') === 'admin' &&
                                <Box style={{ float: "right" }}>
                                    <AddProduct />
                                </Box>
                            }
                        </Grid>
                    </Grid>
                </Box>
                <ProductSearch />
            </Container>
        </>
    )
}

export default React.memo(ListofProduct)