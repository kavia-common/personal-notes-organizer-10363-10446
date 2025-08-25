import React from "react";

/**
 * PUBLIC_INTERFACE
 * Sidebar lists notes and allows selection.
 */
export default function Sidebar({ notes, selectedId, onSelect, onDelete }) {
  return (
    <aside className="sidebar" role="navigation" aria-label="Notes list">
      <div className="sidebar-header">
        <input
          className="search"
          placeholder="Search notes..."
          onChange={(e) => onSelect(null, e.target.value)}
          aria-label="Search notes"
        />
      </div>
      <ul className="note-list">
        {notes.map((n) => (
          <li
            key={n.id}
            className={`note-item ${selectedId === n.id ? "active" : ""}`}
            onClick={() => onSelect(n.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onSelect(n.id)}
          >
            <div className="note-title">{n.title || "Untitled note"}</div>
            <div className="note-snippet">
              {(n.content || "").slice(0, 80) || "No content yet..."}
            </div>
            <button
              className="icon-btn delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(n.id);
              }}
              title="Delete note"
              aria-label={`Delete note ${n.title || ""}`}
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
