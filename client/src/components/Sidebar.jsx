import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import searchIcon from "../assets/search_icon.png";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  } = useContext(ChatContext);

  const { logout, onlineUsers } = useContext(AuthContext);

  const [input, setInput] = useState(""); // ✅ must be string, not false
  const navigate = useNavigate();

  const filteredUsers = input
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  useEffect(() => {
    getUsers();
  }, [onlineUsers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? "max-md:hidden" : ""
      }`}
    >
      {/* ---------------- Header ---------------- */}
      <div className="pb-5">
        <div className="flex justify-between items-center">
          <img src={logo} alt="App Logo" className="max-w-40" />

          {/* Profile Dropdown */}
          <div className="relative py-2 group">
            <img
              src="/vite.svg"
              alt="Logo"
              className="w-12 h-12 rounded-full"
            />
            <div className="absolute top-full right-0 z-20 p-5 mt-2 w-48 bg-[#282142] border-gray-600 rounded-md text-gray-300 hidden group-hover:block">
              <p
                onClick={() => navigate("/profile")}
                className="cursor-pointer text-sm hover:text-white"
              >
                Edit profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p
                onClick={() => logout()}
                className="cursor-pointer text-sm hover:text-white"
              >
                Logout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Search Bar ---------------- */}
      <div className="bg-[#282142] border rounded-full flex items-center gap-2 py-3 px-4 mt-5">
        <img src={searchIcon} alt="Search Icon" className="w-3" />
        <input
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Search User..."
          className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
        />
      </div>

      {/* ---------------- User List ---------------- */}
      <div className="flex flex-col mt-5">
        {filteredUsers.map((user, index) => (
          <div
            onClick={() => {
              setSelectedUser(user);
              setUnseenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }));
            }}
            key={user._id || index}
            className={`relative flex items-center gap-3 p-3 cursor-pointer max-sm:text-sm hover:bg-[#8185B2]/20 rounded-lg ${
              selectedUser?._id === user._id ? "bg-[#282142]/50" : ""
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt="User"
              className="w-[35px] h-[35px] rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p className="font-medium">{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className="text-green-400 text-xs">Online</span>
              ) : (
                <span className="text-neutral-400 text-xs">Offline</span>
              )}
            </div>

            {/* Unseen badge */}
            {unseenMessages[user._id] && unseenMessages[user._id] > 0 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {unseenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
