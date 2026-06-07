# AI Workflow Note

This explains how AI (mainly **Cursor**) was used to help build DocuWrite.

---

## Tools used

- **Cursor IDE** — coding with AI help built in
- **Cursor Agent** — for bigger tasks like wiring up the frontend to the backend
- **Code search** — to find missing pieces and broken connections

All AI-generated code was reviewed and tested before keeping it.

---

## How the project was built (in order)

### 1. Explore the codebase

First, AI scanned the backend and frontend to see what already existed and what was missing.

It found things like:
- Backend routes that had no frontend connection
- UI components (modals, sidebar) that were built but never used
- Missing API endpoint to load a single document

This gave a clear to-do list before writing new code.

### 2. Finish the backend

AI helped add:
- Fetch document by ID
- File import and attach endpoints
- Access checks (only owner or shared users can open a doc)
- Login security fixes (password no longer sent back in API responses)
- A seed script for demo users
- Basic tests for file parsing

### 3. Connect the frontend

AI wired up:
- Create document from the dashboard
- Load and save in the editor
- Share and upload modals
- Sidebar navigation and logout
- Login and register on one page
- Error messages and notifications

### 4. Fix bugs along the way

| Problem | How it was fixed |
|---------|------------------|
| App crashed on layout file | Renamed `MainLayout.js` to `.jsx` |
| Lists had no bullets/numbers | Fixed CSS + toolbar button focus |
| Saved content disappeared | Stopped resetting the editor on every keystroke |
| Menu icon overlapped badge | Moved three-dot menu next to the badge |
| Small toast hard to notice | Added full-screen notification modal |

---

## What made good AI prompts

Good prompts included:
- What already works ("backend is done, frontend needs wiring")
- What you want ("fix save so content stays in the database")
- What to skip ("keep it simple, don't over-engineer")

Examples that worked well:
- "Complete the API integration and make UI user-friendly"
- "Fix list functionality in RichEditor and ensure content saves to DB"
- "Fix the three-dot position in the doc card"

Vague prompts like "make it better" were less helpful.

---

## What AI was good at

- Writing boilerplate (API calls, forms, routes)
- Finding gaps in the codebase quickly
- Building similar UI pieces (modals, cards, buttons)
- Drafting documentation

---

## What still needed a human

- Deciding how sharing should work
- Testing in the browser after each change
- Choosing which features to include vs skip
- Checking security basics (who can delete, who can share)
- Fixing UX details the AI missed on the first try

---

## How we checked each change

1. Run backend and frontend locally
2. Click through the feature in the browser
3. Refresh the page to confirm data saved
4. Run `npm test` when backend logic changed

---

## Honest notes

- The app was not auto-deployed — you run it locally using the README

---

