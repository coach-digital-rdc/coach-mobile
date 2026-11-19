import {getDBConnection} from '../../services/database.service';

// Profile of the observer: sex, function, duty station and postal box (B21).
export const runMigrationV9 = async () => {
  const db = await getDBConnection();

  for (const column of ['sex', 'function', 'duty_station', 'postal_box']) {
    await db.executeSql(`ALTER TABLE coach ADD COLUMN ${column} TEXT null`);
  }
};
