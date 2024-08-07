import React from 'react'
import {
    Container,
    Grid,
    Box,
    Stack,
    useMediaQuery,
    useTheme
} from '@mui/material';

import UploadCount from './UploadCount';
import UploadSearch from './UploadSearch';
import AddUpload from './addUpload';
import Cookies from 'js-cookie';

const ListOfUpload = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Container>
                <Box style={{ marginBottom: '30px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={9}>
                            <Box style={{ marginTop: '10px' }}>
                                <UploadCount />
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Stack
                                direction={isSmallScreen ? 'column' : 'row'}
                                spacing={2}
                                alignItems="center"
                                justifyContent="flex-end"
                            >
                                {
                                    Cookies.get('user_role') === 'MPO' &&
                                    <AddUpload />
                                }
                            </Stack>
                        </Grid>
                    </Grid>
                    <Box marginTop="20px">
                        <UploadSearch />
                    </Box>
                </Box>
            </Container>
        </>
    )
}

export default React.memo(ListOfUpload)