import { Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useRef } from "react";

export default function ChatContainer({ messages }) {
    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const id = Cookies.get('user');
    
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

