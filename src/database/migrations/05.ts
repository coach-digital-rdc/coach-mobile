import {getDBConnection} from '../../services/database.service';

// Timestamped notes of the observation (B13).
export const runMigrationV5 = async () => {
  const db = await getDBConnection();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS observation_note (
      id TEXT PRIMARY KEY,
      _status TEXT,

      session_id TEXT REFERENCES session(id),
      noted_at TIMESTAMP null,
      content TEXT null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP null
    )
  `);
};
