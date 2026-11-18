import {v4 as uuid} from 'uuid';
import {ChecklistItem, Documentation} from '../types/checklist';
import {getDBConnection} from './database.service';

// Document checklist of the session (B12). It is not part of the rating.
export const ChecklistService = {
  listItems: async (): Promise<ChecklistItem[]> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      'SELECT * FROM checklist_item ORDER BY display_order',
    );
    return result[0].rows.raw();
  },

  getSessionAnswers: async (sessionId: string): Promise<Documentation[]> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      'SELECT * FROM documentation WHERE session_id = ?',
      [sessionId],
    );
    return result[0].rows.raw();
  },

  // Number of documents without an answer, for the reminder before closing the session
  countUnchecked: async (sessionId: string): Promise<number> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      `
      SELECT COUNT(*) as count FROM checklist_item as c
      WHERE NOT EXISTS (
        SELECT 1 FROM documentation as d
        WHERE d.checklist_item_id = c.id AND d.session_id = ? AND d.answer IS NOT NULL
      )
    `,
      [sessionId],
    );
    return result[0].rows.raw()[0].count;
  },

  // One answer per document and per session: the existing one is updated
  saveAnswers: async (
    sessionId: string,
    answers: Partial<Documentation>[],
  ): Promise<void> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();

    for (const answer of answers) {
      const values = [
        answer.answer === undefined || answer.answer === null
          ? null
          : answer.answer
          ? 1
          : 0,
        answer.answer === 0 || answer.answer === false
          ? answer.proposal || null
          : null,
        answer.filled_in_phase,
        now,
      ];
      const updated = await db.executeSql(
        `
        UPDATE documentation
        SET answer = ?, proposal = ?, filled_in_phase = ?, updated_at = ?, _status = 'pending'
        WHERE session_id = ? AND checklist_item_id = ?
      `,
        [...values, sessionId, answer.checklist_item_id],
      );
      if (!updated[0].rowsAffected) {
        await db.executeSql(
          `
          INSERT INTO documentation(answer, proposal, filled_in_phase, updated_at, id, session_id, checklist_item_id, created_at, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `,
          [...values, uuid(), sessionId, answer.checklist_item_id, now],
        );
      }
    }
  },

  syncItems: async (items: ChecklistItem[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      (items || []).map(item =>
        db.executeSql(
          `
          INSERT OR REPLACE INTO checklist_item(id, code, owner, document_name, statement, display_order, _status)
          VALUES (?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            item.id,
            item.code,
            item.owner,
            item.document_name,
            item.statement,
            item.display_order,
          ],
        ),
      ),
    );
  },

  syncAnswers: async (answers: Documentation[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      (answers || []).map(answer =>
        db.executeSql(
          `
          INSERT OR REPLACE INTO documentation(id, session_id, checklist_item_id, answer, proposal, filled_in_phase, _status)
          VALUES (?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            answer.id,
            answer.session_id,
            answer.checklist_item_id,
            answer.answer === null || answer.answer === undefined
              ? null
              : answer.answer
              ? 1
              : 0,
            answer.proposal,
            answer.filled_in_phase,
          ],
        ),
      ),
    );
  },
};
