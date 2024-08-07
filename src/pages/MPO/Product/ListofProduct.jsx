import React from 'react'
import {
    Stack,
    Container,
    Grid,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';

import ProductCount from './ProductCount';
import ProductSearch from './ProductSearch';
import AddProduct from './AddProduct';
import ExportProduct from './exportProduct';
import Cookies from 'js-cookie';

const ListofProduct = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <ProductCount />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                {
                                    Cookies.get('user_role') === 'admin' &&
                                    <ExportProduct />
                                }
                                {
                                    Cookies.get('user_role') === 'admin' &&
                                    <AddProduct />
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <ProductSearch />
            </Container>
        </>
    )
}

export default React.memo(ListofProduct)