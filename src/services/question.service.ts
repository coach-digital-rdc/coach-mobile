import {Answer} from '../types/answer';
import {Competence} from '../types/competence';
import {Question} from '../types/question';
import {getDBConnection} from './database.service';

export const QuestionService = {
  listQuestionsByCompetence: async (
    competence_id: Competence['id'],
  ): Promise<Question[]> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(`SELECT *
    FROM question
    WHERE competence_id = '${competence_id}'`)) as any[];

    return result[0].rows.raw();
  },

  findQuestionByAnswerId: async (
    answer_id: Answer['id'],
  ): Promise<Question> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
      SELECT q.*
        FROM question as q
  INNER JOIN answer as a on a.question_id = q.id
       WHERE a.id = '${answer_id}'
    `,
    )) as any[];

    return result[0].rows.raw()[0];
  },

  sync: async (questions: Question[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      questions?.map(question => {
        return db.executeSql(`
        INSERT OR REPLACE INTO question(id, title, description, tooltip_data, type, competence_id, scale, code, display_order, allow_na, _status)
        VALUES
          ('${question.id}', '${question.title.replaceAll("'", "''")}', ${
          question.description
            ? `'${question.description.replaceAll("'", "''")}'`
            : 'NULL'
        }, '${question.tooltip_data.replaceAll("'", "''")}', '${
          question.type || 'option'
        }', '${question.competence_id}', ${question.scale}, ${
          question.code ? `'${question.code}'` : 'NULL'
        }, ${question.display_order ?? 'NULL'}, ${
          question.allow_na ? 1 : 0
        }, 'synced');
     `);
      }),
    );
  },
};
