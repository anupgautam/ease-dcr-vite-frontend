import React from 'react'
// @mui
import {
    Stack,
    Container,
    Grid,
    Box
} from '@mui/material';

import CollectionsCount from './CollectionsCount';
import CollectionsSearch from './CollectionsSearch';
import AddCollections from './AddCollections';

const ListOfCollections = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <CollectionsCount />
                        </Grid>
                        <Grid item xs={2}>
                            <Box style={{ float: "right" }}>
                                <AddCollections />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <CollectionsSearch />
            </Container>
        </>
    )
}

export default ListOfCollections