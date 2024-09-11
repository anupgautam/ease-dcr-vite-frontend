import React from 'react'
// @mui
import {
    Stack,
    Container,
    Grid,
    Box
} from '@mui/material';
import SecondarySalesCount from './SecondarySalesCount'
import SecondarySalesSearch from './SecondarySalesSearch';
import AddSecondarySales from './AddSecondarySales';


const ListOfSecondarySales = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <SecondarySalesCount />
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <SecondarySalesSearch />
        </>
    )
}

export default React.memo(ListOfSecondarySales)