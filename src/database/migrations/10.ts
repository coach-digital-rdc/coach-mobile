import {getDBConnection} from '../../services/database.service';

// Learning circles (B22): school, participants and their number.
export const runMigrationV10 = async () => {
  const db = await getDBConnection();

  await db.executeSql(
    'ALTER TABLE TLC_evaluation ADD COLUMN school_id TEXT null',
  );
  await db.executeSql(
    'ALTER TABLE TLC_evaluation ADD COLUMN participants TEXT null',
  );
  await db.executeSql(
    'ALTER TABLE TLC_evaluation ADD COLUMN participants_count INTEGER null',
  );
};
