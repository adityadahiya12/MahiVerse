import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js"

// get all user except the logged in user
export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const message = await Message.find({
        senderId: user._id, 
        receiverId: userId, 
        seen: false
      });
      if (message.length > 0) {
        unseenMessages[user._id] = message.length;
      }
    });
    
    await Promise.all(promises);
    res.status(200).json({ users: filteredUsers, unseenMessages, success: true });
  } catch (error) {
    console.error("Error fetching users for sidebar:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// get all message for selected user
export const getMessages = async (req, res) => {  // Changed from getMessage to getMessages
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;
    
    const messages = await Message.find({
      $or: [
        { senderId: selectedUserId, receiverId: myId },
        { senderId: myId, receiverId: selectedUserId }
      ]
    }); 
    
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId },
      { seen: true }
    );
    
    res.status(200).json({ messages, success: true });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// api to mark message as seen using message id 
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({ message: "Message marked as seen", success: true });
  } catch (error) {
    console.error("Error marking message as seen:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// send message to the selected user 
export const sendMessage = async (req, res) => {
  try {
    const { image, text } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });
    
    // Emit the new message to the receiver if they are online
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", newMessage);
    }

    res.status(201).json({ message: "Message sent", success: true, data: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// REMOVED: export default messageController; - This was causing the error