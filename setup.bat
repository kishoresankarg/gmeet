@echo off
echo 🚀 Setting up Meeting Notes Generator
echo.

REM Backend Setup
echo 📦 Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv
call venv\Scripts\activate.bat

REM Install dependencies
pip install -r requirements.txt

REM Copy env file
if not exist .env (
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your Claude API key
)

cd ..

REM Frontend Setup
echo 📦 Setting up frontend...
cd frontend

REM Install dependencies
call npm install

REM Copy env file
if not exist .env.local (
    copy .env.example .env.local
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 📝 Next steps:
echo 1. Update backend\.env with your Claude API key
echo 2. Ensure MongoDB is running (docker run -d -p 27017:27017 mongo:latest)
echo 3. Start backend: cd backend ^&^& venv\Scripts\activate.bat ^&^& python main.py
echo 4. Start frontend: cd frontend ^&^& npm run dev
echo 5. Open http://localhost:3000 in your browser
