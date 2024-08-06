import React from 'react'
import ListofLeaveUser from './ListofLeaveUser'
import { Container, Typography } from "@mui/material";

const ListofLeaveUserController = () => {
    return (
        <>
            <Container>
                <Typography
                    style={{ fontWeight: '600', fontSize: '18px' }}>
                    Users Leave
                </Typography>
            </Container>
            <ListofLeaveUser />
        </>
    )
}

export default ListofLeaveUserController