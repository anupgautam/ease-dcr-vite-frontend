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
import { useSelector } from 'react-redux';
import DefaultList from './DefaultList';

const ListofProduct = () => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

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
                                    user_role === 'admin' &&
                                    <ExportProduct />
                                }
                                {
                                    user_role === 'admin' &&
                                    <AddProduct />
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
                <DefaultList/>
            </Container>
        </>
    )
}

export default React.memo(ListofProduct)