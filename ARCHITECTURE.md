# Architecture & Development Guide

## Project Architecture

### Overview Diagram

```
┌─────────────────┐
│   User Browser  │
│   React/Next.js │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────────────────────────┐
│      FastAPI Backend                │
│  ┌─────────────────────────────┐   │
│  │   API Routes & Endpoints    │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────▼────────────────┐   │
│  │   Claude AI Service         │   │
│  │ (Transcript Analysis)       │   │
│  └────────────┬────────────────┘   │
│               │                     │
│  ┌────────────▼────────────────┐   │
│  │   Transcript Service        │   │
│  │ (Database Operations)       │   │
│  └────────────┬────────────────┘   │
│               │                     │
└───────────────┼────────────────────┘
                │
         ┌──────▼──────┐
         │   MongoDB   │
         │  (Documents)│
         └─────────────┘
                │
         ┌──────┴──────┐
         │             │
      Transcripts  Analysis
```

## Folder Structure

### Backend: `backend/`

```
backend/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── transcripts.py     # POST /api/transcripts/*
│   │   └── health.py          # GET /api/health
│   ├── models/                # Data schemas
│   │   └── schemas.py         # Pydantic models
│   ├── services/              # Business logic
│   │   ├── claude_service.py  # Claude API integration
│   │   └── transcript_service.py  # Database ops
│   └── core/                  # Configuration
│       ├── config.py          # Settings
│       ├── database.py        # MongoDB connection
│       └── utils.py           # Helpers
├── main.py                    # FastAPI app entry
├── requirements.txt           # Dependencies
├── .env.example              # Environment template
└── Dockerfile                # Container config
```

**Key Files:**

- `main.py`: FastAPI application setup with CORS, lifespan, routes
- `app/api/transcripts.py`: REST endpoints for transcript CRUD and analysis
- `app/services/claude_service.py`: Claude API wrapper for AI analysis
- `app/services/transcript_service.py`: MongoDB database operations
- `app/core/config.py`: Environment variables and settings

### Frontend: `frontend/`

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── Button.tsx         # Reusable button
│   │   ├── TranscriptInput.tsx   # Upload form
│   │   ├── AnalysisResults.tsx   # Results display
│   │   ├── Header.tsx         # Navigation header
│   │   ├── TranscriptList.tsx    # Transcript table
│   │   ├── Alert.tsx          # Alert notifications
│   │   └── index.ts           # Component exports
│   ├── lib/
│   │   ├── api.ts             # Axios instance
│   │   ├── services.ts        # API service functions
│   │   └── utils.ts           # Utility functions
│   ├── store/
│   │   └── index.ts           # Zustand store
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── styles/
│       └── globals.css        # Tailwind CSS
├── public/                    # Static files
├── package.json              # Dependencies
├── next.config.js            # Next.js config
├── tsconfig.json             # TypeScript config
├── tailwind.config.js        # Tailwind config
├── .eslintrc.json            # ESLint config
└── Dockerfile                # Container config
```

**Key Files:**

- `src/app/page.tsx`: Main application page
- `src/components/TranscriptInput.tsx`: Transcript upload form
- `src/components/AnalysisResults.tsx`: Analysis display
- `src/lib/services.ts`: API integration layer
- `src/store/index.ts`: Global state management

## Data Flow

### 1. User Uploads Transcript

```
User Input
  │
  ├─> TranscriptInput Component
  │    ├─ Validate title & content
  │    └─ Call onSubmit handler
  │
  └─> page.tsx handleAnalyze
       ├─ setLoading(true)
       ├─ API: POST /api/transcripts (save)
       ├─ API: POST /api/transcripts/analyze (analyze)
       └─ setAnalysisResult(result)
```

### 2. Backend Processes Transcript

```
FastAPI Receives Request
  │
  ├─> transcripts router
  │    └─> POST /analyze endpoint
  │
  ├─> ClaudeService.analyze_transcript()
  │    ├─ Build prompt
  │    ├─ Call Claude API
  │    ├─ Parse JSON response
  │    └─ Return analysis
  │
  └─> TranscriptService.create_transcript()
       ├─ Insert to MongoDB
       └─ Return saved document
