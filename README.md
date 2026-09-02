# PeerLinkAI

PeerLinkAI is an AI-powered peer-tutoring prototype that matches students with tutors based on both subject relevance and learning-style compatibility.

Instead of only searching by keywords, students complete a learning-style quiz and receive tutor recommendations with an explainable reason for each match.

## Features

- Learning-style onboarding quiz using visual, practical, pace, and interaction preferences
- Tutor search with personalised recommendations
- AI matching based on:
  - Subject/content relevance
  - Learning-style similarity
- Explainable match reasons, such as “Matches your hands-on learning style”
- Tutor, student, session, profile, signup, and login interface pages
- AI-layer utilities for quiz generation, grading, and learning-profile feedback
- FastAPI backend connecting the frontend search experience to the matching engine

## Current Prototype Scope

The live end-to-end flow is:

1. A student completes the learning-style quiz.
2. Their preferences are saved locally in the browser.
3. The student searches for a subject.
4. The frontend calls the FastAPI `/search` endpoint.
5. The AI layer ranks tutors using content and learning-style scores.
6. The student sees personalised tutor recommendations.

This is currently a prototype:

- Tutor data is seeded in the backend; there is no database yet.
- Authentication, bookings, and profile edits are UI-only and are not persisted.
- Tutor qualification and post-session quiz screens are demo interfaces; they are not yet connected to backend quiz endpoints.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js, React, Tailwind CSS |
| Backend | FastAPI, Uvicorn, Pydantic |
| AI Matching | Python, scikit-learn, NumPy |
| Quiz Generation | Anthropic API with a local fallback quiz bank |
| Testing | Pytest |

## Project Structure

```text
PeerLinkAI/
├── frontend/       # Next.js user interface
├── backend/        # FastAPI search API
├── ai-layer/       # Matching, quizzes, grading, and feedback logic
├── docs/           # Architecture, API, schema, and project documents
└── design/         # Design-system documentation
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Python 3.10 or newer

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd PeerLinkAI
```

### 2. Set up the Python environment

From the project root:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Or on macOS/Linux:

```bash
source .venv/bin/activate
```

Install backend and AI-layer dependencies:

```bash
python -m pip install -r backend/requirements.txt -r ai-layer/requirements.txt
```

### 3. Run the backend

Open one terminal:

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

The API will run at `http://localhost:8000`.

Check that it is working:

```bash
curl http://localhost:8000/health
```

Expected response:

```json
{"status":"ok"}
```

### 4. Run the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

The frontend uses `http://localhost:8000` by default for API requests.

## Environment Variables

### Frontend

Optionally create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Optional AI Quiz Generation

The quiz utility can use an Anthropic API key. Without one, it safely uses local fallback quiz questions.

Set the key in your terminal before running Python code that uses quiz generation.

Windows PowerShell:

```powershell
$env:ANTHROPIC_API_KEY="your-api-key"
```

macOS/Linux:

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

## Available Commands

### Frontend

Run these from `frontend/`:

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### AI Layer Tests

Run these from `ai-layer/` after installing dependencies:

```bash
python -m pytest -v
```

## API Endpoints

### Health Check

```http
GET /health
```

### Search Tutors

```http
GET /search
```

Supported query parameters:

| Parameter | Description | Default |
| --- | --- | --- |
| `q` | Subject or topic to search for | Empty string |
| `visual` | Visual-learning preference from `0` to `1` | `0.5` |
| `practical` | Hands-on-learning preference from `0` to `1` | `0.5` |
| `pace` | Preferred learning pace from `0` to `1` | `0.5` |
| `interaction` | Preferred interaction level from `0` to `1` | `0.5` |
| `top_n` | Number of tutor results | `5` |

Example:

```text
http://localhost:8000/search?q=calculus&visual=0.8&practical=0.7&pace=0.5&interaction=0.6
```

## How Matching Works

Tutor recommendations combine two scores:

- **60% content similarity** — compares the student’s search query with tutor subjects, bios, and teaching tags using TF-IDF and cosine similarity.
- **40% learning-style similarity** — compares the student’s preferences with each tutor’s teaching-style vector.

Each result includes:

- Tutor name and subject
- Match percentage
- Verification status
- A plain-language explanation for the recommendation

## Contributing

1. Create a branch from `main`:

   ```bash
   git switch -c feat/your-feature-name
   ```

2. Make focused changes in the relevant project folder.

3. Run the relevant checks:

   ```bash
   # Frontend
   cd frontend
   npm run lint

   # AI layer
   cd ../ai-layer
   python -m pytest -v
   ```

4. Commit your work with a clear message:

   ```bash
   git add <changed-files>
   git commit -m "feat: describe your change"
   ```

5. Push your branch and open a pull request to `main`.

## Documentation

- `docs/ARCHITECTURE.md` — system design and architecture decisions
- `docs/API.md` — planned API contracts
- `docs/SCHEMA.md` — proposed database schema
- `design/DESIGN_SYSTEM.md` — UI design guidance
- `ai-layer/README.md` — AI-layer implementation details