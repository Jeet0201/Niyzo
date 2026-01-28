# 🗄️ MongoDB Configuration Reference

## Current Server Setup

Your `server/index.js` is configured with:

### ✅ Connection String
```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/niyzo';
```

- **Database Name**: `niyzo`
- **Host**: `localhost` (127.0.0.1)
- **Port**: `27017` (standard MongoDB port)
- **Type**: Local TCP connection only

### ✅ Connection Options
```javascript
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,          // Max 10 connections
  minPoolSize: 2,           // Min 2 connections
  serverSelectionTimeoutMS: 5000,   // 5 second timeout
  socketTimeoutMS: 45000,   // 45 second socket timeout
});
```

### ✅ Automatic Logging

The server logs connection events:

```javascript
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
```

### ✅ Error Handling

If MongoDB is not running:

```javascript
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.log('⚠️  ERROR: Cannot connect to local MongoDB at', MONGODB_URI);
  console.log('   Make sure MongoDB is running:');
  console.log('   Windows: mongod');
  console.log('   Or: net start MongoDB');
  process.exit(1);  // Exit if local MongoDB is unavailable
});
```

---

## 🔌 Database Collections

Mongoose automatically creates these collections:

### 1. **questions**
Stores student questions submitted via `/api/questions`

```javascript
{
  _id: ObjectId,
  studentName: String,
  studentEmail: String,
  contact: String,           // Email or mobile
  contactType: String,       // 'email' or 'mobile'
  subject: String,
  question: String,
  status: String,            // 'New', 'Assigned', 'In Progress', 'Resolved'
  assignedMentorId: ObjectId,
  answerText: String,
  answeredByMentorId: ObjectId,
  answeredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **mentors**
Stores mentor profiles (auto-seeded)

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  subject: String,
  initials: String,
  status: String,            // 'Available'
  university: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 3. **professors**
Stores professor profiles

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  subject: String,
  status: String,
  university: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📝 POST /api/questions - Data Save Example

### Request
```bash
POST http://localhost:4000/api/questions
Content-Type: application/json

{
  "studentName": "Alice Johnson",
  "contact": "alice@example.com",
  "subject": "Machine Learning",
  "question": "What is transfer learning?"
}
```

### Server Processing
```javascript
// 1. Middleware validates contact field
validateContactField
  ↓
// 2. Contact is normalized to: "alice@example.com"
// 3. contactType is set to: "email"
  ↓
// 4. Data sent to MongoDB
Question.create({
  studentName: "Alice Johnson",
  contact: "alice@example.com",
  contactType: "email",
  subject: "Machine Learning",
  question: "What is transfer learning?",
  status: "New",
  createdAt: <timestamp>,
  updatedAt: <timestamp>
})
  ↓
// 5. MongoDB saves document with _id
```

### Console Logs
```
📝 Received new question submission:
   Student: Alice Johnson
   Contact: alice@example.com (email)
   Subject: Machine Learning
✅ Question saved to MongoDB:
   ID: 67abc123def456ghi789jk0
   Database: niyzo
   Collection: questions
```

### Response (201 Created)
```json
{
  "_id": "67abc123def456ghi789jk0",
  "studentName": "Alice Johnson",
  "contact": "alice@example.com",
  "contactType": "email",
  "subject": "Machine Learning",
  "question": "What is transfer learning?",
  "status": "New",
  "createdAt": "2026-01-28T14:25:00.000Z",
  "updatedAt": "2026-01-28T14:25:00.000Z",
  "__v": 0
}
```

---

## 🔍 Querying Data Examples

### Using mongosh

```bash
# Connect to MongoDB
mongosh

# Switch to niyzo database
use niyzo

# View all questions
db.questions.find()

# View formatted
db.questions.find().pretty()

# Find questions from specific student
db.questions.find({ studentName: "Alice Johnson" })

# Find email contacts only
db.questions.find({ contactType: "email" })

# Find mobile contacts only
db.questions.find({ contactType: "mobile" })

# Count total questions
db.questions.countDocuments()