```

### 3. Results Display

```
AnalysisResults Component
  │
  ├─> Summary Section
  ├─> Key Points List
  ├─> Action Items Table
  │    ├─ Description
  │    ├─> Owner, Deadline
  │    ├─> Priority Badge
  │    └─> Status Icon
  │
  └─> Export Buttons
       ├─ JSON, PDF, CSV
       └─ Download File
```

## Key Technologies

### Backend

- **FastAPI**: Modern Python web framework for building APIs
  - Type hints and automatic validation with Pydantic
  - Automatic API documentation (Swagger/OpenAPI)
  - Built-in CORS middleware

- **Claude API**: AI-powered transcript analysis
  - Natural language processing
  - JSON response parsing
  - Configured model: claude-3-5-sonnet-20241022

- **MongoDB/Motor**: Async document database
  - BSON document storage
  - Flexible schema
  - Full-text search support

### Frontend

- **Next.js 14**: React framework with SSR
  - App Router for file-based routing
  - Built-in API routes (if needed)
  - Image optimization

- **TypeScript**: Type-safe JavaScript
  - Component prop validation
  - API response typing
  - Better IDE support

- **Zustand**: Lightweight state management
  - Global store without boilerplate
  - Minimal API surface
  - Devtools integration

- **Tailwind CSS**: Utility-first CSS framework
  - Responsive design utilities
  - Dark mode support
  - Component styling

## API Endpoints

### Health Check
```
GET /health
Response: { status, message, version }
```

### Transcripts
```
POST /api/transcripts
  - Create new transcript
  - Body: { title, content }
  - Response: MeetingTranscript

GET /api/transcripts
  - List transcripts (paginated)
  - Query: skip, limit
  - Response: MeetingTranscript[]

GET /api/transcripts/{id}
  - Get single transcript
  - Response: MeetingTranscript

PUT /api/transcripts/{id}
  - Update transcript
  - Body: { title?, content? }
  - Response: MeetingTranscript

DELETE /api/transcripts/{id}
  - Delete transcript
  - Response: { message }

GET /api/transcripts/search?q=keyword
  - Search transcripts
  - Response: MeetingTranscript[]
```

### Analysis
```
POST /api/transcripts/analyze
  - Analyze transcript content
  - Body: { content }
  - Response: {
      summary: string,
      keyPoints: string[],
      actionItems: [{
        id, description, owner, deadline,
        priority, status, createdAt
      }]
    }
```

## Environment Variables

### Backend (.env)
```
CLAUDE_API_KEY=sk_...              # Claude API key
MONGODB_URL=mongodb://...          # MongoDB connection
DATABASE_NAME=meeting_notes_db     # DB name
ENVIRONMENT=development            # dev/production
DEBUG=True                          # Debug mode
CORS_ORIGINS=[...]                 # Allowed origins
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Development Tips

### Backend

1. **Add new endpoint**:
   - Create route in `app/api/`
   - Add schema in `app/models/schemas.py`
   - Add service logic in `app/services/`

2. **Debug Claude responses**:
   - Check `app/services/claude_service.py`
   - Log prompt and response
   - Parse JSON carefully

3. **Database queries**:
   - Use `TranscriptService` methods
   - Handle async/await properly
   - Catch MongoDB exceptions

### Frontend

1. **Add new component**:
   - Create in `src/components/`
   - Export from `src/components/index.ts`
   - Add TypeScript props interface

2. **Call API**:
   - Use `transcriptAPI` from `src/lib/services.ts`
   - Handle loading/error states
   - Type responses with interfaces from `src/types/`

3. **State management**:
   - Use `useMeetingStore` from `src/store/`
   - Update store after API calls
   - Use selectors for components

## Testing Strategy

### Backend
- Unit tests for `ClaudeService`
- Integration tests for API endpoints
- Mock MongoDB for unit tests
- Test error handling

### Frontend
- Component tests with React Testing Library
- API client mocking
- User interaction testing
- Error boundary testing

## Performance Considerations

**Backend**:
- Cache Claude responses
- Database indexing on transcripts
- Rate limiting for API
- Connection pooling for MongoDB

**Frontend**:
- Code splitting with Next.js
- Image optimization
- Lazy loading components
- Zustand state selectors

## Security

- **API**: CORS middleware, input validation
- **Database**: Connection string from env vars
- **API Keys**: Claude key in .env (never in code)
- **Frontend**: CSP headers, XSS protection

---

For questions, open an issue on GitHub!
