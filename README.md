# 📸 PixelShare

A modern full-stack image-sharing web application built with **React 19**, **Express.js v5**, **MongoDB**, and **ImageKit** cloud storage.

---

## ✨ Features

- **📸 Cloud Media Storage**: Streamed image uploads to ImageKit via Multer in-memory buffers.
- **⚡ Full REST API**: Complete CRUD operations for post management.
- **✏️ Inline Editing & Safe Deletion**: Edit captions directly in the feed; deleting a post purges cloud media automatically.
- **🎯 Drag & Drop Uploader**: Drag-and-drop file picker with instant client-side preview.
- **🎨 Modern Dark UI**: Glassmorphic styling, responsive layout grid, and loading skeleton states.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 8, React Router DOM v7, Custom CSS
- **Backend**: Node.js, Express v5, MongoDB & Mongoose v9, ImageKit SDK, Multer

---

## 🚀 Quick Start

### **1. Backend Setup**
```bash
cd Backend
npm install
# Create .env based on .env.example
node server.js
```
*Backend runs on `http://localhost:3000`*

### **2. Frontend Setup**
```bash
cd Frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 📡 API Endpoints

Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check status |
| `GET` | `/api/posts` | Fetch all posts (newest first) |
| `GET` | `/api/posts/:id` | Fetch single post by ID |
| `POST` | `/api/posts` | Create new post (`image`, `caption`) |
| `PATCH` / `PUT` | `/api/posts/:id` | Update post caption or replace image |
| `DELETE` | `/api/posts/:id` | Delete post & purge ImageKit media |

---

## ⚙️ Environment Configuration (`Backend/.env`)

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

---

## 📂 Project Structure

```
PixelShare/
├── Backend/          # Express REST API, Mongoose models & ImageKit services
├── Frontend/         # React 19 app, Vite config & CSS design system
└── README.md         # Project documentation
```

---

## 📄 License

ISC License
