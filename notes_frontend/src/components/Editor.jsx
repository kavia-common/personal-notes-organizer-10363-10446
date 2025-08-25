import React, { useEffect, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * Editor to view and edit a selected note.
 */
export default function Editor({ note, onSave, onChange }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // Reset when note changes

  // Auto propagate changes up for optimistic UI
  useEffect(() => {
    onChange?.({ title, content });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content]);

  if (!note) {
    return (
      <main className="editor empty" role="main" aria-label="Editor">
        <p>Select a note from the left or create a new one.</p>
      </main>
    );
  }

  return (
    <main className="editor" role="main" aria-label="Editor">
      <div className="editor-toolbar">
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          aria-label="Note title"
        />
        <button className="btn btn-primary" onClick={() => onSave({ title, content })}>
          Save
        </button>
      </div>
      <textarea
        className="content-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start writing your note..."
        aria-label="Note content"
      />
    </main>
  );
}
