import React from "react";
import { useGetAllUsersQuery, useGetAllUsersWithoutPaginationQuery } from "../api/MPOSlices/UserSlice";
import { useGetGroupWsConnectionMutation } from "../api/newChatSlices/groupSlice";
import { Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSelector } from 'react-redux';


const EventUserList = ({ setGroupName, setUserId }) => {
    const { company_id, user_role, company_user_id } = useSelector((state) => state.cookie);

    const userList = useGetAllUsersWithoutPaginationQuery(company_id);
    const [getUserWSConnection] = useGetGroupWsConnectionMutation();
    
    const handleUser = (id) => {
        setUserId(id);
        getUserWSConnection({
            'id': id
        }).then((res) => {
            setGroupName(res.data.data[0])
        })
    }
    return (
        <>
            {
                userList && userList?.data?.map((key, index) => (
                    <div className="chat-main-list-design" onClick={(event) => handleUser(key.user_name.id)}>
                        <Grid container spacing={2}>
                            <Grid item xs={2}>
                                <Typography className="user-icon-design">{key.user_name.first_name.charAt(0)} {key.user_name.last_name.charAt(0)}</Typography>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography style={{ fontSize: '15px', color: "black", fontWeight: "600", marginTop: '8px', marginLeft: '13px' }}>{key.user_name.first_name} {key.user_name.last_name} </Typography>
                            </Grid>
                        </Grid>
                    </div>
                ))
            }
        </>
    )
}

export default EventUserList;