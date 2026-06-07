# Submission Checklist

Project: **DocuWrite** — a full-stack document editor  
Folder: `MERN-docs-app`

This file lists everything included in the submission.

---

## App features

| Feature | Included? | Where to find it |
|---------|-----------|------------------|
| Create a document | Yes | Dashboard → New document |
| Rename a document | Yes | Edit title in editor, then save |
| Edit content in browser | Yes | Editor page |
| Save and reopen documents | Yes | Save button + MongoDB storage |
| Bold, italic, underline | Yes | Editor toolbar |
| Headings | Yes | H1, H2, H3 buttons |
| Bullet lists | Yes | Editor toolbar |
| Numbered lists | Yes | Editor toolbar |
| File upload | Yes | Sidebar → Import file |
| File types shown in UI | Yes | Upload modal (txt, md, docx) |
| Document owner | Yes | Stored in database |
| Share with another user | Yes | Three-dot menu → Share |
| Owned vs shared labels | Yes | Badges on document cards |
| Data survives refresh | Yes | MongoDB |
| Formatting preserved | Yes | Saved as editor JSON |
| Demo sharing flow | Yes | Seed Alice & Bob, share between them |

---

## Engineering requirements

| Requirement | Included? | File |
|-------------|-----------|------|
| Setup and run instructions | Yes | README.md |
| Runs locally | Yes | Backend :5000, Frontend :5173 |
| Error handling | Yes | API error messages + notification modals |
| Automated test | Yes | backend/tests/fileParser.test.js |
| Architecture note | Yes | ARCHITECTURE.md |
| AI workflow note | Yes | AI_WORKFLOW.md |
| This submission list | Yes | SUBMISSION.md |

---

## What's in the repo

**Backend**
- API server, login, documents, sharing, file uploads
- Database models for users and documents
- Seed script for demo accounts
- Tests for file parsing

**Frontend**
- Login / register page
- Dashboard with document list
- Rich text editor page
- Modals for create, share, upload, and notifications
- Sidebar navigation

**Docs**
- README.md — how to set up and run
- ARCHITECTURE.md — how the app is structured
- AI_WORKFLOW.md — how AI was used
- SUBMISSION.md — this file

---

## Quick start

```bash
# Terminal 1
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev

# Terminal 2
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**  
Login: `alice@example.com` / `password123`

Run tests: `cd backend && npm test`

---

## Extra features (beyond minimum)

- User registration on the login page
- Full-screen notifications on create / update / delete
- Delete document from card menu
- Filter: All docs / My docs / Shared with me
- Download uploaded attachments

---

## Known limits

- Runs locally — no live hosted URL included
- No real-time co-editing
- `.docx` and `.md` imports are plain text only
- Small test coverage (one test file)

---

## Final checklist

- [x] Backend source code
- [x] Frontend source code
- [x] README.md
- [x] ARCHITECTURE.md
- [x] AI_WORKFLOW.md
- [x] SUBMISSION.md
- [x] .env.example files
- [x] Automated tests
- [x] Demo user seed script
