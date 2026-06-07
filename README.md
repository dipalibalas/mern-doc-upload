# DocuWrite

DocuWrite is a simple document app. You can write and format text, upload files, save your work, and share documents with other users.

**Built with:** React (frontend), Express (backend), MongoDB (database)

---

## What you need

- Node.js 18 or newer
- MongoDB (local install or MongoDB Atlas)
- npm (comes with Node.js)

---

## How to run locally

### Step 1 — Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

Open `backend/.env` and set:

- `MONGO_URL` — your MongoDB connection string
- `JWT_SECRET` — any long random string

The API runs at **http://localhost:5000**

### Step 2 — Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**

---

## Demo login

After running `npm run seed` in the backend folder:

| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |

---

## Try it out

1. Log in as Alice
2. Click **New document** or **Import file** in the sidebar
3. Write something, use bold/lists/headings, then click **Save changes**
4. Share a document with `bob@example.com` using the three-dot menu
5. Log in as Bob and check **Shared with me** in the sidebar

---

## What the app can do

- Create, edit, rename, save, and delete documents
- Rich text: bold, italic, underline, headings, bullet lists, numbered lists
- Upload `.txt`, `.md`, or `.docx` files (max 5 MB)
- Share documents with other registered users
- Show a full-screen notification when you create, update, or delete a document
- Keep your work after refreshing the page

**Upload notes:**
- `.txt` and `.md` — text is added as editable paragraphs
- `.docx` — text is extracted (formatting is not kept)

---

## Useful commands

| What | Command | Where |
|------|---------|-------|
| Start backend | `npm run dev` | `backend/` |
| Start frontend | `npm run dev` | `frontend/` |
| Add demo users | `npm run seed` | `backend/` |
| Run tests | `npm test` | `backend/` |
| Build frontend | `npm run build` | `frontend/` |

---

## Project folders

```
MERN-docs-app/
├── backend/     → API, database models, file uploads
├── frontend/    → React app, editor, pages
├── README.md
├── ARCHITECTURE.md
├── AI_WORKFLOW.md
└── SUBMISSION.md
```

---

## Other docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — how the app is built
- [AI_WORKFLOW.md](./AI_WORKFLOW.md) — how AI was used during development
- [SUBMISSION.md](./SUBMISSION.md) — full list of what is included
