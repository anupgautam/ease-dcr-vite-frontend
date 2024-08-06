import React from 'react'
import {
    Container,
    Grid,
    Box
} from '@mui/material';

import UploadCount from './UploadCount';
import UploadSearch from './UploadSearch';
import AddUpload from './addUpload';
import Cookies from 'js-cookie';

const ListOfUpload = () => {
    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container>
                        <Grid item xs={10}>
                            <UploadCount />
                        </Grid>
                        <Grid item xs={2}>
                            {
                                Cookies.get('user_role') === 'MPO' &&
                                <Box style={{ float: 'right' }}>
                                    <AddUpload />
                                </Box>
                            }
                        </Grid>
                    </Grid>
                    <UploadSearch />
                </Box>
            </Container>
        </>
    )
}

export default React.memo(ListOfUpload)