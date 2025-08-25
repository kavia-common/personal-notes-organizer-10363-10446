import React from "react";

/**
 * PUBLIC_INTERFACE
 * TopBar displays the application title and global actions.
 */
export default function TopBar({ onNewNote, onSync, syncing }) {
  return (
    <header className="topbar" role="banner" aria-label="Application top bar">
      <div className="brand">
        <span className="logo" aria-hidden="true">📝</span>
        <h1 className="brand-title">Notes</h1>
      </div>
      <div className="actions">
        <button className="btn btn-accent" onClick={onNewNote} title="Create new note">
          + New
        </button>
        <button className="btn" onClick={onSync} disabled={syncing} title="Refresh notes">
          {syncing ? "Syncing..." : "Sync"}
        </button>
      </div>
    </header>
  );
}
