import React from 'react'
import {
    Container,
    Grid, Box, Typography
} from '@mui/material';
import DefaultList from './DefaultList'
import AddCompanyRoles from './AddCompanyRoles';
import FilteredCompanyRoles from './FilteredCompanyRoles';

const ListOfCompanyRoles = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={9}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Company Roles
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Grid container>
                            <Grid item xs={3.5}>
                            </Grid>
                            <Grid item xs={8.5}>
                                <Box style={{ textAlign: "right", marginBottom: "20px" }}>
                                    <AddCompanyRoles />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                {/* <DefaultList /> */}
                <FilteredCompanyRoles/>
            </Container>
        </>
    )
}

export default React.memo(ListOfCompanyRoles)