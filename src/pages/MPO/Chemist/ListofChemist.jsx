import React from 'react'
import {
    Stack,
    Container,
    Grid,
    Box
} from '@mui/material';

import ChemistCount from './ChemistCount';
import ChemistSearch from './ChemistSearch';
import AddChemist from './AddChemist';
import ExportChemist from './exportChemist';
import Cookies from 'js-cookie';

const ListofChemist = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={9}>
                            <ChemistCount />
                        </Grid>
                        <Grid item xs={2}>
                            {
                                Cookies.get('user_role') === 'admin' &&
                                <Box style={{ float: "right" }}>
                                    <ExportChemist />
                                </Box>
                            }
                        </Grid>
                        <Grid item xs={1}>
                            <Box style={{ float: "right" }}>
                                <AddChemist />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <ChemistSearch />
            </Container>
        </>
    )
}

export default React.memo(ListofChemist)