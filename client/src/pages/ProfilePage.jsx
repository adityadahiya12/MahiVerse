import React, { useState, useContext } from "react"; // ✅ added useContext
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  // State to store selected profile image
  const [selectedImg, setSelectedImg] = useState(null);

  // Navigation hook
  const navigate = useNavigate();

  // Default profile info
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      // ✅ Update without image
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    // ✅ Convert image to Base64
    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ fullName: name, bio, profilePic: base64Image });
      navigate("/");
    };
  };

  return (
    <div className="min-h-screen flex bg-cover bg-center items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* Profile Container */}
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        
        {/* Profile Info Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-10 flex-1">
          <h3 className="font-medium text-lg">Profile Information</h3>

          {/* Avatar Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input 
              onChange={(e) => setSelectedImg(e.target.files[0])} 
              type="file" 
              id="avatar" 
              accept=".png, .jpg, .jpeg" 
              hidden 
            />
            <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.avatar_icon} 
              alt="Profile" 
              className={`w-12 h-12 rounded-full`} 
            />
            Upload profile picture
          </label>

          {/* Name Input */}
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Your Name" 
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500" 
          />

          {/* Bio Input */}
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            placeholder="Write a short bio..." 
            rows="3"
            className="p-2 border border-gray-500 rounded-md bg-transparent text-white focus:outline-none focus:ring-2 resize-none text-2xl" 
          />

          {/* Save Button */}
          <button 
            type="submit"  // ✅ form will now trigger handleSubmit
            className="bg-gradient-to-r from-purple-500 to-violet-500 text-white p-2 rounded-full text-lg cursor-pointer"
          >
            Save Profile
          </button>
        </form>
        
        {/* Profile Image Section */}
        <img 
          src={authUser?.profilePic || assets.logo_icon}  // ✅ fixed duplicate src
          alt="Profile" 
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10" 
        />
      </div>
    </div>
  );
};

export default ProfilePage;
