import React from 'react';
import { Grid, Box } from '@mui/material';

const MessageNotification = ({ message, type }) => {
    return (
        <Grid>
            <Box className={`messageContainer ${type}Message`}>
                <h1 style={{ fontSize: '14px', color: 'white' }}>{message}</h1>
            </Box>
        </Grid>
    );
};

export default React.memo(MessageNotification);
