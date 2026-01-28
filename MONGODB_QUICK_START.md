# 🚀 Local MongoDB Quick Start

## ⚡ 30-Second Setup

### 1️⃣ Start MongoDB
```powershell
net start MongoDB
# Wait for: "MongoDB service started successfully"
```

### 2️⃣ Start Backend Server
```powershell
cd C:\Niyzo Project\server
node index.js
```

### 3️⃣ Expected Console Output
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected
   URI: mongodb://localhost:27017/niyzo
   Database: niyzo
   Status: Ready for data operations

============================================================
🚀 API SERVER STARTED
============================================================
📍 Server: http://localhost:4000
📊 Database: MongoDB (niyzo)
📬 Connection: mongodb://localhost:27017/niyzo
============================================================
```

✅ **Server is ready!** Your data will be saved to MongoDB.

---

## 📝 Test with Sample Data

### POST /api/questions
```bash
curl -X POST http://localhost:4000/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Jane Smith",
    "contact": "jane@university.edu",
    "subject": "Python",
    "question": "How do I use decorators in Python?"
  }'
```

### Server Console Output
```
📝 Received new question submission:
   Student: Jane Smith
   Contact: jane@university.edu (email)
   Subject: Python
✅ Question saved to MongoDB:
   ID: 67aba1c2d1e4f5c3b2a8e9f1
   Database: niyzo
   Collection: questions
```

✅ **Data saved!** Check MongoDB Compass to verify.

---

## 🔍 View Saved Data

### Option 1: MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to default local
3. Browse: `niyzo` → `questions`

### Option 2: mongosh (Terminal)
```bash
mongosh
use niyzo
db.questions.find().pretty()
```

---

## ⚙️ Configuration Details

| Setting | Value |
|---------|-------|
| **Database** | `niyzo` |
| **Host** | `localhost` |
| **Port** | `27017` |
| **URI** | `mongodb://localhost:27017/niyzo` |
| **Type** | Local only (no cloud) |
| **Connection Type** | Direct TCP |
| **Max Pool Size** | 10 connections |
| **Timeout** | 5 seconds |

---

## 🆘 If Connection Fails

### Issue: "Cannot connect to local MongoDB"

**Check 1: Is MongoDB running?**
```powershell
# Verify service status
Get-Service MongoDB

# Start if needed
net start MongoDB
```

**Check 2: Is port 27017 accessible?**
```powershell
# Test connection
mongosh --host localhost --port 27017
```

**Check 3: Connection string correct?**
```
✅ CORRECT:  mongodb://localhost:27017/niyzo
❌ WRONG:    mongodb://atlas... (cloud)
❌ WRONG:    mongodb://127.0.0.1:27016 (wrong port)
```

---

## 🎯 Data Flow

```
Frontend Form
    ↓
    ↓ (HTTPS Request)
    ↓
Express Server (localhost:4000)
    ↓
    ↓ (validateContactField middleware)
    ↓
Mongoose Schema
    ↓
    ↓ (Question.create)
    ↓
MongoDB Database (niyzo)
    ↓
    ↓ (Collection: questions)
    ↓
✅ Data Persisted
```

---

## 📚 Key Files Modified

| File | Change |
|------|--------|
| `server/index.js` | Added local MongoDB config + logging |
| `.env` (optional) | Can override `MONGODB_URI` |

---

## 📊 Monitoring Connections

### Server Logs Show:

**On Startup:**
```
🔄 Connecting to MongoDB...
✅ MongoDB Connected
```

**On Form Submission:**
```
📝 Received new question submission:
✅ Question saved to MongoDB:
```

**On Disconnect:**
```
⚠️  MongoDB disconnected
```

---

## 🔐 Important Notes

- ✅ Local MongoDB only (no cloud)
- ✅ Authentication disabled (development only)
- ✅ Data persists between restarts
- ✅ Backups NOT automatic (manually backup `C:\data\db`)
- ⚠️ NOT for production (add auth, SSL, etc.)

---

## 📞 Support Commands

```powershell
# Check MongoDB status
Get-Service MongoDB

# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# View MongoDB logs
# File: C:\Program Files\MongoDB\Server\5.0\log\mongod.log

# Check if port 27017 is listening
netstat -ano | findstr :27017

# Connect to MongoDB shell
mongosh

# View all data
mongosh
use niyzo
db.questions.find().pretty()
```

---

✅ **Everything is configured!** Start the server and your data will be saved to local MongoDB.
