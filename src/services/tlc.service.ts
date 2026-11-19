import {TLC} from '../types/tlc';
import {getDBConnection} from './database.service';
import {v4 as uuid} from 'uuid';

export const TLCService = {
  create: async (tlc: Partial<TLC>): Promise<void> => {
    const db = await getDBConnection();
    await db.executeSql(
      `
      INSERT INTO TLC_evaluation(id, unit_id, coach_id, school_id, evaluation, participants, participants_count, _status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `,
      [
        uuid(),
        tlc.unit_id,
        tlc.coach_id,
        tlc.school_id,
        tlc.evaluation,
        tlc.participants,
        tlc.participants_count,
      ],
    );
  },

  // Results of the school used to recommend a unit: closed sessions, teachers observed
  // and, for each behaviour, the number of observations where it was scored Faible (or Non)
  getSchoolResults: async (
    schoolId: string,
  ): Promise<{
    observations: number;
    teachers: number;
    weak: {[behaviourCode: string]: number};
  }> => {
    const db = await getDBConnection();
    const totals = (
      await db.executeSql(
        `
        SELECT COUNT(*) as observations, COUNT(DISTINCT teacher_id) as teachers
        FROM session WHERE school_id = ? AND session_status = 'COMPLETED'
      `,
        [schoolId],
      )
    )[0].rows.raw()[0];
    const weak = (
      await db.executeSql(
        `
        SELECT q.code as code, COUNT(DISTINCT a.session_id) as count
        FROM answer as a
        INNER JOIN question as q ON q.id = a.question_id
        INNER JOIN session as s ON s.id = a.session_id
        WHERE s.school_id = ? AND s.session_status = 'COMPLETED'
          AND (a.not_applicable IS NULL OR a.not_applicable = 0)
          AND ((q.type = 'FME' AND a.value = 1) OR (q.type = 'YES_NO' AND a.value = 0))
        GROUP BY q.code
      `,
        [schoolId],
      )
    )[0].rows.raw();
    return {
      observations: totals.observations,
      teachers: totals.teachers,
      weak: weak.reduce(
        (map: {[code: string]: number}, row: any) => ({
          ...map,
          [row.code]: row.count,
        }),
        {},
      ),
    };
  },
};
