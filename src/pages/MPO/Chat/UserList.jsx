import React from "react";
import { useGetAllUsersQuery, useGetAllUsersWithoutPaginationQuery } from "../../../api/MPOSlices/UserSlice";
import { useGetGroupWsConnectionMutation } from "../../../api/newChatSlices/groupSlice";
import { useSelector } from 'react-redux';

const UserList = ({ setGroupName, setUserId }) => {
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

    console.log(userList?.data)

    return (
        <div className="flex flex-col mt-8">
            <div className="flex-grow m-1">
                <div className="relative w-full mb-2">
                    <input
                        type="text"
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        // onChange={changeTypingMsg}
                        name="search"
                        // value={typingMsg.msg}
                        placeholder="Search Users..."
                    />

                    <button
                        className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                    </button>
                </div>
            </div>
            <div className="flex flex-row items-center justify-between text-xs">
                <span className="font-bold">Active Conversations</span>
                {/* <span
                    className="flex items-center justify-center bg-gray-300 h-4 w-4 rounded-full"
                >
                    4
                </span> */}
            </div>


            <div className="flex flex-col space-y-1 mt-4 -mx-2 h-[calc(100vh-250px)] overflow-y-auto">
                {/* <button
                    className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                >
                    <div
                        className="flex items-center justify-center h-8 w-8 bg-indigo-200 rounded-full"
                    >
                        H
                    </div>
                    <div className="ml-2 text-sm font-semibold">Henry Boyd</div>
                </button> */}

                {
                    userList && userList?.data?.map((key, index) => (
                        <button
                            className="flex flex-row items-center hover:bg-gray-100 rounded-xl p-2"
                        >
                            <div
                                className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full"
                            >
                                {key.user_name.first_name.charAt(0)}{key.user_name.last_name.charAt(0)}
                            </div>
                            <div className="ml-2 text-sm font-semibold">{key.user_name.first_name} {key.user_name.last_name}</div>
                            {/* <div
                                className="flex items-center justify-center ml-auto text-xs text-white bg-red-500 h-4 w-4 rounded leading-none"
                            >
                                2
                            </div> */}
                        </button>
                    ))}
            </div>
        </div>
    )
}
export default UserList