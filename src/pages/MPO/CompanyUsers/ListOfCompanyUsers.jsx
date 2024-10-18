import React from 'react'
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';
import DefaultList from './DefaultList'
import AddCompanyUsers from './AddCompanyUsers';

const ListOfCompanyUsers = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={9}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Company Users
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container>
                            <Grid item xs={3.5}>
                            </Grid>
                            <Grid item xs={8.5}>
                                <Box style={{ textAlign: "right", marginBottom: "20px" }}>
                                    <AddCompanyUsers />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <DefaultList />
            </Container>
        </>
    )
}

export default React.memo(ListOfCompanyUsers)