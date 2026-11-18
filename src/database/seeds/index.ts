import {SEEDS} from '@env';
import {
  SEED_CD_INSERT_CHECKLIST,
  SEED_CD_INSERT_COMPETENCIES,
  SEED_CD_INSERT_PDP_LIBRARY,
  SEED_CD_INSERT_PDP_RULE_SET,
  SEED_CD_INSERT_QUESTIONS,
} from './cd';
import {StorageService} from '../../services/storage.service';
import {getDBConnection} from '../../services/database.service';

const ENABLE_SEEDS: any = {
  SEED_CD_INSERT_COMPETENCIES,
  SEED_CD_INSERT_QUESTIONS,
  SEED_CD_INSERT_CHECKLIST,
  SEED_CD_INSERT_PDP_RULE_SET,
  SEED_CD_INSERT_PDP_LIBRARY,
};

export const runSeeds = async () => {
  try {
    const sownSeeds = await StorageService.getSownSeeds();
    const splittedSownSeeds = sownSeeds?.split(',') || [];
    const splittedSeeds = SEEDS?.split(',') || [];

    if (!!SEEDS && SEEDS !== sownSeeds) {
      const db = await getDBConnection();
      for (let index = 0; index < splittedSeeds.length; index++) {
        const seed = splittedSeeds[index];
        if (ENABLE_SEEDS[seed] && !splittedSownSeeds.includes(seed)) {
          await db.executeSql(ENABLE_SEEDS[seed]);
          console.log(`SEED "${seed}" - DONE`);
        }
      }

      await StorageService.setSownSeeds(SEEDS);
    } else {
      console.log(`WITHOUT SEED's TO APPLY`);
    }
  } catch (err) {
    console.log({err});
  }
};
