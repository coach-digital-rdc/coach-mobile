import {v4 as uuid} from 'uuid';
import {ObservationNote} from '../types/observation-note';
import {getDBConnection} from './database.service';

// Notes of the observation (B13): they can be changed until the end of the observation.
export const NoteService = {
  listNotes: async (sessionId: string): Promise<ObservationNote[]> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      'SELECT * FROM observation_note WHERE session_id = ? AND deleted_at IS NULL ORDER BY noted_at',
      [sessionId],
    );
    return result[0].rows.raw();
  },

  addNote: async (
    sessionId: string,
    content: string,
  ): Promise<ObservationNote> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();
    const note = {
      id: uuid(),
      session_id: sessionId,
      noted_at: now,
      content,
    };
    await db.executeSql(
      `
      INSERT INTO observation_note(id, session_id, noted_at, content, created_at, updated_at, _status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `,
      [note.id, sessionId, now, content, now, now],
    );
    return note;
  },

  updateNote: async (id: string, content: string): Promise<void> => {
    const db = await getDBConnection();
    await db.executeSql(
      "UPDATE observation_note SET content = ?, updated_at = ?, _status = 'pending' WHERE id = ?",
      [content, new Date().toJSON(), id],
    );
  },

  deleteNote: async (id: string): Promise<void> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();
    await db.executeSql(
      "UPDATE observation_note SET deleted_at = ?, updated_at = ?, _status = 'pending' WHERE id = ?",
      [now, now, id],
    );
  },

  syncNotes: async (notes: ObservationNote[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      (notes || []).map(note =>
        db.executeSql(
          `
          INSERT OR REPLACE INTO observation_note(id, session_id, noted_at, content, created_at, updated_at, deleted_at, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            note.id,
            note.session_id,
            note.noted_at,
            note.content,
            note.created_at,
            note.updated_at,
            note.deleted_at,
          ],
        ),
      ),
    );
  },
};
