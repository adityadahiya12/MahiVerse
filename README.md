🌌 Mahiverse — Real-Time Chat & Media Sharing Platform

Mahiverse is a MERN stack real-time chatting and media sharing application featuring secure authentication, instant messaging with Socket.IO, file sharing, notifications, and a clean modern UI. Built to provide a fluid social communication experience, Mahiverse enables users to connect, communicate, and collaborate seamlessly.

🚀 Features
👥 User & Authentication

Secure JWT Authentication & Authorization

User Registration, Login, Logout

Profile Management

Avatar Upload

💬 Real-Time Chat

One-to-One Chat (Private Messaging)

Group Chats

Online / Offline Status

Typing Indicators

Read Receipts

Message Seen Status

🖼️ Media & Files

Send Images, Videos & Documents

Cloud Storage Integration (Cloudinary / Firebase)

Preview Support

🔔 Notifications

Real-time notification system

New message alerts

🎨 UI / UX

Responsive design

Dark & Light Theme

Smooth animations

🔐 Security

Secured APIs

Password Hashing

Protected Routes

🛠️ Tech Stack
Frontend

React.js

Context API / Redux (optional)

Tailwind CSS / CSS Modules

Socket.IO Client

Backend

Node.js

Express.js

MongoDB + Mongoose

Socket.IO Server

JWT Authentication

Storage & Utilities

Cloudinary (Media Storage)

Multer (File Uploads)

📂 Folder Structure
Mahiverse/
│
├── client/           # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
│
├── server/           # Backend API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── server.js
│   └── package.json
│
└── README.md
⚙️ Environment Variables

Create a .env file in server directory

PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
CLOUDINARY_CLOUD_NAME=xxx

For Client

REACT_APP_SERVER_URL=http://localhost:5000
▶️ Installation & Setup
Clone Repository
git clone https://github.com/your-username/mahiverse.git
cd mahiverse
Backend Setup
cd server
npm install
npm start
Frontend Setup
cd client
npm install
npm start
🔌 Available Scripts
Client
npm start        # Run client
npm run build    # Production build
Server
npm start        # Run server
npm run dev      # Dev with nodemon
🔗 API Endpoints (Basic)
Auth

POST /api/auth/register

POST /api/auth/login

Users

GET /api/users

GET /api/users/:id

Chats / Messages

POST /api/chat

GET /api/chat/:userId

POST /api/message

GET /api/message/:chatId

⚡ Socket.IO Events
connection
join-chat
new-message
typing
stop-typing
message-delivered
disconnect
📦 Deployment Guide
Frontend

Vercel / Netlify

Backend

Render / Railway / AWS / VPS

Set production env

🧪 Testing

Postman for API Testing

Manual UI Testing

🛡️ Future Enhancements

Voice & Video Calls

Status / Story Feature

Message Reactions

Admin Controls for Groups

End-to-End Encryption

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you want to change.

📜 License

This project is licensed under the MIT License.

👨‍💻 Developer

Aditya

⭐ If you like this project, give it a star and support the development!
