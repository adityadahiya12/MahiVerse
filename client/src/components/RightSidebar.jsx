import React, { useContext, useEffect } from 'react';
import assets ,{ imagesDummyData } from '../assets/assets';

const RightSidebar = () => {


  const {selectedUser, messages} = useContext(chatContext)
  const {logout , onlineUsers} = useContext(AuthContext)
  const[msgImages, setMsgImages] = useState([])

  // get all the image from the messages and set them to state 

  useEffect (()=>{
    setMsgImages(
        messages.filter(msg => msg.image).map(msg => msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 w-full  relative  rounded-l-xl overflow-y-scroll text-white hidden md:block ${selectedUser ?"max-md:hidden":""}`}>

      <div className="flex flex-col items-center  gap-2 text-xs font-light mx-auto p-5 border-l border-stone-500 text-white">
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt={selectedUser.fullName} className="w-20 aspect-[1/1]  rounded-full" />

        <h1 className= 'px-10 text-xl font-medium mx-auto flex items-center gap-2'>
         {onlineUsers.includes(selectedUser._id)&& <p className = 'w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4'/>
      <div className='px-5 text-xs'>
      <p>Media</p>
      <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
        {msgImages.map((url, index)=> (
          <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
            <img src={url} alt={`media-${index}`} className=' h-full object-cover rounded hover:opacity-80'/>


          </div>
        ))}
      </div>
      </div>
           <button onClick={()=> logout()} className='absolute bottom-5 left-1/2 transfrom -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600  text-white border-none font-light text-sm px-20 py-2 rounded-full cursor-pointer hover:bg-red-700'>
            LogOut
           </button>
      
    </div>
  );
};

export default RightSidebar;
