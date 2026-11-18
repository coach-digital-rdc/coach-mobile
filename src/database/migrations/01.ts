import {getDBConnection} from '../../services/database.service';

// DRC observation grid (B04): number and order of the paper tool, domain,
// overall score of the sub-domain and "N/A" answer.
export const runMigrationV1 = async () => {
  const db = await getDBConnection();

  await db.executeSql('ALTER TABLE competence ADD COLUMN code TEXT null');
  await db.executeSql(
    'ALTER TABLE competence ADD COLUMN domain_code TEXT null',
  );
  await db.executeSql(
    'ALTER TABLE competence ADD COLUMN domain_title TEXT null',
  );
  await db.executeSql(
    'ALTER TABLE competence ADD COLUMN display_order INTEGER null',
  );
  await db.executeSql(
    'ALTER TABLE competence ADD COLUMN has_global_score INTEGER DEFAULT 0',
  );
  await db.executeSql('ALTER TABLE question ADD COLUMN code TEXT null');
  await db.executeSql(
    'ALTER TABLE question ADD COLUMN display_order INTEGER null',
  );
  await db.executeSql(
    'ALTER TABLE question ADD COLUMN allow_na INTEGER DEFAULT 0',
  );
};
