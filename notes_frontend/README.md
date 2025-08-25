# Personal Notes Frontend (React)

A modern, minimalistic notes organizer with a sidebar, top bar, and main editor. CRUD operations are implemented via Supabase.

## Features
- Create notes
- Edit notes
- View notes
- Delete notes
- List all notes
- Light theme using the palette:
  - primary: `#1976d2`
  - secondary: `#424242`
  - accent: `#ffb300`

## Environment Variables
Create a `.env` file in the container root with:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_KEY=your_supabase_anon_key
```
These are injected at build-time. Do not commit secrets.

## Supabase
Expected table `notes` with columns:
- id: uuid primary key default uuid_generate_v4() or gen_random_uuid()
- title: text
- content: text
- created_at: timestamptz default now()
- updated_at: timestamptz default now()

## Scripts
- `npm start` - start dev server
- `npm test` - run tests
- `npm run build` - build for production

## Project Structure
- `src/services/supabaseClient.js` - Supabase client and NotesAPI (PUBLIC_INTERFACE)
- `src/components/TopBar.jsx` - top bar with actions
- `src/components/Sidebar.jsx` - notes list with search and delete
- `src/components/Editor.jsx` - editor for title/content
- `src/App.js` - orchestrates CRUD and layout
- `src/App.css` - styles and layout

## Accessibility
- Keyboard and ARIA attributes for navigation and controls
- Focus-visible outlines

## Notes
- Configuration is via .env; do not hard-code keys.
- Sync button reloads notes from Supabase.

