import React from 'react'
// @mui
import {
    Stack,
    Container,
    Grid,
    Box
} from '@mui/material';


import SecondarySalesSearch from './SecondarySalesSearch';


const ListOfSecondarySales = () => {
    return (
        <>
            {/* <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <SecondarySalesCount />
                        </Grid>
                    </Grid>
                </Box>
                <SecondarySalesSearch />
            </Container> */}
            <SecondarySalesSearch />
        </>
    )
}

export default React.memo(ListOfSecondarySales)