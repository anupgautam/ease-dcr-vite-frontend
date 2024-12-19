import React, { useState, useEffect } from "react";
import { useGetAllUsersQuery, useGetUsersByCompanyRoleWithOutPageQuery } from "../../../api/MPOSlices/UserSlice";
import { useGetGroupWsConnectionQuery } from "../../../api/newChatSlices/groupSlice";
import { useSelector } from 'react-redux';

const UserList = ({ setGroupName, setUserId }) => {
    const { company_id, company_user_role_id } = useSelector((state) => state.cookie);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchParams, setSearchParams] = useState({});



    const handleUser = (id) => {
        setUserId(id);
    };

    const onSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            setSearchParams({ search: query, company_id });
        } else {
            setSearchParams({ company_id });
        }
    };

    const userList = useGetUsersByCompanyRoleWithOutPageQuery({
        company_name: company_id,
        user_id: company_user_role_id,
        search: searchQuery
    });

    const [activeUserId, setActiveUserId] = useState()

    return (
        <div className="flex flex-col mt-8">
            <div className="flex-grow m-1">
                <div className="relative w-full mb-2">
                    <input
                        type="text"
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        onChange={onSearch}
                        name="search"
                        value={searchQuery}
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
            </div>


            <div className="flex flex-col space-y-1 mt-4 -mx-2 h-[calc(100vh-250px)] overflow-y-auto">
                {
                    userList && userList?.data?.map((key, index) => {
                        const fullName = `${key?.user_name?.first_name} ${key?.user_name?.middle_name || ""} ${key?.user_name?.last_name}`;
                        const truncatedName = fullName?.length > 30 ? `${fullName.substring(0, 30)}...` : fullName;
                        const message = `${key?.last_message || ""}`
                        const truncatedMessage = message?.length > 20 ? `${message.substring(0, 20)}...` : message;

                        return (
                            <button
                                className={`flex flex-row items-center p-4 rounded-xl hover:bg-gray-100 ${activeUserId === key?.id ? "bg-blue-100" : ""
                                    }`}
                                key={key?.user_name?.id || index}
                                onClick={(event) => handleUser(key?.id)}
                            >
                                <div
                                    className="flex items-center justify-center h-8 w-8 bg-gray-200 rounded-full"
                                >
                                    {key.user_name.first_name.charAt(0)}{key.user_name.last_name.charAt(0)}
                                </div>
                                <div className="ml-4 flex flex-col">
                                    <span className="text-sm font-semibold">
                                        {truncatedName}
                                    </span>
                                    <small className="flex text-gray-500 mt-1 text-xs justify-start">
                                        {truncatedMessage}
                                    </small>
                                </div>
                            </button>
                        )
                    })}
            </div>
        </div>
    )
}
export default UserList