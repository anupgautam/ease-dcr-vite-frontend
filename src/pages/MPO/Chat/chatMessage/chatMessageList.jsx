import { Typography } from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { chatReverse } from "./chatReverse";

export default function ChatContainer({ messages, scrollRef }) {
    const data = [...new Set(chatReverse(messages).map(JSON.stringify))].map(JSON.parse);
    const id = Cookies.get('company_id');


    return (
        <div>
            <Typography style={{ fontSize: '18px', color: "black", fontWeight: "600", padding: '10px', paddingTop: '20px' }}>Message's</Typography>
            <div className="chat-messages" ref={scrollRef}>

                {
                    data.map((message, index) => (
                        <div key={index}>
                            <div style={message.initiator == id ? { marginTop: '10px', marginRight: '10px', marginBottom: '10px' } : { marginTop: '10px', marginBottom: '10px' }}>
                                <div className={message.initiator == id ? "content" : "content1"}>
                                    <span className={message.initiator == id ? "content-sended " : "content-recieved "}>{message.default === false ? message.message : message.content}</span>
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

