import React, { useContext, useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages,
  } = useContext(ChatContext);

  const { authUser, onlineUsers } = useContext(AuthContext);
  const scrollEnd = useRef();
  const [input, setInput] = useState("");

  // ------------------ Get messages when user changes ------------------
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // ------------------ Auto-scroll ------------------
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedUser]);

  // ------------------ Send message ------------------
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (input.trim() === "") return;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // ------------------ Send image ------------------
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select a valid image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} alt="Logo" className="max-w-15" />
        <p className="text-lg font-medium text-white">
          Select a chat to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* ------------------ Header ------------------ */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white font-semibold flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </p>
      </div>

      {/* ------------------ Back button ------------------ */}
      <img
        onClick={() => setSelectedUser(null)}
        src={assets.arrow_icon}
        alt="Back"
        className="md:hidden max-w-7 cursor-pointer"
      />

      {/* ------------------ Chat messages ------------------ */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 mb-6 ${
              msg.senderId === authUser._id
                ? "justify-end flex-row-reverse"
                : "justify-start"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="message"
                className="max-w-[230px] border border-gray-700 rounded-lg"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg break-all
                  ${
                    msg.senderId === authUser._id
                      ? "bg-violet-500/30 text-white rounded-br-none"
                      : "bg-violet-500/30 text-white rounded-bl-none"
                  }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-xs text-center">
              <img src={msg.senderId === authUser._id ? authUser?. profiePic || assets.avatar_icon : selectedUser?.profilePic ||assets.avatar_icon} className="w-7 rounded-full"/>
              <p className="text-gray-400">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* ------------------ Bottom input area ------------------ */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Type a message..."
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt="Gallery"
              className="w-6 mr-2 cursor-pointer"
            />
          </label>
        </div>
        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt="Send"
          className="w-6 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ChatContainer;
