# 🎯 Complete Setup & Deployment Guide

## Project Overview

**Meeting Notes Generator** - An AI-powered application that converts meeting transcripts into structured summaries with automatically extracted action items, deadlines, and owner assignments.

- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: FastAPI + Python
- **AI**: Claude API (Anthropic)
- **Database**: MongoDB
- **Status**: ✅ Fully Scaffolded & Ready to Run

## 📋 Pre-Installation Checklist

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Python 3.10+ installed ([Download](https://www.python.org/))
- [ ] MongoDB installed or Atlas account ([Setup](https://www.mongodb.com/cloud/atlas))
- [ ] Claude API key obtained ([Get here](https://console.anthropic.com/))
- [ ] Git installed (for cloning if needed)

## 🚀 Installation (Choose One Method)

### Method 1: Automated Setup (Windows)
```powershell
# In project root
.\setup.bat
```

### Method 2: Automated Setup (macOS/Linux)
```bash
# In project root
chmod +x setup.sh
./setup.sh
```

### Method 3: Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
cp .env.example .env    # macOS/Linux

# Edit .env and add your Claude API key
# CLAUDE_API_KEY=sk_your_actual_key
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
copy .env.example .env.local  # Windows
cp .env.example .env.local    # macOS/Linux
```

## 🗄️ Database Setup

### Option A: Local MongoDB (Recommended for Development)

**Using Docker (Easiest):**
```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify connection
mongosh mongodb://localhost:27017
```

**Manual Installation:**
1. Download from: https://www.mongodb.com/try/download/community
2. Install and follow the installer
3. MongoDB will run on `localhost:27017` by default

### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `CLAUDE_API_KEY` in `backend/.env`:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/meeting_notes_db
   ```

## 🔑 Configure Claude API Key

1. Visit https://console.anthropic.com/
2. Navigate to API Keys section
3. Create new key
4. Copy it
5. Open `backend/.env` and paste:
   ```
   CLAUDE_API_KEY=sk_ant_xxxxxxxxxxxx
   ```

## ▶️ Running the Application

### Terminal 1: Start Backend Server
```bash
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start server
python main.py
```

**Expected Output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
INFO:     Connected to MongoDB: meeting_notes_db
```

**API Documentation**: Open http://localhost:8000/docs in browser

### Terminal 2: Start Frontend Server
```bash
cd frontend

# Start development server
npm run dev
```

**Expected Output:**
```
> next dev
- Local:        http://localhost:3000
- Environments: .env.local
```

### Browser: Open Application
Visit: **http://localhost:3000**

## ✨ Features to Try

1. **Upload Transcript**
   - Paste meeting notes or upload text file
   - Click "Analyze Transcript"

2. **View Analysis**
   - See AI-generated summary
   - Browse key discussion points
   - Review extracted action items

3. **Manage Action Items**
   - See priority levels
   - View assigned owners
   - Check deadlines

4. **Export Results**
   - Download as JSON, PDF, or CSV
   - Share with team

## 🐳 Docker Deployment

### Build & Run with Docker Compose

```bash
# In project root
docker-compose up --build
```

This will:
- Build backend image
- Build frontend image
- Start MongoDB
- Start backend (http://localhost:8000)
- Start frontend (http://localhost:3000)

### Stop Services
```bash
docker-compose down
```

## 📦 Project Structure

```
gmeet/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # REST endpoints
│   │   ├── services/       # Claude AI & database
│   │   ├── models/         # Data schemas
│   │   └── core/           # Configuration
│   ├── main.py             # Server entry
│   └── requirements.txt
│
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages
│   │   ├── components/    # React components
│   │   ├── lib/           # API & utilities
│   │   ├── store/         # State management
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── next.config.js
│
├── README.md              # Main documentation
├── QUICK_START.md         # Quick setup guide
├── ARCHITECTURE.md        # Technical details
├── CONTRIBUTING.md        # Contribution guide
└── docker-compose.yml     # Container config
```

## 🔧 Common Commands

### Backend
```bash
cd backend

# Activate environment
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Run server
python main.py

# Format code
pip install black
black .

# Lint code
pip install flake8
flake8 .

# Type check
pip install mypy
mypy .
```

### Frontend
```bash
cd frontend

# Run dev server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Run linter
npm run lint

# Run type check
npm run type-check

# Clean build
rm -rf .next
```

## 🆘 Troubleshooting

### Issue: "Connection refused" at localhost:8000

**Solution:**
- Ensure backend server is running in another terminal
- Check if you're in the backend directory
- Verify Python virtual environment is activated

### Issue: MongoDB connection error

**Solution:**
```bash
# Check if Docker container is running
docker ps

# If not, start it
docker run -d -p 27017:27017 --name mongodb mongo:latest

# If already exists, restart it
docker start mongodb
```

### Issue: CLAUDE_API_KEY not found

**Solution:**
1. Open `backend/.env`
2. Make sure line exists: `CLAUDE_API_KEY=sk_...`
3. Paste your actual key from Anthropic
4. Restart backend server

### Issue: Port already in use

**Windows:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill the process (replace PID)
kill -9 <PID>
```

### Issue: npm not found

**Solution:**
- Install Node.js from https://nodejs.org/
- Close and reopen terminal after installation

### Issue: Python not found

**Solution:**
- Install Python from https://www.python.org/
- Add Python to PATH during installation
- Restart terminal after installation

## 📚 Documentation

- **[README.md](README.md)** - Project overview and features
- **[QUICK_START.md](QUICK_START.md)** - 5-minute setup guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical architecture
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines

## 📖 API Documentation

When backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🚀 Next Steps

1. **Customize UI**
   - Edit colors in `frontend/tailwind.config.js`
   - Modify components in `frontend/src/components/`

2. **Improve AI Analysis**
   - Edit prompt in `backend/app/services/claude_service.py`
   - Add custom processing logic

3. **Extend Features**
   - Add user authentication
   - Integrate calendar tools
   - Add meeting search
   - Create analytics dashboard

4. **Deploy to Production**
   - Option A: Use Docker
   - Option B: Deploy backend to Heroku/Railway/Render
   - Option C: Deploy frontend to Vercel

## 🤝 Community & Support

- **Issues**: Report on GitHub
- **Discussions**: Ask questions on GitHub Discussions
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📝 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | FastAPI, Python 3.10+ |
| **AI** | Claude API (Anthropic) |
| **Database** | MongoDB with Motor (async) |
| **State** | Zustand |
| **HTTP** | Axios |
| **Icons** | Lucide React |
| **Containers** | Docker, Docker Compose |

## ✅ Verification Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Frontend running on http://localhost:3000
- [ ] MongoDB connected and responding
- [ ] API documentation visible at http://localhost:8000/docs
- [ ] Can upload and analyze a transcript
- [ ] Results display correctly
- [ ] Export functionality works

## 🎓 Learning Resources

- **FastAPI**: https://fastapi.tiangolo.com/
- **Next.js**: https://nextjs.org/docs
- **Claude API**: https://docs.anthropic.com/
- **MongoDB**: https://docs.mongodb.com/
- **React**: https://react.dev/

---

**You're all set! Start building! 🚀**

For detailed technical information, see [ARCHITECTURE.md](ARCHITECTURE.md)
