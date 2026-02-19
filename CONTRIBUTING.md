# Contributing to Meeting Notes Generator

We love your input! We want to make contributing to this project as easy and transparent as possible.

## Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## Setting Up Development Environment

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

## Code Style Guidelines

### Python (Backend)
- Follow PEP 8 conventions
- Use type hints for function parameters and returns
- Format with black: `pip install black && black .`
- Lint with flake8: `pip install flake8 && flake8 .`

### TypeScript/JavaScript (Frontend)
- Use ESLint configuration: `npm run lint`
- Follow Next.js best practices
- Use functional components with hooks
- Keep components small and focused

## Testing

### Backend
```bash
# Run tests (when available)
pytest tests/
```

### Frontend
```bash
# Run tests (when available)
npm test
```

## Reporting Issues

- **Bug Reports**: Describe the bug, steps to reproduce, and expected behavior
- **Feature Requests**: Explain the use case and benefits
- **Questions**: Use GitHub Discussions

## Pull Request Process

1. **Update** the README.md with new features or changes
2. **Add** tests for new functionality
3. **Ensure** code passes linting and tests
4. **Provide** a clear description of changes

## Areas for Contribution

- **Frontend**: UI/UX improvements, new components, accessibility
- **Backend**: API endpoints, optimization, error handling
- **AI**: Better Claude prompts, analysis improvements
- **Documentation**: Guides, examples, troubleshooting
- **Testing**: Unit tests, integration tests, E2E tests
- **Deployment**: Docker improvements, cloud configuration

## Questions?

Feel free to open an issue or discussion on GitHub!

---

Thank you for contributing! 🚀
