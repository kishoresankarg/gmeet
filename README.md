# Meeting Notes Generator - AI-Powered Meeting Transcript Analysis

A full-stack application that converts meeting transcripts into structured summaries with automatically extracted action items, key points, and task assignments.

## 🎯 Features

- **Transcript Analysis**: Paste or upload meeting transcripts for AI-powered analysis
- **Automatic Summary**: Generate concise meeting summaries
- **Action Item Extraction**: Automatically identify and extract tasks with:
  - Task descriptions
  - Owner assignment
  - Priority levels (High, Medium, Low)
  - Deadlines
  - Status tracking
- **Key Points Extraction**: Identify and list important discussion points
- **Meeting History**: Search and retrieve previous meeting analyses
- **Export Options**: Export analysis to JSON, PDF, or CSV formats
- **Integration Ready**: Designed for integration with Notion, Trello, and other PM tools

## 🏗️ Project Structure

```
gmeet/
├── frontend/                 # Next.js React frontend
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and API client
│   │   ├── store/           # Zustand state management
│   │   ├── types/           # TypeScript types
│   │   └── styles/          # CSS and Tailwind
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── api/             # API routes
│   │   ├── models/          # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── core/            # Configuration and database
│   ├── main.py              # Application entry
│   ├── requirements.txt
│   └── .env.example
│
├── .github/
│   └── copilot-instructions.md
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- MongoDB (local or Atlas)
- Claude API Key (from Anthropic)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/Scripts/activate  # On Windows
source venv/bin/activate      # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your Claude API key
```

**Environment Variables:**
- `CLAUDE_API_KEY`: Your Anthropic Claude API key
- `MONGODB_URL`: MongoDB connection string (default: mongodb://localhost:27017)
- `DATABASE_NAME`: Database name (default: meeting_notes_db)
- `ENVIRONMENT`: development or production
- `DEBUG`: Enable debug mode

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed (API endpoint defaults to localhost:8000)

# Run development server
npm run dev
```

### 3. Run MongoDB

**Option A: Local MongoDB**
```bash
# With Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
# https://docs.mongodb.com/manual/installation/
```

**Option B: MongoDB Atlas Cloud**
- Get connection string from MongoDB Atlas
- Update `MONGODB_URL` in backend `.env`

### 4. Start Application

**Terminal 1 - Backend (API runs on port 8000):**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Frontend (Web app runs on port 3000):**
```bash
cd frontend
npm run dev
```

Open browser to: `http://localhost:3000`

## 📖 API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints

**POST `/api/transcripts/analyze`**
- Analyzes meeting transcript
- Returns: summary, key points, action items

**POST `/api/transcripts`**
- Creates new transcript record
- Returns: saved transcript with ID

**GET `/api/transcripts`**
- Lists all transcripts (paginated)
- Query params: `skip`, `limit`

**GET `/api/transcripts/{id}`**
- Retrieves single transcript

**GET `/api/transcripts/search?q=keyword`**
- Searches transcripts by title/content

**DELETE `/api/transcripts/{id}`**
- Deletes a transcript

## 💡 How It Works

1. **User uploads transcript**: Paste or upload meeting transcript
2. **Frontend sends to backend**: API request with raw content
3. **Backend processes**: 
   - Sends content to Claude API
   - Claude extracts summary, key points, and action items
   - Results stored in MongoDB
4. **Display results**: UI shows structured analysis
5. **Export/Share**: Download as JSON, PDF, or CSV

### Claude API Integration

The system uses Claude's NLP capabilities to:
- Summarize meetings concisely
- Extract actionable tasks
- Identify priorities and deadlines
- Assign owners when mentioned
- Extract key discussion points

## 🔧 Tech Stack

**Frontend:**
- React 18 + Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (HTTP client)
- Lucide React (icons)

**Backend:**
- FastAPI (Python web framework)
- Pydantic (data validation)
- MongoDB (document database)
- Motor (async MongoDB driver)
- Anthropic Claude API
- CORS middleware

**Deployment Ready:**
- Dockerizable
- Environment-based config
- Error handling & logging
- Async operations

## 📝 Example Usage

**Input Meeting Transcript:**
```
Meeting: Q1 Planning Session
Participants: John, Sarah, Mike

Sarah: "We need to finalize the design by next Friday."
John: "I'll take care of that. Also, we need to review the API docs."
Mike: "Can someone update the deployment script? I can help if needed."
```

**Output:**
```
Summary: Team discussed Q1 objectives including finalizing designs 
and updating documentation.

Key Points:
- Design finalization critical for Q1
- API documentation needs review
- Deployment script requires updates

Action Items:
1. Finalize design [Sarah] - HIGH - Due: Next Friday
2. Review API docs [John] - MEDIUM - Due: TBD
3. Update deployment script [Mike] - MEDIUM - Status: Pending
```

## 🚀 Future Features

- [ ] Google Meet integration (automatic transcript fetching)
- [ ] Notion/Trello export integration
- [ ] Real-time meeting transcription
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Integration with calendar tools
- [ ] Custom action item templates
- [ ] Team collaboration features
- [ ] Meeting analytics dashboard
- [ ] Automated meeting reminder system

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using Cloud MongoDB

**Claude API Error:**
- Verify API key is set correctly in `.env`
- Check API key is active on Anthropic platform
- Monitor API usage/credits

**CORS Issues:**
- Ensure frontend URL is in backend `CORS_ORIGINS`
- Check `NEXT_PUBLIC_API_URL` in frontend `.env`

**Port Already in Use:**
- Backend: Change uvicorn port in `main.py`
- Frontend: `npm run dev -- -p 3001`

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Built with ❤️ using Claude API, FastAPI, and Next.js**
