# 🚀 HACKMATCH AI - Complete Setup Guide

Bhai, sab kuch tayyar ho gaya! Ab sirf ye 3 steps follow kar:

## ⚡ Quick Start (3 Steps)

### Step 1: Start MongoDB (Docker)
```bash
docker-compose up -d
```

Check if running:
```bash
docker-compose ps
```

See MongoDB UI at: http://localhost:8081

---

### Step 2: Start Backend Server

Open new terminal in `server` folder:
```bash
cd server
npm install
npm run dev
```

Backend will run on: **http://localhost:5000** ✅

---

### Step 3: Start Frontend (existing terminal)

Frontend is already running on: **http://localhost:5173** ✅

---

## 🎯 End Result

When everything is running:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB UI**: http://localhost:8081

---

## 📝 What's Ready

✅ User Authentication (Signup/Login)  
✅ MongoDB Database  
✅ User Profiles  
✅ Project Management  
✅ Partner Discovery  
✅ JWT Authentication  
✅ Error Handling  

---

## 🔌 API Endpoints (Ready to Use)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signup` | Register new users |
| POST | `/api/auth/login` | User login |
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/discover` | Find partners |
| POST | `/api/projects/create` | Create project |
| GET | `/api/projects` | List projects |
| POST | `/api/projects/:id/apply` | Apply to project |

---

## 🧪 Test Signup/Login

### Try this in Signup form:
```
Name: Rahul Singh
Email: rahul@test.com
Password: test123
```

### Then Login with same credentials

---

## 📁 Project Structure

```
hackmatch-ai/
├── client/                # React Frontend (npm run dev)
│   ├── src/
│   │   ├── pages/        # Login, Signup
│   │   ├── components/   # Navbar
│   │   └── services/     # api.js (Backend connection)
│   └── package.json
│
├── server/               # Node.js Backend (npm run dev)
│   ├── src/
│   │   ├── models/       # User, Project schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, error handling
│   │   └── server.js     # Main file
│   └── package.json
│
└── docker-compose.yml    # MongoDB setup
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `mongodb://localhost:27017 failed` | Make sure `docker-compose up -d` is running |
| CORS Error | Backend already has CORS enabled for localhost |
| Port 5000 already in use | Change PORT in `.env` |
| Can't connect to MongoDB | Wait 30 seconds for MongoDB to start |

---

## 🎓 How Frontend Connects to Backend

In `client/src/services/api.js`:

```javascript
export const API_BASE_URL = 'http://localhost:5000/api';

// Usage in components:
const response = await api.auth.signup(name, email, password);
```

---

## 📦 Database (MongoDB)

### Models Ready:

**User**
```
- name, email, password
- bio, skills[], interests[]
- college, year
- connections[] (linked users)
```

**Project**
```
- title, description
- createdBy (user ref)
- teamMembers[] (user refs)
- requiredSkills[]
- applications[]
```

---

## 🔐 Authentication Flow

1. User signs up with email/password
2. Backend creates user, returns JWT token
3. Token stored in browser localStorage
4. All API calls include token in header
5. Token expires in 7 days

---

## 🎯 Next Steps (Optional)

1. Add Dashboard page
2. Create Project List page
3. Add Partner Discovery page
4. Implement real-time chat
5. Deploy to cloud (Vercel + Railway)

---

## 💡 Pro Tips

- Check MongoDB data at: http://localhost:8081
- See backend logs in terminal
- Frontend hot-reloads on save
- Use browser DevTools → Network to debug API calls
- Check `.env` file for secrets

---

**All Set! Happy Coding! 🚀**
