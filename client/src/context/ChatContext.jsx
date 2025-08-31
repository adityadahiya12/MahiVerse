import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  
  // 🔹 get socket from AuthContext (if you provide it there)
  const { socket } = useContext(AuthContext) || {};

  // ------------------ Get all users for sidebar ------------------
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages || {});
      }
    } catch (error) {
      toast.error(`Error fetching users: ${error.message}`);
    }
  };

  // ------------------ Get messages with selected user ------------------
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(`Error fetching messages: ${error.message}`);
    }
  };

  // ------------------ Send message ------------------
  const sendMessage = async (messageData) => {
    try {
      if (!selectedUser) return;
      const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(`Error sending message: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error sending message: ${error.message}`);
    }
  };

  // ------------------ Subscribe to messages ------------------
  const subscribeToMessage = (userId) => {
    if (!socket || !userId) return;

    socket.on(`message_${userId}`, (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // message for the open chat
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`, { seen: true });
      } else {
        // increase unseen count
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });
  };

  // ------------------ Unsubscribe ------------------
  const unsubscribeFromMessages = (userId) => {
    if (!socket || !userId) return;
    socket.off(`message_${userId}`);
  };

  // ------------------ Auto-subscribe ------------------
  useEffect(() => {
    if (selectedUser?._id) {
      subscribeToMessage(selectedUser._id);
      return () => unsubscribeFromMessages(selectedUser._id);
    }
  }, [socket, selectedUser]);

  // ------------------ Values to provide ------------------
  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
