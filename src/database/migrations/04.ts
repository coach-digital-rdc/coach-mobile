import {getDBConnection} from '../../services/database.service';

// Document checklist (B12): the 15 documents of annex B and the answers of each session.
export const runMigrationV4 = async () => {
  const db = await getDBConnection();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS checklist_item (
      id TEXT PRIMARY KEY,
      _status TEXT,

      code INTEGER null,
      owner TEXT null,
      document_name TEXT null,
      statement TEXT null,
      display_order INTEGER null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS documentation (
      id TEXT PRIMARY KEY,
      _status TEXT,

      session_id TEXT REFERENCES session(id),
      checklist_item_id TEXT REFERENCES checklist_item(id),
      answer INTEGER null,
      proposal TEXT null,
      filled_in_phase TEXT null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
