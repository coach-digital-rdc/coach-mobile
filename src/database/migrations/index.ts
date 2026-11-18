import {StorageService} from '../../services/storage.service';
import {runMigrationV0} from './00';
import {runMigrationV1} from './01';
import {runMigrationV2} from './02';

const NP_MIGRATION_LIST = [runMigrationV0, runMigrationV1, runMigrationV2];

export const runMigrations = async () => {
  const version = parseInt(
    (await StorageService.getDatabaseVersion()) || '0',
    10,
  );

  try {
    for (let index = version; index < NP_MIGRATION_LIST.length; index++) {
      await NP_MIGRATION_LIST[index]();
      console.log(`Migration ${index} - DONE`);
    }

    await StorageService.setDatabaseVersion(String(NP_MIGRATION_LIST.length));
    console.log('DATABASE SYNCED');
  } catch (error) {
    console.log({error});
    console.log("DATABASE DIDN'T SYNC");
  }
};
