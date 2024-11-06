import React from 'react'
import {
    Container,
    Grid, Typography
} from '@mui/material';
import DefaultCompanyUsers from './DefaultCompanyUsers';

const ListOfCompanyWiseUsers = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={9}>
                        <Typography style={{ fontSize: '18px', fontWeight: '600' }}>
                            Company Name
                        </Typography>
                    </Grid>
                    {/* <Grid item xs={3}>
                        <Grid container>
                            <Grid item xs={3.5}>
                            </Grid>
                            <Grid item xs={8.5}>
                                <Box style={{ textAlign: "right", marginBottom: "20px" }}>
                                    <AddCompanyUsers />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid> */}
                </Grid>
                <DefaultCompanyUsers />
            </Container>
        </>
    )
}

export default React.memo(ListOfCompanyWiseUsers)