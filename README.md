# YouTube Clone API

A RESTful backend for a YouTube-style video sharing platform built with **Node.js**, **Express**, **Sequelize ORM**, and **PostgreSQL**.
Supports authentication, media uploads, subscriptions, comments, likes/dislikes, and trending logic.

---

<img width="1591" height="1112" alt="Untitled (1)" src="https://github.com/user-attachments/assets/8ff03907-598e-4c48-b219-7622a282922f" />

## Features

### 1. **User Management**

- JWT-based authentication
- Signup, login, and email verification via OTP
- OTP sent via email, expires in 10 minutes
- Unverified users cannot log in
- Password reset

### 2. **Video Management**

- Upload videos and thumbnails locally (size & MIME type validation)
- Optional Cloudinary integration for media storage
- Fetch videos by:
  - ID
  - Trending (most viewed or liked)
  - Subscribed channels
- Track views and store metadata

### 3. **Comments**

- Add comments to videos
- Fetch comments for a specific video

### 4. **Reactions**

- Like/dislike videos
- Affect trending logic

### 5. **Subscriptions**

- Subscribe/unsubscribe to channels
- Fetch videos from subscribed channels

### 6. **Search**

- Search videos by title or description
- Search channels by username
- Support pagination and filtering

### 7. **User Profile**

- Update username, bio, and profile picture
- Reset password via OTP

### 8. **Security**

- Restrict write actions to verified users
- Input sanitization and environment-secured secrets

### 9. **Database Transactions**

- Applied in signup, video upload, comment creation, reaction updates, and subscriptions
- Roll back on failure

### 10. **CRUD Operations**

- Videos: Create, read, update, delete
- Comments: Create, read, update, delete
- Reactions: Toggle like/dislike
- Subscriptions: Subscribe/unsubscribe, list
- User profile: Update/delete

---

## API Endpoints

### **Auth / Users**

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| POST   | `/api/users/register`       | Register a new user           |
| POST   | `/api/users/login`          | Login and get JWT             |
| POST   | `/api/users/logout`         | Logout user                   |
| GET    | `/api/users/me`             | Get logged-in user profile    |
| PATCH  | `/api/users/me`             | Update logged-in user profile |
| DELETE | `/api/users/me`             | Delete logged-in user account |
| POST   | `/api/users/verify-otp`     | Verify email with OTP         |
| POST   | `/api/users/request-otp`    | Request new OTP               |
| POST   | `/api/users/reset-password` | Reset password via OTP        |

### **Channels**

| Method | Endpoint                        | Description                 |
| ------ | ------------------------------- | --------------------------- |
| POST   | `/api/channels`                 | Create a new channel        |
| GET    | `/api/channels`                 | List all channels           |
| GET    | `/api/channels/:id`             | Get channel by ID           |
| PATCH  | `/api/channels/:id`             | Update channel (owner only) |
| DELETE | `/api/channels/:id`             | Delete channel (owner only) |
| GET    | `/api/channels/:id/videos`      | List videos of a channel    |
| POST   | `/api/channels/:id/subscribe`   | Subscribe to a channel      |
| DELETE | `/api/channels/:id/unsubscribe` | Unsubscribe from a channel  |

### **Videos**

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| POST   | `/api/videos`          | Upload a video            |
| GET    | `/api/videos`          | List all videos           |
| GET    | `/api/videos/trending` | Get trending videos       |
| GET    | `/api/videos/:id`      | Get video by ID           |
| PATCH  | `/api/videos/:id`      | Update video (owner only) |
| DELETE | `/api/videos/:id`      | Delete video (owner only) |
| POST   | `/api/videos/:id/view` | Increment video views     |

### **Comments**

| Method | Endpoint                        | Description                            |
| ------ | ------------------------------- | -------------------------------------- |
| POST   | `/api/videos/:videoId/comments` | Add comment to a video                 |
| GET    | `/api/videos/:videoId/comments` | Get comments for a video               |
| PATCH  | `/api/comments/:id`             | Update comment (author only)           |
| DELETE | `/api/comments/:id`             | Delete comment (author or video owner) |

### **Reactions**

| Method | Endpoint                   | Description         |
| ------ | -------------------------- | ------------------- |
| POST   | `/api/videos/:id/like`     | Like a video        |
| POST   | `/api/videos/:id/dislike`  | Dislike a video     |
| DELETE | `/api/videos/:id/reaction` | Remove like/dislike |

### **Subscriptions**

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| GET    | `/api/subscriptions` | List subscriptions of logged-in user |

---

## Tech Stack

- Node.js
- Express.js
- Sequelize ORM
- PostgreSQL
- Multer (file uploads)
- JWT Authentication
- Nodemailer (email OTP)

---

## Installation

```bash
git clone https://github.com/zeyadAlbadawy/Youtube_Clone_API.git
cd Youtube_Clone_API
npm install
```

---

## Environment Variables

Create a `.env` file or use the provided `.env.example`.

Example:

```
# Database Configuration
USER_NAME=your_postgres_user
PASSWORD=your_postgres_password
HOST_NAME=127.0.0.1
PORT=5432
DB_NAME=Youtube

# Application
APP_PORT=5000

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key
JWT_EXPIRES_IN=30d
REFRESH_EXPIRES_IN=60d

# Email Configuration (Mailtrap or SMTP)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password

# File Upload Limits (in MB)
VIDEO_FILE_SIZE=50
IMAGE_FILE_SIZE=5

```

---

## Run the Project

### Development

```bash
npm run start:dev
```
