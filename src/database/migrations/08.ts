import {getDBConnection} from '../../services/database.service';

// Signatures of the observation sheet (B17).
export const runMigrationV8 = async () => {
  const db = await getDBConnection();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS session_signature (
      id TEXT PRIMARY KEY,
      _status TEXT,

      session_id TEXT REFERENCES session(id),
      signer_role TEXT null,
      signer_name TEXT null,
      image_id TEXT REFERENCES image(id),
      signed_at TIMESTAMP null,
      refusal_reason TEXT null,
      absence_reason TEXT null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
