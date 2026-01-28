# 🗄️ Local MongoDB Setup Guide

## ✅ Configuration Summary

Your backend is now configured to use **local MongoDB** at:

```
mongodb://localhost:27017/niyzo
```

- **Database Name**: `niyzo`
- **Host**: `localhost`
- **Port**: `27017`
- **Connection Type**: Local only (no cloud/Atlas)

---

## 📋 Current Server Configuration

### MongoDB Connection (server/index.js)

```javascript
// MongoDB connection - Local MongoDB only
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/niyzo';

mongoose.set('strictQuery', true);

// Connection event listeners for logging
mongoose.connection.on('connecting', () => {
  console.log('🔄 Connecting to MongoDB...');
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connected');
  console.log(`   URI: ${MONGODB_URI}`);
  console.log(`   Database: niyzo`);
  console.log(`   Status: Ready for data operations`);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

// Connect with timeout and pool settings
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

---

## 🔌 Starting Local MongoDB

### Option 1: MongoDB Community Edition (Windows)

**Start MongoDB Service:**
```powershell
net start MongoDB
```

**Stop MongoDB Service:**
```powershell
net stop MongoDB
```

**Verify MongoDB is Running:**
```powershell
mongosh
# Or: mongo
```

### Option 2: Direct mongod Command

```powershell
mongod --dbpath C:\data\db
```

Make sure `C:\data\db` directory exists.

### Option 3: Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Click "Connect" to default local connection
3. You'll see `mongodb://localhost:27017` is connected

---

## 🚀 Starting Your Backend Server

### Install Dependencies (if needed)

```bash
cd C:\Niyzo Project\server
npm install
```

### Start the Server

```bash
node index.js
```

### Expected Console Output

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

---

## 📝 Mongoose Schema Example

### Question Schema (Already Configured)

```javascript
const questionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentEmail: { type: String },
    contact: { type: String },
    contactType: { type: String, enum: ['email', 'mobile'] },
    subject: { type: String, required: true },
    question: { type: String, required: true },
    status: { type: String, enum: ['New', 'Assigned', 'In Progress', 'Resolved'], default: 'New' },
    assignedMentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
    answerText: { type: String },
    answeredByMentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
    answeredAt: { type: Date }
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);
```

---

## 📤 Testing Data Save - POST /api/questions

### Request Example

```bash
curl -X POST http://localhost:4000/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe",
    "contact": "john@example.com",
    "subject": "JavaScript",
    "question": "How do I use async/await?"
  }'
```

### Server Console Log (When Data Saved)

```
📝 Received new question submission:
   Student: John Doe
   Contact: john@example.com (email)
   Subject: JavaScript
✅ Question saved to MongoDB:
   ID: 67aba1c2d1e4f5c3b2a8e9f1
   Database: niyzo
   Collection: questions
```

### Response (201 Created)

```json
{
  "_id": "67aba1c2d1e4f5c3b2a8e9f1",
  "studentName": "John Doe",
  "contact": "john@example.com",
  "contactType": "email",
  "subject": "JavaScript",
  "question": "How do I use async/await?",
  "status": "New",
  "createdAt": "2026-01-28T10:30:00.000Z",
  "updatedAt": "2026-01-28T10:30:00.000Z"
}
```

---

## 🔍 Viewing Data in MongoDB

### Using MongoDB Compass (GUI)

1. Open MongoDB Compass
2. Click "Connect"
3. Navigate to: `niyzo` → `questions`
4. View all saved questions with full details

### Using mongosh (Terminal)

```powershell
mongosh

# Switch to niyzo database
use niyzo

# View all questions
db.questions.find()

# View with formatted output
db.questions.find().pretty()

# Count questions
db.questions.countDocuments()

# View specific question
db.questions.findOne()
```

### Using MongoDB Atlas UI (if you install locally)

You can also use the MongoDB web interface if available.

---

