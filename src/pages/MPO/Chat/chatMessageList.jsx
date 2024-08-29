import { Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

import { useSelector } from 'react-redux';

export default function ChatContainer({ messages }) {
    const { company_id, user_role, company_user_id,user } = useSelector((state) => state.cookie);

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const id = user;

    return (
        <div>
            <Typography style={{ fontSize: '18px', color: "black", fontWeight: "600", padding: '10px', paddingTop: '20px' }}>Message's</Typography>
            <div className="chat-messages">
                {
                    messages.map((message, index) => (
                        <div ref={scrollRef} key={index}>
                            <div style={message.initiator == id ? { marginTop: '10px', marginRight: '10px', marginBottom: '10px' } : { marginTop: '10px', marginBottom: '10px' }}>
                                <div className={message.initiator == id ? "content" : "content1"}>
                                    <span className={message.initiator == id ? "content-sended " : "content-recieved "}>{message.content}</span>
                                </div>
                            </div>
                        </div>
                    )
                    )
                }
            </div>
        </div>
    );
}

