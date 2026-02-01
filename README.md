# Task Management Application

A full-stack web application for managing tasks with user authentication.

## 🚀 Live Demo

- **Backend API:** `http://localhost:5000`
- **Frontend:** `http://localhost:8000`

## 📋 Features

- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Create, Read, Update, Delete Tasks
- ✅ Filter tasks by status (Pending, In Progress, Completed)
- ✅ Responsive design

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MySQL
- JWT for authentication
- bcryptjs for password hashing

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MySQL (v5.7+)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/task-management-app.git
cd task-management-app
```

2. Setup Database:
```sql
CREATE DATABASE task_management;
USE task_management;
-- Run the SQL schema from database setup guide
```

3. Backend Setup:
```bash
cd backend
npm install
# Create .env file with your credentials
npm run dev
```

4. Frontend Setup:
```bash
cd frontend
python -m http.server 8000
```

5. Open browser: `http://localhost:8000/register.html`

## 📝 Environment Variables

Create `.env` file in backend folder:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=task_management
JWT_SECRET=your_secret_key
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

