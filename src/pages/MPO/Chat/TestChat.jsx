import React, { useCallback, useEffect, useRef, useState } from "react";
import { BASE_URL, WEBSOCKET_BASE_URL } from '../../../baseURL'
import connectWebSocket from "../../../reusable/utils/multipleWSConnection";
import { useDispatch } from "react-redux";
import { addData } from "../../../reducer/chatReducer";
import { useGetChatsByUserMutation } from '../../../api/newChatSlices/chatSlice'
import EventUserList from "../../../userList/eventAdminList";
import { generate8CharacterUUID } from "../../../reusable/utils/generate8bitUUID";
import { Box } from "@mui/system";
import { Card, Grid, Typography } from "@mui/material";
import { BsFillChatDotsFill } from "react-icons/bs";
import ChatContainer from "./chatMessageList";
import { useSelector } from 'react-redux';
import { io } from "socket.io-client";
import UserList from "./UserList"
import ChatTestMessage from "./chatTestMessage";
import { useGetGroupWsConnectionQuery } from "../../../api/newChatSlices/groupSlice";


const TestChat = () => {

    const { company_id, user_role, company_user_id, company_user_role_id } = useSelector((state) => state.cookie);

    const dispatch = useDispatch();

    const [typingMsg, setTypingMsg] = useState({ 'msg': '' })
    const [groupName, setGroupName] = useState(`${WEBSOCKET_BASE_URL}ws/ac/`);
    const [userId, setUserId] = useState(0);
    const [userChats] = useGetChatsByUserMutation();
    const [chatMessage, setChatMessage] = useState([]);

    const changeTypingMsg = (e) => {
        setTypingMsg({ 'msg': e.target.value })
    }

    const getUserWSConnection = useGetGroupWsConnectionQuery(
        { id: userId, company_name: company_id, myId: company_user_role_id },
        { skip: !userId }
    );


    // useEffect(() => {
    //     if (getUserWSConnection?.data) {
    //         setChatMessage(getUserWSConnection.data);
    //     }
    // }, [getUserWSConnection])

    const socket = io(BASE_URL, {
        transports: ['websocket'],
        withCredentials: true,
    });



    const [ChatData, setChatData] = useState();

    const scrollRef = useRef();

    const submitMessage = () => {
        const dynamicRoomId = 'room_' + Math.random().toString(36).substring(7);
        socket.emit('joinChat', dynamicRoomId);
        const data = {
            room_id: dynamicRoomId,
            chat_to: userId,
            chat_from: Number(company_user_role_id),
            company_name: company_id,
            message: typingMsg.msg,
        };
        socket.emit('sendMessage', data);
        setTypingMsg({ 'msg': '' });
    };


    useEffect(() => {
        if (company_user_role_id) {
            socket.on('connect', () => {
                console.log('Connected to Socket.io server11');
                socket.emit('chatUser', company_user_role_id);
                const data = { chat_from: Number(company_user_role_id), chat_to: userId }
                socket.emit("history", data);
            });
            socket.on('receiveMessage', (data) => {
                // setChatMessage(data);
                // console.log('data', data);
            });

            socket.on('previousChat', (data) => {
                setChatMessage(data);
            });

            return () => {
                socket.off('receiveMessage');
                socket.off('previousChat');
                socket.disconnect();
                console.log('Disconnected from Socket.io server');
            };
        }
    }, [company_user_role_id, userId]);

    return (
        <div className="flex h-[calc(85vh-0px)] antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-hidden">

                <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0 rounded-2xl">
                    <div className="flex flex-row items-center justify-center h-12 w-full">
                        <div
                            className="flex items-center justify-center rounded-2xl text-indigo-700 bg-indigo-100 h-10 w-10"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                ></path>
                            </svg>
                        </div>
                        {/* <div className="ml-2 font-bold text-2xl">QuickChat</div> */}
                    </div>
                    {/*//! User Lists  */}

                    <UserList setGroupName={setGroupName} setUserId={setUserId} />
                </div>

                <div className="flex flex-col flex-auto h-full">
                    <div
                        className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4"
                    >
                        {/* //! Messages */}
                        {userId === 0 ? <>
                            <div className="flex flex-col h-full overflow-x-auto mb-4">
                                <h2 className="flex items-center ">Select a conversation to start a chat.</h2>
                            </div>
                        </>
                            :
                            <>
                                <ChatTestMessage messages={chatMessage} scrollRef={scrollRef} />
                            </>}

                        <div
                            className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4"
                        >
                            {/* //! Message box */}
                            <div className="flex-grow">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                        name="msg"
                                        value={typingMsg.msg}
                                        onChange={changeTypingMsg}
                                    // onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                            <div className="ml-4">
                                <button
                                    className={`flex items-center justify-center rounded-xl text-white px-4 py-1 flex-shrink-0 ${typingMsg?.msg
                                        ? "bg-indigo-500 hover:bg-indigo-600"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={submitMessage}
                                    disabled={!typingMsg.msg.trim()}
                                >
                                    <span>Send</span>
                                    <span className="ml-2">
                                        <svg
                                            className="w-4 h-4 transform rotate-45 -mt-px"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                            ></path>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default TestChat