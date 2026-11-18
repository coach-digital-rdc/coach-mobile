import {getDBConnection} from '../../services/database.service';

// "N/A" answer of a behaviour (B05): the value stays empty.
export const runMigrationV2 = async () => {
  const db = await getDBConnection();

  await db.executeSql(
    'ALTER TABLE answer ADD COLUMN not_applicable INTEGER DEFAULT 0',
  );
};
