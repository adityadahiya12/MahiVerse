# Mahiverse 💬✨

A modern real-time chatting and media sharing web application built using the MERN Stack, Socket.IO, and Cloudinary.

---

## 🚀 Features

* 🔐 JWT Authentication (Login & Signup)
* 👤 User Profile Management
* 🖼 Profile Picture Upload
* 💬 Real-Time Messaging with Socket.IO
* 📩 Seen / Unseen Message Tracking
* 🌐 Online Users Status
* ☁ Cloudinary Image Uploads
* ⚡ Fast React Frontend using Vite
* 🎨 Responsive UI with Tailwind CSS
* 🔄 Persistent Authentication using LocalStorage

---

## 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Hot Toast
* Socket.IO Client

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Bcrypt.js
* Socket.IO
* Cloudinary

---

# 📂 Project Structure

```bash
mahiverse/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ChatContext.jsx
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── userController.js
│   │   └── messageController.js
│   │
│   ├── middleware/
│   │   └── auth.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Message.js
│   │
│   ├── routes/
│   │   ├── userRoutes.js
│   │   └── messageRoutes.js
│   │
│   ├── lib/
│   │   └── cloudinary.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/adityadahiya12/MahiVerse.git
cd MahiVerse
```

---

# 🔧 Backend Setup

## Install Dependencies

```bash
cd server
npm install
```

## Create `.env`

```env
MONGODB_URI=your_mongodb_uri

PORT=3000

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Run Backend Server

```bash
npm run server
```

or

```bash
nodemon server.js
```

---

# 🎨 Frontend Setup

## Install Dependencies

```bash
cd client
npm install
```

## Create `.env`

```env
VITE_BACKEND_URL=http://localhost:3000
```

## Run Frontend

```bash
npm run dev
```

---

# 🔑 Authentication APIs

## Signup

```http
POST /api/auth/signup
```

## Login

```http
POST /api/auth/login
```

## Check Authentication

```http
GET /api/auth/check-auth
```

## Update Profile

```http
PUT /api/auth/update-profile
```

---

# 💬 Message APIs

## Get Users

```http
GET /api/messages/users
```

## Get Messages

```http
GET /api/messages/:id
```

## Send Message

```http
POST /api/messages/send/:id
```

## Mark Message as Seen

```http
PUT /api/messages/mark/:id
```

---

# 🔌 Socket.IO Events

## Client → Server

```js
socket.emit()
```

## Server → Client

```js
io.to(receiverSocketId).emit("receiveMessage", newMessage)
```

---

# ☁️ Cloudinary Integration

Cloudinary is used for:

* Profile Picture Uploads
* Chat Image Sharing

---

# 🧠 Key Learnings

* Real-Time Communication with Socket.IO
* JWT Authentication Flow
* MERN Stack Architecture
* Context API State Management
* Cloudinary Media Handling
* MongoDB Relationships
* Protected Routes

---

# 📸 Future Improvements

* 🎤 Voice Messages
* 📹 Video Calling
* 👥 Group Chats
* 😀 Emoji Reactions
* ⌨ Typing Indicators
* 🗑 Message Delete/Edit
* 🔔 Push Notifications
* 🌙 Dark/Light Theme

---

# 👨‍💻 Author

## Addy Chaudhary

B.Tech Computer Science Student
Frontend & MERN Stack Developer

---

# ⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork the project
* 🛠 Contribute improvements

---

# 📜 License

This project is licensed under the MIT License.
