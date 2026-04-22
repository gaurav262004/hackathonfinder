# HackMatch AI Backend

Complete backend API for the HackMatch AI platform - a hackathon partner matching application.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hackmatch-ai
JWT_SECRET=your_super_secret_key_here
```

### 3. Setup MongoDB

#### Option A: Local MongoDB
Install MongoDB locally from https://www.mongodb.com/try/download/community

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string and replace `MONGODB_URI` in `.env`

### 4. Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile (requires auth)
- `PUT /api/users/profile` - Update profile (requires auth)
- `GET /api/users/discover` - Get available users for matching (requires auth)
- `GET /api/users/:userId` - Get specific user profile
- `POST /api/users/connect/:userId` - Connect with user

### Projects
- `POST /api/projects/create` - Create new project (requires auth)
- `GET /api/projects` - Get all open projects
- `GET /api/projects/:projectId` - Get project details
- `POST /api/projects/:projectId/apply` - Apply to project (requires auth)
- `PUT /api/projects/:projectId/application/:appId` - Update application status (requires auth)
- `GET /api/projects/user/my-projects` - Get user's projects

## Request Examples

### Signup
```json
POST /api/auth/signup
{
  "name": "Rahul Singh",
  "email": "rahul@college.edu",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "rahul@college.edu",
  "password": "password123"
}
```

### Update Profile
```json
PUT /api/users/profile
Headers: Authorization: Bearer <token>
{
  "bio": "Passionate developer looking for AI projects",
  "skills": ["JavaScript", "React", "Node.js", "AI/ML"],
  "interests": ["AI", "Web Development"],
  "college": "MIT",
  "year": "3rd",
  "lookingForTeam": true
}
```

### Create Project
```json
POST /api/projects/create
Headers: Authorization: Bearer <token>
{
  "title": "AI-Powered Chat Bot",
  "description": "Building an intelligent chatbot using NLP",
  "requiredSkills": ["Python", "NLP", "Machine Learning"],
  "category": "AI/ML",
  "hackathon": "HackFest 2025"
}
```

## Database Models

### User
- name, email, password
- bio, skills, interests
- college, year
- lookingForTeam, isAvailable
- connections (array of user IDs)

### Project
- title, description
- createdBy (user ID)
- teamMembers (array of user IDs)
- requiredSkills, category, status
- hackathon
- applications (array with user ID and status)

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

Token expires in 7 days.

## Technologies Used

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running locally or check your MongoDB Atlas connection string

**CORS Error:**
- Update the frontend API calls to use `http://localhost:5000`

**Authentication Error:**
- Make sure token is correct and not expired
- Check JWT_SECRET matches in .env

---

Happy Hacking! 🚀
