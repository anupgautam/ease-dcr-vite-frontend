import { Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

import { useSelector } from 'react-redux';

const ChatTestMessage = ({ messages }) => {

    const { company_id, user_role, company_user_role_id, user } = useSelector((state) => state.cookie);

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const id = company_user_role_id;

    console.log(messages);

    // const chatData = messages.filter(data => data.chat_from === company_user_role_id);
    return (
        <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">


                    {/*//! Conversation  */}

                    {messages &&
                        messages.map((message, index) => {
                            {/* const isSender = message.chat_from === company_user_role_id; */ }

                            return (
                                <div
                                    key={index}
                                >
                                    <div style={message.chat_from == id ? { marginTop: '10px', marginRight: '10px', marginBottom: '10px' } : { marginTop: '10px', marginBottom: '10px' }}>
                                        <div className={message.chat_from == id ? "content" : "content1"}>
                                            <span className={message.chat_from == id ? "content-sended " : "content-recieved "}>{message.message}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}


                    {/*//* Right  */}
                    {/* <div className="col-start-6 col-end-13 p-3 rounded-lg">
                        <div className="flex items-center justify-start flex-row-reverse">
                            <div
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                            >
                                A
                            </div>
                            <div
                                className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl"
                            >
                                <div>I'm ok what about you?</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-start-1 col-end-8 p-3 rounded-lg">
                        <div className="flex flex-row items-center">
                            <div
                                className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"
                            >
                                A
                            </div>
                            <div
                                className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"
                            >
                                <div>Hey How are you today?</div>
                            </div>
                        </div>
                    </div> */}





                </div>
            </div>
        </div >
    )
}
export default ChatTestMessage