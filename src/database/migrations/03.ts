import {getDBConnection} from '../../services/database.service';

// Session flow (B10, B11): header of the paper tool, time of each step and
// observed activity; sex and weekly load of the teacher.
export const runMigrationV3 = async () => {
  const db = await getDBConnection();

  await db.executeSql('ALTER TABLE teacher ADD COLUMN sex TEXT null');
  await db.executeSql(
    'ALTER TABLE teacher ADD COLUMN weekly_load INTEGER null',
  );

  const sessionColumns = [
    'level TEXT',
    'school_year TEXT',
    'teacher_weekly_load INTEGER',
    'last_observation_date TIMESTAMP',
    'last_observation_rating TEXT',
    'observer_function TEXT',
    'start_time TEXT',
    'end_time TEXT',
    'advice TEXT',
    'signed_place TEXT',
    'observation_started_at TIMESTAMP',
    'observation_ended_at TIMESTAMP',
    'completed_at TIMESTAMP',
  ];
  for (const column of sessionColumns) {
    await db.executeSql(`ALTER TABLE session ADD COLUMN ${column} null`);
  }

  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS session_activity (
      id TEXT PRIMARY KEY,
      _status TEXT,

      session_id TEXT REFERENCES session(id),
      sub_domain TEXT null,
      discipline TEXT null,
      sheet_code TEXT null,
      class_name TEXT null,
      p_i TEXT null,
      time TEXT null,
      essential_knowledge TEXT null,
      display_order INTEGER null,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