# Find unresolved questions
db.questions.find({ status: { $in: ["New", "Assigned", "In Progress"] } })

# Sort by newest first
db.questions.find().sort({ createdAt: -1 })

# Limit to 10 results
db.questions.find().limit(10)
```

### Using Mongoose in Code

```javascript
// Find all questions
const questions = await Question.find();

// Find by student name
const studentQ = await Question.find({ studentName: "Alice" });

// Find one by ID
const question = await Question.findById(id);

// Update status
await Question.updateOne({ _id: id }, { status: "Resolved" });

// Delete a question
await Question.deleteOne({ _id: id });
```

---

## 🛠️ Connection Troubleshooting

### Symptom 1: "Cannot Connect to MongoDB"

**Check List:**
```powershell
# 1. Is MongoDB service running?
Get-Service MongoDB

# 2. If not, start it
net start MongoDB

# 3. Can you connect directly?
mongosh --host localhost --port 27017

# 4. Check if port is open
netstat -ano | findstr :27017
```

### Symptom 2: "ECONNREFUSED"

**Meaning**: MongoDB is not listening on that port.

**Solutions**:
1. Start MongoDB: `net start MongoDB`
2. Or run directly: `mongod --dbpath C:\data\db`
3. Wait 5-10 seconds for MongoDB to fully start
4. Try again

### Symptom 3: "Authentication failed"

**Current Setup**: No authentication (local development)

**If you add authentication later**:
```javascript
const MONGODB_URI = 'mongodb://username:password@localhost:27017/niyzo?authSource=admin';
```

---

## 📊 Data Persistence

### Where is Data Stored?

**Default MongoDB Data Directory:**
```
C:\Program Files\MongoDB\Server\5.0\data
```

Or if you started mongod with:
```powershell
mongod --dbpath C:\data\db
```

Data is at: `C:\data\db`

### Backing Up Data

```powershell
# Using mongodump
mongodump --db niyzo --out C:\backup

# Using file copy (if MongoDB is stopped)
Copy-Item -Path C:\data\db -Destination C:\backup -Recurse
```

### Restoring Data

```powershell
# Using mongorestore
mongorestore --db niyzo C:\backup\niyzo
```

---

## 🔐 Security Considerations

### Current Setup (Development Only)

```
✅ Local connections only
❌ No authentication
❌ No SSL/TLS
❌ No firewall rules
```

### For Production Setup

Add authentication:
```javascript
// server/.env
MONGODB_URI=mongodb://admin:SecurePassword123@localhost:27017/niyzo?authSource=admin

// server/index.js
const MONGODB_URI = process.env.MONGODB_URI;
```

Enable authentication in MongoDB:
```javascript
// In mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "SecurePassword123",
  roles: ["root"]
})

use niyzo
db.createUser({
  user: "app",
  pwd: "AppPassword456",
  roles: ["readWrite"]
})
```

---

## 📈 Performance Settings

### Current Pool Configuration

```javascript
{
  maxPoolSize: 10,    // Handles up to 10 concurrent connections
  minPoolSize: 2,     // Keeps 2 connections always ready
}
```

### For High Traffic, Increase:
```javascript
{
  maxPoolSize: 50,    // For 50+ concurrent users
  minPoolSize: 10,
}
```

---

## ✅ Verification Checklist

- [ ] MongoDB installed and running
- [ ] Connection string: `mongodb://localhost:27017/niyzo`
- [ ] Server starts without connection errors
- [ ] Console shows "✅ MongoDB Connected"
- [ ] POST /api/questions creates documents
- [ ] Console shows "✅ Question saved to MongoDB"
- [ ] Can view data with `mongosh` or MongoDB Compass
- [ ] Data persists after server restart

---

## 📞 Quick Reference

| Command | Purpose |
|---------|---------|
| `net start MongoDB` | Start MongoDB service |
| `net stop MongoDB` | Stop MongoDB service |
| `mongosh` | Open MongoDB shell |
| `node index.js` | Start backend server |
| `Get-Service MongoDB` | Check MongoDB status |

---

✅ **You're all set!** Your backend is ready to save data to local MongoDB.
