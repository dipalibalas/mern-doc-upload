# DocuWrite — Full Stack Document App

A MERN-style document editor with rich text, file import, sharing, and persistent storage in MongoDB.

## Features

- **Documents**: Create, rename, edit, save, and reopen documents
- **Rich text**: Bold, italic, underline, headings (H1–H3), bullet and numbered lists (TipTap)
- **File import**: Upload `.txt`, `.md`, or `.docx` (max 5MB) to create a new document or import into an existing draft
- **Sharing**: Document owners can share with registered users by email; owned vs shared documents are labeled in the UI
- **Persistence**: Documents and sharing data stored in MongoDB; formatting preserved as TipTap JSON

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URL and JWT_SECRET

npm install
npm run seed    # optional: creates alice@example.com and bob@example.com (password123)
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Demo flow

1. Run `npm run seed` in `backend/`
2. Sign in as `alice@example.com` / `password123`
3. Create a document or import a `.txt` / `.md` / `.docx` file
4. Share it with `bob@example.com`
5. Sign in as Bob to see the document under **Shared with me**

## Supported file types

| Format | Behavior |
|--------|----------|
| `.txt` | Plain text converted to editable paragraphs |
| `.md` | Treated as plain text (not rendered as Markdown) |
| `.docx` | Text extracted via Mammoth and converted to paragraphs |

Files larger than 5MB are rejected.

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/documents` | List owned + shared documents |
| POST | `/api/documents` | Create document |
| GET | `/api/documents/:id` | Fetch single document |
| PUT | `/api/documents/:id` | Update title/content |
| DELETE | `/api/documents/:id` | Delete (owner only) |
| POST | `/api/documents/:id/share` | Share with user by email |
| POST | `/api/documents/import` | Import file as new document |
| POST | `/api/documents/:id/attach` | Attach file; optionally import content |
| GET | `/uploads/:filename` | Download uploaded attachments |

## Tests

```bash
cd backend
npm test
```

Includes unit tests for the text-to-editor content parser.

## Architecture note

**Priorities**

1. **End-to-end document flow** — Login, list, create, load by ID, save, and reopen were wired first so reviewers can exercise the core product immediately.
2. **Pragmatic sharing** — Owner-based sharing by email with visible owned/shared labels; no complex ACLs, but duplicate shares and self-share are blocked.
3. **File import over fidelity** — TXT/MD/DOCX are normalized to TipTap JSON so imported content is editable in the same editor; DOCX styling is not preserved.
4. **Thin backend, cohesive frontend** — Express REST API with JWT auth; React Query for server state, TipTap for editing, toast feedback for errors.

**Trade-offs**

- Shared users receive edit access only (permission field exists but is not exposed in UI).
- Attachments are stored on disk with filenames on the document; no cloud storage.
- No real-time collaboration; last save wins.

## Deployment

Deploy backend and frontend separately:

- **Backend**: Set `MONGO_URL`, `JWT_SECRET`, `CLIENT_URL` (frontend URL), and `PORT`. Ensure the `uploads/` directory is writable.
- **Frontend**: Set `VITE_API_URL` to your API base (e.g. `https://api.example.com/api`).

Example frontend env:

```
VITE_API_URL=https://your-api.example.com/api
VITE_UPLOADS_URL=https://your-api.example.com/uploads
```

## Project structure

```
backend/
  controllers/   # auth, documents, upload
  models/        # User, Document
  middleware/    # JWT auth, multer upload
  utils/         # access control, file parsing
  tests/         # automated tests
frontend/
  src/
    api/         # axios client
    components/  # editor, modals, cards, sidebar
    pages/       # login, dashboard, editor
    context/     # auth state
```
