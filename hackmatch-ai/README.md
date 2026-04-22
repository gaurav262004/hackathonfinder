# HackMatch AI - Full Stack Setup

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- Docker & Docker Compose (for MongoDB)
- Git

### Step 1: Start MongoDB (using Docker)

```bash
docker-compose up -d
```

This starts:
- **MongoDB**: `mongodb://localhost:27017`
- **Mongo Express UI**: `http://localhost:8081` (Database management GUI)

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
cp .env.example .env
```

Update `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hackmatch-ai
JWT_SECRET=your_super_secret_key_change_this
```

### Step 3: Start Backend Server

```bash
npm run dev
```

Backend running on: **http://localhost:5000**

### Step 4: Install Frontend Dependencies (in new terminal)

```bash
cd client
npm install
npm run dev
```

Frontend running on: **http://localhost:5173**

---

## 📁 Project Structure

```
hackmatch-ai/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── App.tsx        # Main app routes
│   │   ├── pages/         # Login, Signup, Dashboard
│   │   ├── components/    # Reusable components
│   │   └── services/      # API calls
│   └── package.json
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, error handling
│   │   └── config/        # Database config
│   └── package.json
└── docker-compose.yml     # MongoDB setup
```

---

## 🔌 API Endpoints

### Auth
- `POST /api/auth/signup` → Register
- `POST /api/auth/login` → Login

### Users
- `GET /api/users/profile` → Get profile
- `PUT /api/users/profile` → Update profile
- `GET /api/users/discover` → Find partners
- `POST /api/users/connect/:userId` → Connect with user

### Projects
- `POST /api/projects/create` → Create project
- `GET /api/projects` → List all projects
- `POST /api/projects/:projectId/apply` → Apply to project
- `GET /api/projects/user/my-projects` → My projects

---

## 🗄️ Database Models

### User
```javascript
{
  name, email, password,
  bio, skills[], interests[],
  college, year,
  lookingForTeam, isAvailable,
  connections[] (user references)
}
```

### Project
```javascript
{
  title, description,
  createdBy (user ref),
  teamMembers[] (user refs),
  requiredSkills[], category, status,
  hackathon,
  applications[] (with status)
}
```

---

## 🔐 Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

Token expires in **7 days**

---

## 📱 Frontend Integration

Connect frontend to backend by updating API base URL in `client/src/services/api.js`:

```javascript
const API_BASE = 'http://localhost:5000/api';
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB Connection Error | Check `docker-compose ps` and ensure MongoDB is running |
| CORS Errors | Backend has CORS enabled for localhost |
| Port Already in Use | Change PORT in `.env` and adjust frontend API URL |
| Token Expired | Re-login to get new token |

---

## 🛠️ Useful Commands

```bash
# View MongoDB
docker-compose exec mongodb mongosh -u admin -p admin123

# View all containers
docker-compose ps

# Stop all services
docker-compose down

# View backend logs
docker-compose logs -f backend

# Reset database
docker-compose down -v
docker-compose up -d
```

---

## 📚 Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Real-time | Socket.io (optional) |

---

## 🎯 Features

✅ User Authentication (Signup/Login)  
✅ User Profiles with Skills & Interests  
✅ Project Creation & Management  
✅ Partner Discovery & Matching  
✅ Project Applications  
✅ Team Management  
✅ Connection System  

---

## 🚢 Deployment

**Backend**: Heroku, Render, Railway  
**Frontend**: Vercel, Netlify  
**Database**: MongoDB Atlas, AWS

---

**Made with ❤️ for Hackers** 🚀
