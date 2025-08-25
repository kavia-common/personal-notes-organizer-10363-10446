import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { NotesAPI } from "./services/supabaseClient";

// PUBLIC_INTERFACE
/**
 * App: Personal Notes Organizer
 * - Layout: TopBar, Sidebar, Editor
 * - CRUD via Supabase REST
 * - Light, minimalistic theme using provided palette
 */
function App() {
  const [theme] = useState("light"); // fixed light theme per requirements
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState({}); // temporary UI state per note id

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    // initial load
    (async () => {
      try {
        setLoading(true);
        const list = await NotesAPI.list();
        setNotes(list);
        if (list.length > 0) setSelectedId(list[0].id);
      } catch (e) {
        setError(e.message || "Failed to load notes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  const filteredNotes = useMemo(() => {
    if (!search) return notes;
    const needle = search.toLowerCase();
    return notes.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(needle) ||
        (n.content || "").toLowerCase().includes(needle)
    );
  }, [notes, search]);

  async function handleNewNote() {
    try {
      setSyncing(true);
      const created = await NotesAPI.create({ title: "Untitled note", content: "" });
      setNotes((prev) => [created, ...prev]);
      setSelectedId(created.id);
    } catch (e) {
      setError(e.message || "Failed to create note.");
    } finally {
      setSyncing(false);
    }
  }

  async function handleDelete(id) {
    const current = notes.find((n) => n.id === id);
    if (!current) return;
    const prev = notes;
    // optimistic removal
    setNotes((p) => p.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
    try {
      await NotesAPI.remove(id);
    } catch (e) {
      // rollback
      setNotes(prev);
      setError(e.message || "Failed to delete note.");
    }
  }

  async function handleSave(update) {
    if (!selectedNote) return;
    const id = selectedNote.id;
    const prev = notes;
    // optimistic update
    const nextList = notes.map((n) =>
      n.id === id ? { ...n, ...update, updated_at: new Date().toISOString() } : n
    );
    setNotes(nextList);
    try {
      const updated = await NotesAPI.update(id, update);
      setNotes((p) => p.map((n) => (n.id === id ? updated : n)));
    } catch (e) {
      setNotes(prev);
      setError(e.message || "Failed to save note.");
    }
  }

  function handleChangeDraft(update) {
    if (!selectedNote) return;
    setDrafts((d) => ({ ...d, [selectedNote.id]: { ...d[selectedNote.id], ...update } }));
  }

  async function handleSync() {
    try {
      setSyncing(true);
      const list = await NotesAPI.list();
      setNotes(list);
      if (list.length && !list.find((n) => n.id === selectedId)) {
        setSelectedId(list[0].id);
      }
    } catch (e) {
      setError(e.message || "Failed to sync.");
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="app">
      <TopBar onNewNote={handleNewNote} onSync={handleSync} syncing={syncing} />
      <Sidebar
        notes={filteredNotes}
        selectedId={selectedId}
        onSelect={(id, s) => {
          if (typeof s === "string") setSearch(s);
          if (id) setSelectedId(id);
        }}
        onDelete={handleDelete}
      />
      {error && (
        <div
          style={{
            position: "fixed",
            right: 16,
            bottom: 16,
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
            padding: 12,
            borderRadius: 10,
            boxShadow: "var(--shadow)",
          }}
          role="alert"
        >
          {error}
          <button
            className="btn"
            style={{ marginLeft: 8 }}
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            Dismiss
          </button>
        </div>
      )}
      <Editor
        key={selectedNote?.id || "empty"}
        note={selectedNote ? { ...selectedNote, ...(drafts[selectedNote.id] || {}) } : null}
        onChange={handleChangeDraft}
        onSave={handleSave}
      />
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,.6)",
            display: "grid",
            placeItems: "center",
            fontWeight: 600,
          }}
          aria-live="polite"
        >
          Loading...
        </div>
      )}
    </div>
  );
}

export default App;
