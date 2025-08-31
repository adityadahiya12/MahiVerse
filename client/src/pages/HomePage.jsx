import { useState } from 'react';
import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import RightSidebar from '../components/RightSidebar';
import ProfilePage from './ProfilePage';
import Login from './LoginPage'

const Homepage = () => {
  const [selectedUser] = useContext(ChatContext);

  return (
    <div className="border w-full h-screen sm:px-[15%] sm:py-[5%]">
      <h1 className="text-4xl font-bold text-white">Welcome to the Homepage!</h1>

      <div
        className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative 
          ${selectedUser 
            ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_1.5fr_1fr]' 
            : 'md:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_2fr]'}`}
      >
        <Sidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  );
};

export default Homepage;
