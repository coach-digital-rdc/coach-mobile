import {v4 as uuid} from 'uuid';
import {CompetenceScore} from '../types/competence-score';
import {getDBConnection} from './database.service';

// Global scores of the sub-domains (B15): one per sub-domain and per session.
export const ScoreService = {
  getScores: async (
    sessionId: string,
  ): Promise<{[competenceId: string]: CompetenceScore}> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      'SELECT * FROM competence_score WHERE session_id = ?',
      [sessionId],
    );
    return result[0].rows.raw().reduce(
      (map: {[competenceId: string]: CompetenceScore}, score: any) => ({
        ...map,
        [score.competence_id]: score,
      }),
      {},
    );
  },

  saveScore: async (
    sessionId: string,
    competenceId: string,
    score: {suggested_value?: number | null; value?: number | null},
  ): Promise<void> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();
    const values = [score.suggested_value ?? null, score.value ?? null, now];
    const updated = await db.executeSql(
      `
      UPDATE competence_score
      SET suggested_value = ?, value = ?, updated_at = ?, _status = 'pending'
      WHERE session_id = ? AND competence_id = ?
    `,
      [...values, sessionId, competenceId],
    );
    if (!updated[0].rowsAffected) {
      await db.executeSql(
        `
        INSERT INTO competence_score(suggested_value, value, updated_at, id, session_id, competence_id, created_at, _status)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
      `,
        [...values, uuid(), sessionId, competenceId, now],
      );
    }
  },

  // Global scores of the closed sessions of a teacher, oldest first (tab "Évolution")
  getTeacherHistory: async (
    teacherId: string,
  ): Promise<
    {
      session_id: string;
      date: string;
      scores: {[competenceId: string]: number};
    }[]
  > => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      `
      SELECT s.id as session_id, COALESCE(s.completed_at, s.created_at) as date,
        c.competence_id, COALESCE(c.value, c.suggested_value) as value
      FROM session as s
      INNER JOIN competence_score as c ON c.session_id = s.id
      WHERE s.teacher_id = ? AND s.session_status = 'COMPLETED'
      ORDER BY date
    `,
      [teacherId],
    );
    const history: {
      session_id: string;
      date: string;
      scores: {[competenceId: string]: number};
    }[] = [];
    for (const row of result[0].rows.raw()) {
      let item = history.find(entry => entry.session_id === row.session_id);
      if (!item) {
        item = {session_id: row.session_id, date: row.date, scores: {}};
        history.push(item);
      }
      if (row.value !== null) {
        item.scores[row.competence_id] = row.value;
      }
    }
    return history;
  },

  syncScores: async (scores: CompetenceScore[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      (scores || []).map(score =>
        db.executeSql(
          `
          INSERT OR REPLACE INTO competence_score(id, session_id, competence_id, suggested_value, value, created_at, updated_at, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            score.id,
            score.session_id,
            score.competence_id,
            score.suggested_value,
            score.value,
            score.created_at,
            score.updated_at,
          ],
        ),
      ),
    );
  },
};
