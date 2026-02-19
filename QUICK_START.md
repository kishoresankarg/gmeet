# 🚀 Quick Start Guide - Meeting Notes Generator

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.10+** - [Download](https://www.python.org/)
- **MongoDB** - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)
- **Claude API Key** - [Get from Anthropic](https://console.anthropic.com/)

## 5-Minute Setup (Windows)

### Step 1: Clone/Download Project
```bash
# Navigate to the project folder
cd gmeet
```

### Step 2: Get Claude API Key
1. Go to https://console.anthropic.com/
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy it (you'll need this in the next step)

### Step 3: Setup Backend

**Open PowerShell/Command Prompt in `backend` folder:**

```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env

# Edit .env file and add your Claude API key
# Open .env in notepad and update:
# CLAUDE_API_KEY=sk_your_key_here
```

### Step 4: Setup MongoDB

**Option A: Use Docker (Easy)**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: Manual Installation**
- Install from https://www.mongodb.com/try/download/community
- Start the MongoDB service

### Step 5: Setup Frontend

**Open PowerShell/Command Prompt in `frontend` folder:**

```powershell
# Install dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Note: .env.local already points to http://localhost:8000/api (no changes needed)
```

## Starting the Application

### Terminal 1: Start Backend (API Server)
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Terminal 2: Start Frontend (Web App)
```powershell
cd frontend
npm run dev
```

Expected output:
```
- Local:        http://localhost:3000
```

### Step 3: Open in Browser
Visit: **http://localhost:3000**

## 🎯 How to Use

1. **Input Transcript**: Paste your meeting transcript in the text area
2. **Add Title**: Give the meeting a descriptive title
3. **Click "Analyze Transcript"**: Wait for AI processing
4. **View Results**:
   - Summary of the meeting
   - Key points discussed
   - Action items with owners and deadlines
5. **Export**: Download results as JSON, PDF, or CSV

## 📚 Example Workflow

### Sample Meeting Transcript:

```
Meeting: Product Roadmap Review
Participants: Alice (Product), Bob (Engineering), Carol (Design)

Alice: "We need to finalize the new dashboard by end of month. Bob, can you lead this?"
Bob: "Sure, I'll need 2 weeks for development. Carol, when can you have designs ready?"
Carol: "I'll have wireframes by next Friday, high-fidelity by the following week."
Alice: "Perfect. Also, let's schedule QA review for week 3. Someone should document requirements."
Bob: "I'll document everything as we go."
Carol: "I need developer feedback on complex interactions."
```

### Generated Output:

**Summary:**
Product team discussed new dashboard delivery timeline with design and development phases planned for month completion.

**Key Points:**
- New dashboard due by end of month
- Design phase: Wireframes by Friday, high-fidelity next week
- Development: 2 weeks required
- QA review scheduled for week 3
- Documentation required

**Action Items:**
1. Lead dashboard development → Bob (HIGH) - Due: End of Month
2. Create dashboard wireframes → Carol (HIGH) - Due: Next Friday
3. Document requirements → Bob (MEDIUM) - Due: TBD
4. Provide feedback on interactions → Carol (MEDIUM) - Due: Design Phase

## 🔧 Troubleshooting

### "Connection refused" at http://localhost:8000

**Solution:**
- Ensure backend server is running (`python main.py`)
- Check you're in the right directory
- Try stopping and restarting the server

### "MongoDB connection error"

**Solution:**
```powershell
# Check if MongoDB is running
docker ps  # Should show 'meeting_notes_mongodb'

# If not running:
docker run -d -p 27017:27017 --name mongodb mongo:latest

# If already exists:
docker start mongodb
```

### "CLAUDE_API_KEY not found"

**Solution:**
1. Open `backend/.env` file
2. Paste your API key: `CLAUDE_API_KEY=sk_your_actual_key`
3. Save the file
4. Restart backend server

### Error: "npm not found"

**Solution:**
- Install Node.js from https://nodejs.org/
- Close and reopen your terminal after installation

### "Port 3000/8000 already in use"

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different ports:
# Backend: python main.py (modify main.py, port parameter)
# Frontend: npm run dev -- -p 3001
```

## 📖 API Documentation

Once backend is running, visit: **http://localhost:8000/docs**

This opens an interactive API documentation where you can test all endpoints.

## 📁 Project Structure

```
gmeet/
├── backend/                 # FastAPI Python server
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── services/       # Business logic (Claude AI, MongoDB)
│   │   ├── models/         # Data schemas
│   │   └── core/           # Config & database
│   ├── main.py             # Server entry
│   └── requirements.txt
│
├── frontend/               # Next.js React app
│   ├── src/
│   │   ├── app/           # Next.js pages & layout
│   │   ├── components/    # React components
│   │   ├── lib/           # API client & services
│   │   └── store/         # State management
│   ├── package.json
│   └── next.config.js
│
└── README.md
```

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **Claude API**: https://docs.anthropic.com/
- **MongoDB**: https://docs.mongodb.com/

## 🆘 Getting Help

1. Check the Troubleshooting section above
2. Review API docs at http://localhost:8000/docs
3. Check browser console (F12) for frontend errors
4. Check terminal output for server errors

## 🎉 Next Steps

1. **Customize**: Modify colors and styling in `frontend/src/styles/`
2. **Extend**: Add more Claude prompts in `backend/app/services/claude_service.py`
3. **Database**: Switch from local MongoDB to MongoDB Atlas
4. **Deploy**: Use Docker Compose or deploy to cloud platforms

---

**Happy analyzing! 🚀**
