# 🚀 MongoDB Setup Guide - Choose 1 Option

## ⚡ OPTION 1: MongoDB Atlas (Cloud) - RECOMMENDED ✅

**Fastest way (5 minutes)**

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try for Free"
3. Sign up with email

### Step 2: Create Cluster
1. Choose "Build a Database"
2. Select "Free" tier (M0)
3. Choose your region (pick closest to you)
4. Click "Create"
5. Wait 5-10 minutes for cluster to deploy

### Step 3: Get Connection String
1. In Atlas, click "Connect"
2. Choose "Drivers"
3. Driver: Node.js
4. Copy the connection string
5. Replace `<password>` with your database password

### Step 4: Update .env
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hackmatch-ai?retryWrites=true&w=majority
```

---

## 🖥️ OPTION 2: Local Installation (Windows)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: 7.0.0
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install
1. Run the installer
2. Click "Next" through all screens
3. ✅ Check "Install MongoDB as a Service"
4. Click "Install"

### Step 3: Verify Installation
Open new PowerShell and run:
```powershell
mongosh
```

Should show MongoDB prompt: `test>`

Exit: `exit`

### Step 4: No .env changes needed!
Already set to: `mongodb://localhost:27017/hackmatch-ai`

---

## 🔄 After Setup - Restart Backend

```powershell
cd server
node src/server.js
```

Should now show:
```
✅ MongoDB Connected: localhost
```

---

## 📝 If Using MongoDB Atlas:

Make sure to:
1. ✅ Add your IP to IP Whitelist in Atlas
   - Click "Security" → "Network Access"
   - Add your IP (or 0.0.0.0/0 for anywhere)
2. ✅ Create database user
   - Click "Security" → "Database Access"
   - Add username/password
3. ✅ Use this format in connection string:
   ```
   mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hackmatch-ai
   ```

---

## 🚨 Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | MongoDB not running - install and start it |
| Authentication failed | Wrong username/password in connection string |
| Cluster not deploying | Wait 10 minutes, refresh page |
| Can't connect after 10s | Check IP whitelist in Atlas settings |

---

**Which option do you want? (Atlas or Local?)**
