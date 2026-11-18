import {getDBConnection} from '../../services/database.service';

// Professional Development Plan (B18, B23): rules, objectives library, plan of the session.
export const runMigrationV7 = async () => {
  const db = await getDBConnection();

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS pdp_rule_set (
      id TEXT PRIMARY KEY,
      _status TEXT,

      version INTEGER null,
      status TEXT null,
      diagnostic_config TEXT null,
      max_objectives INTEGER null,
      published_at TIMESTAMP null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS pdp_library_item (
      id TEXT PRIMARY KEY,
      _status TEXT,

      rule_set_id TEXT REFERENCES pdp_rule_set(id),
      question_id TEXT REFERENCES question(id),
      objective TEXT null,
      actions TEXT null,
      indicator TEXT null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS pdp (
      id TEXT PRIMARY KEY,
      _status TEXT,

      session_id TEXT REFERENCES session(id),
      rule_set_id TEXT REFERENCES pdp_rule_set(id),
      rule_set_version INTEGER null,
      diagnostic TEXT null,
      status TEXT null,
      validated_at TIMESTAMP null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS pdp_objective (
      id TEXT PRIMARY KEY,
      _status TEXT,

      pdp_id TEXT REFERENCES pdp(id),
      question_id TEXT REFERENCES question(id),
      category TEXT null,
      rank INTEGER null,
      objective TEXT null,
      actions TEXT null,
      indicator TEXT null,
      due_date TEXT null,
      origin TEXT null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP null
    )
  `);
};
