# TaskFlow

TaskFlow is a full-stack task management application built with React (Vite) and Express.js.

## Project Structure

```
TaskFlow/
├── client/          # Frontend (React + Vite)
├── server/          # Backend (Express.js)
└── docs/            # Documentation
```

## Prerequisites

- Node.js (v18+)
- npm
- MongoDB Atlas account (or local MongoDB)

## Setup

### 1. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Important:** Replace `MONGO_URI` with your MongoDB Atlas connection string and set a strong `JWT_SECRET`.

### 2. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

- Backend API: http://localhost:5000
- Frontend: http://localhost:5173

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-12T..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-12T..."
  }
}
```

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok"
}
```

## Environment Variables

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `CLIENT_ORIGIN` | Frontend URL for CORS | No (default: http://localhost:5173) |
| `MONGO_URI` | MongoDB connection string | **Yes** |
| `JWT_SECRET` | Secret key for JWT tokens | **Yes** |

### Frontend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | No (default: http://localhost:5000) |

## Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ MongoDB Atlas Integration
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes
- ✅ Token Management (localStorage)

## Tech Stack

### Backend
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- CORS
- dotenv

### Frontend
- React
- Vite
- React Router DOM
- Axios
- localStorage

## Next Steps

- Task CRUD operations
- Kanban board view
- Calendar view
- User profile management

