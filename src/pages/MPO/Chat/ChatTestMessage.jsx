import { Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

import { useSelector } from 'react-redux';

const ChatTestMessage = ({ messages }) => {

    const { company_id, user_role, company_user_role_id, user } = useSelector((state) => state.cookie);

    const scrollRef = useRef();
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    return (
        <div className="flex flex-col h-full overflow-x-auto mb-4">
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-12 gap-y-2">
                    {
                        messages && messages.map((data, index) => {
                            const dataCondition = Number(company_user_role_id) === Number(data.chat_from);
                            return (
                                <div className={dataCondition ? "col-start-6 col-end-13 p-3 rounded-lg" : "col-start-1 col-end-8 p-3 rounded-lg"} key={index}>
                                    <div className={dataCondition ? "flex items-center justify-start flex-row-reverse" : "flex flex-row items-center"}>
                                        <div
                                            className={dataCondition ? "flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0" : "flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0"}
                                        >
                                            A
                                        </div>
                                        <div
                                            className={dataCondition ? "relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl" : "relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl"}
                                        >
                                            <div>{data.chat_message}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div >
    )
}
export default ChatTestMessage