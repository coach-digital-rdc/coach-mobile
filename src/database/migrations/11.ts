import {getDBConnection} from '../../services/database.service';

// Appreciation of the observation, suggested then kept or changed by the observer (B11).
export const runMigrationV11 = async () => {
  const db = await getDBConnection();

  await db.executeSql(
    'ALTER TABLE session ADD COLUMN suggested_appreciation TEXT null',
  );
  await db.executeSql('ALTER TABLE session ADD COLUMN appreciation TEXT null');
};
