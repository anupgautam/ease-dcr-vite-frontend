import React from 'react'
import DefaultCategory from './DefaultCategory';
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';
import AddChemistCategory from './AddChemistCategory';

const ListOfChemistCategory = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={9}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Chemist Category
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container>
                            <Grid item xs={2.2}>
                            </Grid>
                            <Grid item xs={9.8}>
                                <Box style={{ alignSelf: 'flex-end', marginBottom: "20px" }}>
                                    <AddChemistCategory />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <DefaultCategory />
            </Container>
        </>
    )
}

export default ListOfChemistCategory