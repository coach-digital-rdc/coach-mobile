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
import {NOT_APPLICABLE} from '../helpers/answer.helper';
import moment from 'moment';

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
      INSERT INTO session(id, subject, school_id, coach_id, teacher_id, level, school_year, teacher_weekly_load, last_observation_date, observer_function, session_status, created_at, _status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PREPARATION', ?, 'pending')
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

  getSessionById: async (id: string): Promise<Session | undefined> => {
    const db = await getDBConnection();
    const result = await db.executeSql('SELECT * FROM session WHERE id = ?', [
      id,
    ]);
    return result[0].rows.raw()[0];
  },

  // End of the preparation (header and checklist): the observation starts.
  startObservation: async (sessionId: string): Promise<void> => {
    const db = await getDBConnection();
    await db.executeSql(
      `
      UPDATE session
      SET session_status = 'OBSERVATION', observation_started_at = COALESCE(observation_started_at, ?), _status = 'pending'
      WHERE id = ?
    `,
      [new Date().toJSON(), sessionId],
    );
  },

  // End of the observation: the notes become read-only and the scoring is unlocked (B14).
  // The times of the didactic sequence default to those of the observation.
  endObservation: async (sessionId: string): Promise<void> => {
    const db = await getDBConnection();
    const session = await SessionService.getSessionById(sessionId);
    const now = new Date();
    await db.executeSql(
      `
      UPDATE session
      SET session_status = 'EVALUATION', observation_ended_at = COALESCE(observation_ended_at, ?),
        start_time = COALESCE(start_time, ?), end_time = COALESCE(end_time, ?), _status = 'pending'
      WHERE id = ?
    `,
      [
        now.toJSON(),
        moment(session?.observation_started_at || now).format('HH:mm'),
        moment(now).format('HH:mm'),
        sessionId,
      ],
    );
  },

  // Times of the didactic sequence, advice and place of the signature (B16)
  saveAdvice: async (
    sessionId: string,
    advice: Pick<
      Session,
      'start_time' | 'end_time' | 'advice' | 'signed_place'
    >,
  ): Promise<void> => {
    const db = await getDBConnection();
    await db.executeSql(
      `
      UPDATE session SET start_time = ?, end_time = ?, advice = ?, signed_place = ?, _status = 'pending'
      WHERE id = ?
    `,
      [
        advice.start_time || null,
        advice.end_time || null,
        advice.advice || null,
        advice.signed_place || null,
        sessionId,
      ],
    );
  },

  // Answers of the scoring, kept until the session is closed
  saveEvaluation: async (
    sessionId: string,
    keyPoints: string,
    answers: Partial<Answer>[],
  ): Promise<void> => {
    const db = await getDBConnection();
    await db.executeSql(
      "UPDATE session SET key_points = ?, _status = 'pending' WHERE id = ?",
      [keyPoints, sessionId],
    );
    await SessionService.saveAnswers(sessionId, answers);
  },

  // One answer per behaviour and per session: the existing one is updated
  saveAnswers: async (
    sessionId: string,
    answers: Partial<Answer>[],
  ): Promise<void> => {
    const db = await getDBConnection();
    for (const answer of answers) {
      const values = [answer.value, answer.not_applicable ? 1 : 0];
      const updated = await db.executeSql(
        `
        UPDATE answer SET value = ?, not_applicable = ?, _status = 'pending'
        WHERE session_id = ? AND question_id = ?
      `,
        [...values, sessionId, answer.question_id],
      );
      if (!updated[0].rowsAffected) {
        await db.executeSql(
          `
          INSERT INTO answer(value, not_applicable, id, session_id, question_id, _status)
          VALUES (?, ?, ?, ?, ?, 'pending')
        `,
          [...values, uuid(), sessionId, answer.question_id],
        );
      }
    }
  },

  // Answers of the form by behaviour, to resume the evaluation
  getAnswersMap: async (
    sessionId: string,
  ): Promise<{[questionId: string]: number}> => {
    const db = await getDBConnection();
    const result = await db.executeSql(
      'SELECT * FROM answer WHERE session_id = ?',
      [sessionId],
    );
    return result[0].rows.raw().reduce(
      (map: {[questionId: string]: number}, answer: Answer) => ({
        ...map,
        [answer.question_id]: answer.not_applicable
          ? NOT_APPLICABLE
          : Number(answer.value),
      }),
      {},
    );
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

    await SessionService.saveAnswers(sessionId, answers);

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
