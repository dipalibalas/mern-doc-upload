# Architecture Note

A short overview of how DocuWrite is built and why certain choices were made.

---

## The big picture

The app has three main parts:

1. **Frontend (React)** — what the user sees and clicks
2. **Backend (Express)** — handles login, documents, uploads, and sharing
3. **Database (MongoDB)** — stores users, documents, and share settings

Uploaded files are saved in a local `uploads/` folder on the server.

When you log in, the server gives you a token. The frontend sends that token with every request so the backend knows who you are.

---

## Main technologies

| Part | Tool | Why |
|------|------|-----|
| UI | React + Vite | Fast dev setup, component-based UI |
| Styling | Tailwind CSS | Quick, consistent styling |
| Editor | TipTap | Rich text editing in the browser |
| Data fetching | React Query | Loads and updates documents from the API |
| API | Express | Simple REST endpoints |
| Database | MongoDB | Flexible storage for document content |
| Login | JWT + bcrypt | Secure login without server sessions |

---

## How data is stored

**User** — name, email, hashed password

**Document** — title, content (as JSON from the editor), owner, list of shared users, attachments, timestamps

Document content is saved as JSON, not plain HTML. This keeps formatting like bold text and lists intact when you reopen a document.

---

## How sharing works

- Every document has one **owner**
- The owner can share by entering another user's email
- Shared users can view and edit the document
- Only the owner can delete or share the document
- The UI shows **Owned** or **Shared with me** on each card

---

## What we focused on first

1. **Core flow** — create, edit, save, and reopen documents
2. **Sharing** — simple email-based sharing with clear labels
3. **File import** — turn uploaded files into editable content (not perfect formatting)
4. **Clean split** — backend handles data and rules; frontend handles the user experience

---

## Known limits

- No live co-editing (last person to save wins)
- Uploaded `.docx` files lose styling — only text is kept
- `.md` files are not rendered as Markdown
- Files are stored on the server disk (fine for local dev, not ideal for large-scale hosting)
- Login token is stored in the browser (okay for a demo, not ideal for high-security apps)
- Only one test file exists so far (file parser tests)

---

## Ideas for later

- Auto-save while typing
- View-only sharing (read but not edit)
- Cloud file storage (e.g. AWS S3)
- More tests for the API and UI
- Real-time collaboration

---

## Important files

| File | What it does |
|------|--------------|
| `backend/app.js` | Starts the server |
| `backend/controllers/documentController.js` | Create, read, update, delete, share documents |
| `backend/utils/fileParser.js` | Converts uploaded files to editor content |
| `frontend/src/pages/Editor.jsx` | Document editing page |
| `frontend/src/components/RichEditor.jsx` | The text editor toolbar and area |
| `frontend/src/context/NotificationContext.jsx` | Success/error pop-up messages |