## 🛠️ Troubleshooting

### Error: "MongoDB connection failed"

**Problem**: Server can't connect to local MongoDB

**Solutions**:
1. ✅ Verify MongoDB is running: `net start MongoDB`
2. ✅ Check MongoDB port (default: 27017) is not blocked
3. ✅ Ensure `mongodb://localhost:27017/niyzo` is accessible
4. ✅ Check firewall isn't blocking port 27017

### Error: "ECONNREFUSED 127.0.0.1:27017"

**Problem**: MongoDB service is not running

**Solution**:
```powershell
# Windows
net start MongoDB

# Or run mongod directly
mongod --dbpath C:\data\db
```

### Error: "Database 'niyzo' not found"

**Normal**: Mongoose creates the database on first write operation.

Just make a POST request to create a question, and the database will be created automatically.

---

## 📊 Data Structure in MongoDB

### Collections Created Automatically

1. **questions** - Student questions
2. **mentors** - Mentor profiles
3. **professors** - Professor profiles

### Example Document (Question)

```json
{
  "_id": ObjectId("67aba1c2d1e4f5c3b2a8e9f1"),
  "studentName": "John Doe",
  "studentEmail": null,
  "contact": "john@example.com",
  "contactType": "email",
  "subject": "JavaScript",
  "question": "How do I use async/await?",
  "status": "New",
  "assignedMentorId": null,
  "answerText": null,
  "answeredByMentorId": null,
  "answeredAt": null,
  "createdAt": ISODate("2026-01-28T10:30:00.000Z"),
  "updatedAt": ISODate("2026-01-28T10:30:00.000Z"),
  "__v": 0
}
```

---

## ✅ Verification Checklist

- [ ] MongoDB is installed locally
- [ ] MongoDB service is running (`net start MongoDB`)
- [ ] Backend server starts without connection errors
- [ ] Console shows "✅ MongoDB Connected"
- [ ] POST /api/questions creates documents
- [ ] Console shows "✅ Question saved to MongoDB"
- [ ] Can view data in MongoDB Compass
- [ ] mongosh `db.questions.find()` returns documents

---

## 🔒 Security Notes

- **Local Only**: Configuration only accepts local connections
- **No Cloud**: No MongoDB Atlas or external URLs
- **No Auth**: Default local MongoDB has no authentication
- **For Production**: Add authentication, enable SSL/TLS, use proper credentials

---

## 📝 Environment Variables (Optional)

If you want to override the database name, create `.env`:

```
MONGODB_URI=mongodb://localhost:27017/niyzo
PORT=4000
```

---

## 🎯 Quick Start Command

### Start Everything

```powershell
# Terminal 1: Start MongoDB
net start MongoDB
# Or: mongod --dbpath C:\data\db

# Terminal 2: Start Backend
cd C:\Niyzo Project\server
node index.js

# Terminal 3: Test with curl or start frontend
npm run dev
```

---

## 📚 Useful MongoDB Commands

```bash
# Connect to MongoDB
mongosh

# List all databases
show dbs

# Switch to niyzo database
use niyzo

# List all collections
show collections

# View all questions
db.questions.find()

# View all mentors
db.mentors.find()

# Count documents
db.questions.countDocuments()

# Find specific student's questions
db.questions.find({ studentName: "John Doe" })

# Find by contact type
db.questions.find({ contactType: "email" })

# Delete a question (by ID)
db.questions.deleteOne({ _id: ObjectId("...") })

# Drop entire collection
db.questions.drop()

# Drop entire database
db.dropDatabase()
```

---

## 🎉 You're All Set!

Your backend is now configured to:
✅ Connect to local MongoDB at `mongodb://localhost:27017/niyzo`
✅ Save all form submissions to the database
✅ Log connection status and data saves
✅ Use Mongoose schemas for type safety
✅ Support contact field validation with backend save

**Start your server and begin collecting data!** 🚀
