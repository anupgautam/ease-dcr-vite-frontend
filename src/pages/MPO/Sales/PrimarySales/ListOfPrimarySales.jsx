import React from 'react'
// @mui
import {
    Stack,
    Container,
    Grid,
    Box
} from '@mui/material';

import PrimarySalesCount from './PrimarySalesCount';
import PrimarySalesSearch from './PrimarySalesSearch';
import AddPrimarySales from './AddPrimarySales';

const ListOfPrimarySales = () => {

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <PrimarySalesCount />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <PrimarySalesSearch />
        </>
    )
}

export default React.memo(ListOfPrimarySales)