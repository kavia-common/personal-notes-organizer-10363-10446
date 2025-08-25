//
// PUBLIC_INTERFACE
/** Create a configured Supabase client using environment variables. */
import { createClient } from "@supabase/supabase-js";

/**
 * Ensure env vars are provided via .env:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 * These must be configured by the orchestrator and not hard-coded.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Provide a helpful console message for misconfiguration.
  // Do not throw to avoid breaking builds; UI will show an error state.
  // eslint-disable-next-line no-console
  console.warn(
    "Supabase env vars missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in .env"
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// PUBLIC_INTERFACE
/**
 * Notes API using Supabase table 'notes'.
 * Schema expected:
 *  - id: uuid (primary key, default gen_random_uuid())
 *  - title: text
 *  - content: text
 *  - created_at: timestamptz default now()
 *  - updated_at: timestamptz default now()
 */
export const NotesAPI = {
  /** List all notes ordered by updated_at desc. */
  async list() {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  /** Get a single note by id. */
  async get(id) {
    const { data, error } = await supabase.from("notes").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
  },

  /** Create a new note; returns created note. */
  async create({ title, content }) {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ title, content }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Update an existing note by id; returns updated note. */
  async update(id, { title, content }) {
    const { data, error } = await supabase
      .from("notes")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  /** Delete a note by id. */
  async remove(id) {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
    return true;
  },
};
