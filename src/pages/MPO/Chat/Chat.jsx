import React, { useCallback, useEffect, useRef, useState, useContext } from "react";
import { WEBSOCKET_BASE_URL } from '../../../baseURL'
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
import { CookieContext } from '@/App'


const ChatApp = () => {
    return (
        <Box  >
            <Grid container spacing={0}>
                <Chat />
            </Grid>
        </Box>
    )
}


const Chat = () => {

    const { company_id, user_role, company_user_id } = useContext(CookieContext)

    const dispatch = useDispatch();

    const [typingMsg, setTypingMsg] = useState({ 'msg': '' })
    const [isGroup, setIsGroup] = useState(false);
    const [groupName, setGroupName] = useState(`${WEBSOCKET_BASE_URL}ws/ac/`);
    const [userId, setUserId] = useState(0);
    const [sockets, setSockets] = useState([]);
    const [userChats] = useGetChatsByUserMutation();
    const changeTypingMsg = (e) => {
        setTypingMsg({ 'msg': e.target.value })
    }

    const [urls, setUrls] = useState([`${WEBSOCKET_BASE_URL}ws/ac/`])
    const [ChatData, setChatData] = useState([]);
    const [dataLength, setDataLength] = useState(1);

    useEffect(() => {
        if (company_id) {
            setUrls([groupName]);
        }
    }, [company_id, groupName])

    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef();

    const handleScroll = async () => {
        const container = scrollRef.current;
        if (container.scrollTop === 0) {
            try {
                setDataLength((prevDataLength) => prevDataLength + 1);
                setIsLoading(true);
                const res = await userChats({
                    user_list: [company_id, userId],
                    data_length: dataLength,
                });
                setChatData((prevChatData) => [...prevChatData, ...res.data.data]);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };
    useEffect(() => {
        const container = scrollRef.current;

        if (container) {
            container.addEventListener('scroll', handleScroll);

            return () => {
                container.removeEventListener('scroll', handleScroll);
            };
        }
    }, [scrollRef.current, dataLength]);



    useEffect(() => {
        if (userId !== 0) {
            userChats({
                user_list: [company_id, userId],
                data_length: dataLength,
            }).
                then((res) => {
                    dispatch(addData(res?.data?.data));
                    setChatData(res?.data?.data);
                })
        }
    }, [userId, company_id])

    const onMessageReceived = useCallback((message) => {
        setChatData((prevChatData) => [...prevChatData, message]);
    }, []);

    useEffect(() => {
        const openWebSocketConnections = () => {
            if (urls && Array.isArray(urls)) {
                const newSockets = urls.map((url) => {
                    return connectWebSocket(url, company_id, onMessageReceived);
                });
                setSockets(newSockets);
            }
        };
        openWebSocketConnections();
        return () => {
            sockets.forEach((socket) => {
                socket.close();
            });
        };
    }, [urls, company_id, onMessageReceived]);


    const submitMessage = () => {
        sockets.forEach((socket) => {
            if (socket.url.includes(groupName)) {
                socket.send(JSON.stringify({
                    'type': 'chat',
                    'message': typingMsg.msg,
                    'initiator': company_id,
                    'receiver': userId,
                    'user': company_id,
                    'group_name': groupName,
                    'is_group': isGroup,
                    'default': false,
                    'unique_id': generate8CharacterUUID()
                }));
                setTypingMsg({ msg: "" });
            } else {
            }
        });
    };


    return (
        <Box className="dashboard-background-color1">
            <Card elevation={2}>
                <Box style={{ backgroundColor: "white", borderRadius: '5px', width: '100%' }}>
                    <Grid container >
                        <Grid item xs={3}>
                            <div style={{ padding: "20px" }}>
                                <div>
                                    {
                                        user_role === 'admin' &&
                                        <Typography
                                            style={{ fontSize: '18px', color: "black", fontWeight: "600", paddingBottom: '15px' }}>
                                            User List{' '}
                                            <BsFillChatDotsFill style={{ fontSize: '15px' }} />
                                        </Typography>
                                    }

                                </div>
                                <div className="chat-list-design">
                                    <EventUserList setGroupName={setGroupName} setUserId={setUserId} />
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={9}>
                            <div style={{ marginLeft: '15px' }}>
                                <div className="chat-data-design">
                                    <div>
                                        <ChatContainer messages={ChatData} scrollRef={scrollRef} />
                                    </div>
                                </div>
                                <>
                                    <Box style={{ paddingBottom: '20px' }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <form className="input-container">
                                                    <input rowsMin={3} type="text" onChange={changeTypingMsg} name="msg" value={typingMsg.msg} placeholder="Enter your message" id="chat-message-input" size='100' />
                                                    <input type="button" value="Send" id="chat-message-submit" onClick={submitMessage} />
                                                </form>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            </div>

                        </Grid>
                    </Grid>
                </Box>
            </Card>
        </Box>
    )
}

export default ChatApp;