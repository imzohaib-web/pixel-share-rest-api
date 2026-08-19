# 📸 PixelShare - Full-Stack Media Sharing Application

PixelShare is a modern full-stack web application designed for seamless photo sharing and post management. Users can upload images with custom captions, store media securely in cloud storage, and view a community feed of all shared posts in a responsive, modern UI.

---

## ✨ Features

- **📸 Image Uploading & Cloud Storage**: Upload images (PNG, JPG, WEBP, GIF) up to 10MB directly to **ImageKit** via memory buffer streams.
- **📝 Post Captions**: Attach custom captions to photos upon upload.
- **🖼️ Community Feed**: Dynamic feed showcasing shared images in a responsive grid layout.
- **🎯 Drag-and-Drop Uploader**: Interactive image uploader supporting file browser selection and drag-and-drop.
- **👁️ Live Image Preview**: Instant client-side preview of selected images before posting, with single-click removal.
- **🎨 Modern UI & Glassmorphism**: Tailored dark-mode UI with sleek gradients, micro-animations, loading states, and error handling.
- **⚡ Fast Execution & Client Routing**: Built with React 19, Vite, and React Router 7 for instant client-side transitions.

---

## 🛠️ Tech Stack

### **Backend (`/Backend`)**
- **Runtime & Framework**: Node.js, Express.js (v5)
- **Database & ODM**: MongoDB, Mongoose (v9)
- **Cloud Media Storage**: ImageKit SDK (`@imagekit/nodejs`)
- **File Handling**: Multer (`multer.memoryStorage()`)
- **Middleware**: CORS, Express JSON Parser, Dotenv

### **Frontend (`/Frontend`)**
- **Library & Build Tool**: React 19, Vite (v8)
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla CSS (Custom Design System with CSS variables, Glassmorphism, Responsive Grid)
- **Linter**: Oxlint

---

## 📂 Project Architecture

```
First backend project/
├── Backend/
│   ├── db/
│   │   └── db.js                 # MongoDB connection initialization
│   ├── models/
│   │   └── post.model.js         # Mongoose schema & model for Posts
│   ├── services/
│   │   └── storage.service.js    # ImageKit upload service helper
│   ├── src/
│   │   └── app.js                # Express app routes & middleware setup
│   ├── .env                      # Environment configurations (secret keys)
│   ├── server.js                 # Entry point for backend server
│   └── package.json              # Backend dependencies and scripts
│
├── Frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx        # Navigation header with active state links
│   │   ├── pages/
│   │   │   ├── Feed.jsx          # Public feed page displaying all posts
│   │   │   └── Upload.jsx        # Drag & drop upload page with live preview
│   │   ├── App.jsx               # Main React router configuration
│   │   ├── index.css             # Design tokens, variables & full component styles
│   │   └── main.jsx              # React app mount point
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite build configuration
│
└── README.md                     # Complete project documentation
```

---

## 📡 API Reference

### 1. **Create a Post**
- **Endpoint**: `POST /create-post`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `image` *(File, required)*: The image file to upload.
  - `caption` *(String, optional)*: Text caption accompanying the image.
- **Success Response (201 Created)**:
  ```json
  {
    "message": "Post created successfully",
    "post": {
      "_id": "66bc...",
      "image": "https://ik.imagekit.io/...",
      "caption": "A sunset view!",
      "__v": 0
    }
  }
  ```
- **Error Response (400 Bad Request)**:
  ```json
  {
    "message": "Image is required"
  }
  ```

---

### 2. **Fetch All Posts**
- **Endpoint**: `GET /post`
- **Content-Type**: `application/json`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Posts fetched successfully",
    "posts": [
      {
        "_id": "66bc...",
        "image": "https://ik.imagekit.io/...",
        "caption": "A sunset view!"
      }
    ]
  }
  ```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `Backend/` directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

---

## 🚀 Getting Started

### **1. Prerequisites**
- Node.js (v18+ recommended)
- MongoDB Instance (Local or MongoDB Atlas)
- ImageKit Account (for media uploads)

---

### **2. Backend Setup**

```bash
# Navigate to the Backend folder
cd Backend

# Install dependencies
npm install

# Start the Backend server (runs on http://localhost:3000)
node server.js
```

---

### **3. Frontend Setup**

```bash
# Navigate to the Frontend folder
cd Frontend

# Install dependencies
npm install

# Start the Vite development server (runs on http://localhost:5173 by default)
npm run dev
```

---

## 🧪 Database Schema

### `Post` Schema (`post.model.js`)
| Field | Type | Description |
| :--- | :--- | :--- |
| `image` | `String` | URL of the uploaded image generated by ImageKit |
| `caption` | `String` | Text description or caption for the post |

---

## 💡 Frontend Pages Overview

1. **Feed Page (`/`)**:
   - Queries `GET /post` on mount.
   - Handles loading states, error fallbacks with a "Retry" button, and an empty feed prompt inviting users to upload their first post.
2. **Upload Page (`/upload`)**:
   - Features a dropzone for drag-and-drop file uploading or file picking.
   - Enforces file type (`image/*`) and file size limits (≤ 10MB).
   - Generates a local `blob:` preview URL for instant feedback.
   - Displays real-time upload spinners and automatically redirects users back to `/` on success.
