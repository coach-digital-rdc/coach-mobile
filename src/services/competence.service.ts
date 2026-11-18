import {Competence} from '../types/competence';
import {Question} from '../types/question';
import {getDBConnection} from './database.service';
import {SessionService} from './session.service';

type QuestionCompetence = {
  competence_id: string;
  competence_title: string;
  competence_code: string | null;
  competence_domain_code: string | null;
  competence_domain_title: string | null;
  competence_has_global_score: number;
} & Question;

const sqlText = (value?: string | null) =>
  value === null || value === undefined
    ? 'NULL'
    : `'${String(value).replaceAll("'", "''")}'`;

const CompetenceService = {
  listCompetenciesWithAnswersBySession: async (
    sessionId: string,
  ): Promise<Competence[]> => {
    const competences = await CompetenceService.listCompetenciesWithQuestions();

    return Promise.all(
      competences.map(async competence => ({
        ...competence,
        questions: await Promise.all(
          competence.questions.map(async question => ({
            ...question,
            answers: await SessionService.getAnswersByQuestionAndSession(
              question.id,
              sessionId,
            ),
          })),
        ),
      })),
    );
  },

  listCompetenciesWithQuestions: async (): Promise<Competence[]> => {
    const db = await getDBConnection();
    const results = await db.executeSql(`
      SELECT
        c.id as competence_id,
        c.title as competence_title,
        c.code as competence_code,
        c.domain_code as competence_domain_code,
        c.domain_title as competence_domain_title,
        c.has_global_score as competence_has_global_score,
        q.id as id,
        q.title as title,
        q.type as type,
        q.code as code,
        q.allow_na as allow_na,
        q.scale as scale,
        q.description as description,
        q.tooltip_data as tooltip_data
      FROM question as q
      INNER JOIN competence as c ON c.id = q.competence_id
      ORDER BY c.display_order, q.display_order
    `);

    const resultParsed: QuestionCompetence[] = results[0].rows.raw();

    return resultParsed.reduce(
      (
        list,
        {
          competence_id,
          competence_title,
          competence_code,
          competence_domain_code,
          competence_domain_title,
          competence_has_global_score,
          ...question
        },
      ) => {
        const competence = list.find(i => i.id === competence_id);
        if (competence) {
          competence?.questions.push(question as any);
          return list;
        }

        return [
          ...list,
          {
            id: competence_id,
            title: competence_title,
            code: competence_code,
            domain_code: competence_domain_code,
            domain_title: competence_domain_title,
            has_global_score: !!competence_has_global_score,
            questions: [question],
          },
        ] as any[];
      },
      [] as Competence[],
    );
  },

  sync: async (competencies: Competence[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      competencies?.map(competence => {
        return db.executeSql(`
          INSERT OR REPLACE INTO competence(id, title, code, domain_code, domain_title, display_order, has_global_score, _status)
          VALUES ('${competence.id}', ${sqlText(competence.title)}, ${sqlText(
          competence.code,
        )}, ${sqlText(competence.domain_code)}, ${sqlText(
          competence.domain_title,
        )}, ${competence.display_order ?? 'NULL'}, ${
          competence.has_global_score ? 1 : 0
        }, 'synced')
        `);
      }),
    );
  },
};

export default CompetenceService;
