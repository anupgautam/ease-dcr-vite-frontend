import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { BiChevronDown } from "react-icons/bi";
import { useGetAdminsQuery } from "../api/newChatSlices/adminSlices";

const AdminUserList = () => {
    const adminList = useGetAdminsQuery("adminsQuery");

    const handleUser = (e, id) => {

    }
    return (
        <Box>
            {
                adminList?.data?.ids.map((key) => (
                    <div className="chat-main-list-design" onClick={(event) => handleUser(event, adminList.data.entities[key].user_id.id)}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Typography className="user-icon-design">{adminList.data.entities[key].user_id.first_name.charAt(0)} {adminList.data.entities[key].user_id.last_name.charAt(0)}</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography style={{ fontSize: '15px', color: "black", fontWeight: "600", marginTop: '8px', marginLeft: '4px' }}>{adminList.data.entities[key].user_id.first_name}  {adminList.data.entities[key].user_id.last_name}</Typography>
                            </Grid>
                        </Grid>
                    </div>
                ))
            }
        </Box>
    )
}

export default AdminUserList;