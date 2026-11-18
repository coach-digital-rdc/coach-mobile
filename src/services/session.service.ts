import {Answer} from '../types/answer';
import {
  Competence,
  CompetenceAnalytics,
  CompetenceAnswers,
} from '../types/competence';
import {Feedback} from '../types/feedback';
import {Session} from '../types/session';
import {SessionActivity} from '../types/session-activity';
import {getDBConnection} from './database.service';
import {v4 as uuid} from 'uuid';
import {ImageService} from './image.service';

export const SessionService = {
  findSessionFromTeacher: async (
    teacher_id: string,
    pageSize: number,
    pageNumber: number,
  ): Promise<Session[]> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
        SELECT s.*
        FROM session as s
        WHERE s.teacher_id = ?
        ORDER BY created_at DESC
        LIMIT ?
        OFFSET ?
      `,
      [teacher_id, pageSize, (pageNumber - 1) * pageSize],
    )) as any[];

    return result[0].rows.raw();
  },

  sync: async (sessions: Session[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      sessions?.map(session => {
        return db.executeSql(
          `
          INSERT OR REPLACE INTO session(id, students_count, subject, lesson_time, objective, school_id, coach_id, key_points, teacher_id, latitude, longitude, feedback_id, session_status, level, school_year, teacher_weekly_load, last_observation_date, last_observation_rating, observer_function, start_time, end_time, advice, signed_place, observation_started_at, observation_ended_at, completed_at, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            session.id,
            session.students_count,
            session.subject,
            session.lesson_time,
            session.objective,
            session.school_id,
            session.coach_id,
            session.key_points,
            session.teacher_id,
            session.latitude,
            session.longitude,
            session.feedback_id,
            session.session_status,
            session.level,
            session.school_year,
            session.teacher_weekly_load,
            session.last_observation_date,
            session.last_observation_rating,
            session.observer_function,
            session.start_time,
            session.end_time,
            session.advice,
            session.signed_place,
            session.observation_started_at,
            session.observation_ended_at,
            session.completed_at,
          ],
        );
      }),
    );
  },

  syncFeedbacks: async (feedbacks: Feedback[]): Promise<void> => {
    const db = await getDBConnection();

    await Promise.all(
      feedbacks?.map(feedback => {
        return db.executeSql(
          `
          INSERT OR REPLACE INTO feedback(id, value, answer_id, _status)
          VALUES (?, ?, ?, 'synced')
        `,
          [feedback.id, feedback.value, feedback.answer_id],
        );
      }),
    );
  },

  // Creates the session when the header of the sheet is saved (B10, B11): the
  // observation starts. The answers are added when the observation is completed.
  startLocalSession: async (
    session: Partial<Session>,
    activity: Partial<SessionActivity>,
  ): Promise<string> => {
    const db = await getDBConnection();
    const sessionId = uuid();
    const now = new Date().toJSON();

    await db.executeSql(
      `
      INSERT INTO session(id, subject, school_id, coach_id, teacher_id, level, school_year, teacher_weekly_load, last_observation_date, observer_function, session_status, observation_started_at, created_at, _status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'OBSERVATION', ?, ?, 'pending')
    `,
      [
        sessionId,
        session.subject,
        session.school_id,
        session.coach_id,
        session.teacher_id,
        session.level,
        session.school_year,
        session.teacher_weekly_load,
        session.last_observation_date,
        session.observer_function,
        now,
        now,
      ],
    );

    await db.executeSql(
      `
      INSERT INTO session_activity(id, session_id, sub_domain, discipline, sheet_code, class_name, p_i, time, essential_knowledge, display_order, created_at, _status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'pending')
    `,
      [
        uuid(),
        sessionId,
        activity.sub_domain,
        activity.discipline,
        activity.sheet_code,
        activity.class_name,
        activity.p_i,
        activity.time,
        activity.essential_knowledge,
        now,
      ],
    );

    return sessionId;
  },

  // Saves the answers and closes the session started by startLocalSession.
  completeLocalSession: async (
    sessionId: string,
    session: Partial<Session>,
    answers: Partial<Answer>[],
  ): Promise<string> => {
    const db = await getDBConnection();
    const now = new Date().toJSON();

    await db.executeSql(
      `
      UPDATE session
      SET key_points = ?, latitude = ?, longitude = ?, session_status = 'COMPLETED',
        observation_ended_at = COALESCE(observation_ended_at, ?), completed_at = ?, _status = 'pending'
      WHERE id = ?
    `,
      [
        session.key_points,
        session.latitude,
        session.longitude,
        now,
        now,
        sessionId,
      ],
    );

    await Promise.all(
      answers.map(answer =>
        db.executeSql(
          `
            INSERT INTO answer(id, session_id, question_id, value, not_applicable, _status)
            VALUES (?, ?, ?, ?, ?, 'pending')
          `,
          [
            uuid(),
            sessionId,
            answer.question_id,
            answer.value,
            answer.not_applicable ? 1 : 0,
          ],
        ),
      ),
    );

    return sessionId;
  },

  // Session started on the device and not completed yet, to resume it
  findOpenSession: async (teacherId: string): Promise<Session | undefined> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      `
      SELECT * FROM session
      WHERE teacher_id = ? AND session_status IN ('PREPARATION', 'OBSERVATION', 'EVALUATION')
      ORDER BY created_at DESC LIMIT 1
    `,
      [teacherId],
    );
    return result[0].rows.raw()[0];
  },

  syncActivities: async (activities: SessionActivity[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      (activities || []).map(activity =>
        db.executeSql(
          `
          INSERT OR REPLACE INTO session_activity(id, session_id, sub_domain, discipline, sheet_code, class_name, p_i, time, essential_knowledge, display_order, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            activity.id,
            activity.session_id,
            activity.sub_domain,
            activity.discipline,
            activity.sheet_code,
            activity.class_name,
            activity.p_i,
            activity.time,
            activity.essential_knowledge,
            activity.display_order,
          ],
        ),
      ),
    );
  },

  createLocalSession: async (
    session: Partial<Session>,
    answers: Partial<Answer>[],
  ): Promise<string> => {
    const db = await getDBConnection();
    const sessionId = uuid();

    await db.executeSql(
      `
      INSERT INTO session(id, students_count, subject, lesson_time, objective, school_id, coach_id, key_points, teacher_id, latitude, longitude, _status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `,
      [
        sessionId,
        session.students_count,
        session.subject,
        session.lesson_time,
        session.objective,
        session.school_id,
        session.coach_id,
        session.key_points,
        session.teacher_id,
        session.latitude,
        session.longitude,
      ],
    );

    await Promise.all(
      answers.map(
        async answer =>
          await db.executeSql(
            `
              INSERT INTO answer(id, session_id, question_id, value, not_applicable, _status)
              VALUES (?, ?, ?, ?, ?, 'pending')
            `,
            [
              uuid(),
              sessionId,
              answer.question_id,
              answer.value,
              answer.not_applicable ? 1 : 0,
            ],
          ),
      ),
    );

    return sessionId;
  },

  getAnswersByQuestionAndSession: async (
    questionId: string,
    sessionId: string,
  ): Promise<Answer[]> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
        SELECT
          a.*
        FROM answer as a
        WHERE
          a.question_id = ?
        AND
          a.session_id = ?
      `,
      [questionId, sessionId],
    )) as any[];

    return result[0].rows.raw();
  },

  getSessionAnswersGroupedByCompetence: async (
    sessionId: string,
  ): Promise<CompetenceAnswers[]> => {
    const db = await getDBConnection();
    const competenciesResult = (await db.executeSql(
      'SELECT c.* FROM competence as c',
    )) as any[];

    const competencies = competenciesResult[0].rows.raw();

    return await Promise.all(
      competencies.map(async (competence: any) => {
        const answersResult = (await db.executeSql(
          `SELECT a.* 
             FROM answer as a 
       INNER JOIN question as q ON q.id = a.question_id
            WHERE a.session_id = ? 
              AND q.competence_id = ?`,
          [sessionId, competence.id],
        )) as any[];

        const answers = answersResult[0].rows.raw();

        return {
          ...competence,
          answers: await Promise.all(
            answers.map(async (answer: Answer) => {
              const questionResult = (await db.executeSql(
                'SELECT q.* FROM question as q WHERE q.id = ?',
                [answer.question_id],
              )) as any[];

              return {...answer, question: questionResult[0].rows.raw()[0]};
            }),
          ),
        };
      }),
    );
  },

  getSessionAnswersCountGroupedByCompetence: async (
    sessionId: string,
  ): Promise<CompetenceAnalytics[]> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
        SELECT
          c.*,
          (SELECT q.scale FROM question as q WHERE q.competence_id = c.id LIMIT 1) as questionsScale,
          (SELECT COUNT(*) FROM question as q WHERE q.competence_id = c.id) as totalQuestions,
          (SELECT SUM(a.value) FROM answer as a INNER JOIN question as q ON a.question_id = q.id WHERE q.competence_id = c.id AND a.session_id = ?) as sumAnswers
        FROM competence as c
      `,
      [sessionId],
    )) as any[];

    return result[0].rows.raw();
  },

  createLocalFeedback: async (
    {value, answer_id}: Partial<Feedback>,
    session_id: string,
  ) => {
    const db = await getDBConnection();
    const feedbackId = uuid();

    await db.executeSql(
      `
      INSERT INTO feedback(id, value, answer_id, _status)
      VALUES (?, ?, ?, 'pending')
    `,
      [feedbackId, value, answer_id],
    );

    await db.executeSql(
      `
      UPDATE session
      SET feedback_id = ?, _status = 'pending'
      WHERE id = ?
    `,
      [feedbackId, session_id],
    );

    return feedbackId;
  },

  getFeedbackById: async (
    id: string,
  ): Promise<Feedback & {competence_title: string}> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
        SELECT
          f.*,
          c.id as competence_id,
          c.title as competence_title
        FROM feedback as f
        INNER JOIN answer as a on a.id = f.answer_id
        INNER JOIN question as q on q.id = a.question_id
        INNER JOIN competence as c on c.id = q.competence_id
        WHERE f.id = ?
      `,
      [id],
    )) as any[];

    const feedback = result[0].rows.raw()[0];

    return {
      ...feedback,
      images: await ImageService.getImagesByExternalId(feedback.id),
    };
  },

  insertSessionsFromServer: async (sessions: Session[]) => {
    const db = await getDBConnection();

    await Promise.all(
      sessions?.map(async session => {
        await db.executeSql(
          `
          INSERT OR REPLACE INTO session(id, students_count, subject, lesson_time, objective, school_id, coach_id, key_points, teacher_id, latitude, longitude, feedback_id, session_status, level, school_year, teacher_weekly_load, last_observation_date, last_observation_rating, observer_function, start_time, end_time, advice, signed_place, observation_started_at, observation_ended_at, completed_at, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            session.id,
            session.students_count,
            session.subject,
            session.lesson_time,
            session.objective,
            session.school_id,
            session.coach_id,
            session.key_points,
            session.teacher_id,
            session.latitude,
            session.longitude,
            session.feedback_id,
            session.session_status,
            session.level,
            session.school_year,
            session.teacher_weekly_load,
            session.last_observation_date,
            session.last_observation_rating,
            session.observer_function,
            session.start_time,
            session.end_time,
            session.advice,
            session.signed_place,
            session.observation_started_at,
            session.observation_ended_at,
            session.completed_at,
          ],
        );

        if (session.answers) {
          await Promise.all(
            session.answers?.map(
              async answer =>
                await db.executeSql(
                  `
                  INSERT OR REPLACE INTO answer(id, session_id, question_id, value, not_applicable, _status)
                  VALUES (?, ?, ?, ?, ?, 'synced')
                `,
                  [
                    answer.id,
                    session.id,
                    answer.question_id,
                    answer.value,
                    answer.not_applicable ? 1 : 0,
                  ],
                ),
            ),
          );
        }

        if (session.feedback) {
          return db.executeSql(
            `
              INSERT OR REPLACE INTO feedback(id, value, answer_id, _status)
              VALUES (?, ?, ?, 'synced')
            `,
            [
              session.feedback.id,
              session.feedback.value,
              session.feedback.answer_id,
            ],
          );
        }
      }),
    );
  },
};
