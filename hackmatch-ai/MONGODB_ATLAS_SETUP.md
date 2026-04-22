# 🚀 MongoDB Atlas Setup - STEP BY STEP

## Step 1️⃣: Create Account (2 min)

1. **Open this link**: https://www.mongodb.com/cloud/atlas
2. Click **"Try for Free"** (green button)
3. Sign up with:
   - Email: Your email
   - Password: Any password
   - First Name: Your name
4. Click **"Create your account"**
5. Verify email (check inbox)

---

## Step 2️⃣: Create Cluster (10 min)

1. After login, click **"Build a Database"**
2. Select **"M0 (Free)"** tier ✅
3. Select your **region** (closest to you):
   - India → Asia Pacific (Mumbai)
   - USA → North America (Virginia)
4. Click **"Create Deployment"**
5. **WAIT 5-10 minutes** for cluster to deploy
   - (You'll see a loading indicator)

---

## Step 3️⃣: Create Database User (2 min)

1. A popup appears asking for **username & password**
2. Enter:
   - **Username**: `hackmatch`
   - **Password**: `User@123456` (make it strong!)
3. ⚠️ **SAVE THESE** (write down somewhere)
4. Click **"Create User"**

---

## Step 4️⃣: Allow Your IP (1 min)

1. In the popup, click **"Add My Current IP Address"**
2. Your IP is automatically detected ✅
3. Click **"Confirm"**

---

## Step 5️⃣: Get Connection String (1 min)

1. Cluster deployment completes (green checkmark)
2. Click **"Drivers"** button (or "Connect")
3. Select:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
4. **Copy the connection string**
   - Looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

5. **Replace in the string**:
   - `<username>` → `hackmatch`
   - `<password>` → `User@123456`
   - Add at end → `/hackmatch-ai`

**Final string should look like**:
```
mongodb+srv://hackmatch:User@123456@cluster0.xxxxx.mongodb.net/hackmatch-ai?retryWrites=true&w=majority
```

---

## Step 6️⃣: Update .env File

Open file: `server/.env`

Replace:
```
MONGODB_URI=mongodb://localhost:27017/hackmatch-ai
```

With your connection string:
```
MONGODB_URI=mongodb+srv://hackmatch:User@123456@cluster0.xxxxx.mongodb.net/hackmatch-ai?retryWrites=true&w=majority
```

**Save file!** ✅

---

## Step 7️⃣: Restart Backend

Open terminal and run:
```powershell
cd c:\Users\ompra\OneDrive\Desktop\hackfinder\hackmatch-ai\server
node src/server.js
```

Should show:
```
🚀 Server started on http://localhost:5000
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

## ✅ Done!

Your app is now connected to MongoDB! 🎉

- Frontend: http://localhost:5174
- Backend: http://localhost:5000
- Database: MongoDB Atlas (Cloud)

**Now data will be saved permanently!**

---

## 🔧 If You Get Error:

| Error | Fix |
|-------|-----|
| `authentication failed` | Check username/password is correct in `<>` |
| `connection timeout` | Check "Network Access" - add your IP |
| `ECONNREFUSED` | Copy full connection string again |

---

**Paste the connection string after step 5! Let me know when done! 👍**
