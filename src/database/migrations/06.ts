import {getDBConnection} from '../../services/database.service';

// Global score of the sub-domains, from 1 to 5 (B15).
export const runMigrationV6 = async () => {
  const db = await getDBConnection();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS competence_score (
      id TEXT PRIMARY KEY,
      _status TEXT,

      session_id TEXT REFERENCES session(id),
      competence_id TEXT REFERENCES competence(id),
      suggested_value INTEGER null,
      value INTEGER null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
