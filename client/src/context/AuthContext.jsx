import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // ================================
  // Check Auth
  // ================================
  const checkAuth = async () => {
    if (token) {
      try {
        axios.defaults.headers.common["token"] = token;
        const { data } = await axios.get("/api/users/check-auth"); // ✅ fixed endpoint
        if (data.success) {
          setAuthUser(data.user);
          connectSocket(data.user);
        }
      } catch (error) {
        Toast.error("Error fetching user data: " + error.message);
      }
    }
  };

  // ================================
  // Login / Signup
  // ================================
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/users/${state}`, credentials); // ✅ fixed endpoint
      if (data.success) {
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setAuthUser(data.user);
        connectSocket(data.user);
        Toast.success(data.message);
      } else {
        Toast.error(data.message);
      }
      return data; // ✅ return data so LoginPage can handle it
    } catch (error) {
      Toast.error("Error logging in: " + error.message);
      return { success: false, message: error.message }; // ✅ safe return
    }
  };

  // ================================
  // Logout
  // ================================
  const logout = async () => {
    try {
      await axios.post("/api/users/logout"); // ✅ fixed endpoint
      Toast.success("Logged out successfully");
      setAuthUser(null);
      setToken(null);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["token"];
      socket?.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    } catch (error) {
      Toast.error("Error logging out: " + error.message);
    }
  };

  // ================================
  // Update Profile
  // ================================
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/users/update-profile", body); // ✅ fixed endpoint
      if (data.success) {
        setAuthUser(data.user);
        Toast.success("Profile updated successfully");
      } else {
        Toast.error(data.message);
      }
    } catch (error) {
      Toast.error("Error updating profile: " + error.message);
    }
  };

  // ================================
  // Connect Socket
  // ================================
  const connectSocket = (userData) => {
    if (!userData || (socket && socket.connected)) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("getOnlineUsers", (usersIDs) => {
      setOnlineUsers(usersIDs);
    });
  };

  // ================================
  // Run once on mount
  // ================================
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    axios,
    token,
    setToken,
    authUser,
    setAuthUser,
    onlineUsers,
    setOnlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
