import React, { useContext, useState, useEffect } from 'react';
import assets from '../assets/assets';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';

const RightSidebar = () => {

  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);
  const [showFullProfile, setShowFullProfile] = useState(false);

  // get all the images from the messages and set them to state 
  useEffect(() => {
    setMsgImages(
      messages.filter(msg => msg.image).map(msg => msg.image)
    )
  }, [messages])

  const handleProfileClick = () => {
    // Add your click logic here
    setShowFullProfile(!showFullProfile);
    console.log("Profile image clicked!");
  };

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 w-full relative rounded-l-xl overflow-y-scroll text-white hidden md:block ${selectedUser ? "max-md:hidden" : ""}`}>
      <div className="flex flex-col items-center gap-2 text-xs font-light mx-auto p-5 border-l border-stone-500 text-white">
        {/* Fix: Add onClick to the image and prevent hover from interfering */}
        <div 
          onClick={handleProfileClick}
          className="cursor-pointer relative group"
          role="button"
          tabIndex={0}
        >
          <img 
            src={selectedUser?.profilePic || assets.avatar_icon} 
            alt={selectedUser.fullName} 
            className="w-20 aspect-[1/1] rounded-full transition-transform duration-200 hover:scale-105"
          />
          {/* Optional: Add a click indicator */}
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </div>

        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && (
            <p className='w-2 h-2 rounded-full bg-green-500'></p>
          )}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
        
        {/* Show additional profile info on click */}
        {showFullProfile && (
          <div className="mt-2 text-center">
            <p>Additional profile information here</p>
          </div>
        )}
      </div>
      
      <hr className='border-[#ffffff50] my-4' />
      
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url, index) => (
            <div 
              key={index} 
              onClick={() => window.open(url)} 
              className='cursor-pointer rounded'
            >
              <img 
                src={url} 
                alt={`media-${index}`} 
                className='w-full h-full object-cover rounded hover:opacity-80 transition-opacity duration-200'
              />
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => logout()} 
        className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none font-light text-sm px-20 py-2 rounded-full cursor-pointer hover:bg-red-700 transition-colors duration-200'
      >
        LogOut
      </button>
    </div>
  );
};

export default RightSidebar;