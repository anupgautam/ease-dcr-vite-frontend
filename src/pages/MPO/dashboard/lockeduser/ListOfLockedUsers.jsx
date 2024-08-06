import React from 'react'
// @mui
import {
    Stack,
    Container,
    Grid, Box
} from '@mui/material';

import FilteredLockedUsers from './FilteredLockedUsers';
import ListOfLockedUsersCount from './ListOfLockedUsersCount';
import AddUserLockedDay from './addUserLockedDay';

const ListOfLockedUsers = () => {
    return (
        <>
            <Container>
                <Grid container>
                    <Grid item xs={10}>
                        <ListOfLockedUsersCount />
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container>
                            <Grid item xs={2}>
                            </Grid>
                            <Grid item xs={10}>
                                <Box style={{ alignSelf: 'flex-end' }}>
                                    <AddUserLockedDay />
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <FilteredLockedUsers />
            </Container>
        </>
    )
}

export default React.memo(ListOfLockedUsers);