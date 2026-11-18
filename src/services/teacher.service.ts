import {
  Teacher,
  TeacherDetailsType,
  TeacherItemType,
  TeacherToEditType,
} from '../types/teacher';
import {getDBConnection} from './database.service';
import {v4 as uuid} from 'uuid';

export const TeacherService = {
  findTeachersItemBySchoolId: async (
    filter: string,
    school_id: string,
    pageSize: number,
    pageNumber: number,
  ): Promise<TeacherItemType[]> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
        SELECT
          t.id as id,
          i.value as image,
          s.created_at AS last_session_date,
          t.name || ' ' || t.surname as name,
          (SELECT COUNT(*) FROM session as s WHERE s.teacher_id = t.id) as sessionsCount,
          (SELECT COUNT(*) FROM session as s WHERE s.teacher_id = t.id AND s.feedback_id IS NOT NULL) as feedbacksCount
        FROM teacher as t
        LEFT JOIN image as i ON i.id = t.image_id
        LEFT JOIN (
          SELECT teacher_id, MAX(created_at) AS created_at
          FROM session
          GROUP BY teacher_id
        ) as s ON t.id = s.teacher_id
        WHERE
          t.school_id = ?
        AND
          UPPER(t.name) LIKE UPPER(?) || '%'
        ORDER BY t.created_at DESC
        LIMIT ?
        OFFSET ?
      `,
      [school_id, filter, pageSize, (pageNumber - 1) * pageSize],
    )) as any[];

    return result[0].rows.raw();
  },

  getTeacherDetails: async (id: string): Promise<TeacherDetailsType> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
        SELECT 
          t.id as id,
          t.name || ' ' || t.surname as name,
          t.subject as subject,
          t.weekly_load as weekly_load,
          (SELECT MAX(s.created_at) FROM session as s WHERE s.teacher_id = t.id) as last_session_date,
          i.value as image
        FROM teacher as t 
        LEFT JOIN image as i ON i.id = t.image_id 
        WHERE 
          t.id = ?
      `,
      [id],
    )) as any[];

    return result[0].rows.raw()[0];
  },

  getTeacherToEdit: async (id: string): Promise<TeacherToEditType> => {
    const db = await getDBConnection();
    const result = (await db.executeSql(
      `
        SELECT 
          t.id as id,
          t.name as name,
          t.surname as surname,
          t.subject as subject,
          t.birthdate as birthdate,
          t.emis_number as emis_number,
          i.id as image_id,
          t.pin as pin,
          t.nin as nin,
          t.sex as sex,
          t.weekly_load as weekly_load,
          i.name as image_name,
          i.value as image_value
        FROM teacher as t 
        LEFT JOIN image as i ON i.id = t.image_id 
        WHERE 
          t.id = ?
      `,
      [id],
    )) as any[];

    return result[0].rows.raw()[0];
  },

  sync: async (teachers: Teacher[]): Promise<void> => {
    const db = await getDBConnection();
    await Promise.all(
      teachers?.map(teacher => {
        return db.executeSql(
          `
          INSERT OR REPLACE INTO teacher(id, name, surname, emis_number, subject, school_id, image_id, pin, nin, birthdate, sex, weekly_load, _status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced')
        `,
          [
            teacher.id,
            teacher.name,
            teacher.surname,
            teacher.emis_number,
            teacher.subject,
            teacher.school_id,
            teacher.image_id,
            teacher.pin,
            teacher.nin,
            teacher.birthdate,
            teacher.sex,
            teacher.weekly_load,
          ],
        );
      }),
    );
  },

  create: async (teacher: Partial<Teacher>): Promise<void> => {
    const db = await getDBConnection();

    const result = await db.executeSql(
      `
      INSERT INTO teacher(id, name, surname, emis_number, subject, school_id, image_id, birthdate, pin, nin, sex, weekly_load, created_at, _status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `,
      [
        uuid(),
        teacher.name,
        teacher.surname,
        teacher.emis_number,
        teacher.subject,
        teacher.school_id,
        teacher.image_id,
        teacher.birthdate?.toJSON().toString(),
        teacher.pin,
        teacher.nin,
        teacher.sex,
        teacher.weekly_load,
        new Date().toJSON(),
      ],
    );

    console.log({result});
  },

  update: async (id: string, teacher: Partial<Teacher>): Promise<void> => {
    const db = await getDBConnection();
    await db.executeSql(
      `
      UPDATE teacher
      SET birthdate = COALESCE(?, birthdate), pin = ?, nin = ?, name = ?, surname = ?,
        emis_number = ?, subject = ?, image_id = ?, sex = ?, weekly_load = ?, _status = 'pending'
      WHERE id = ?
    `,
      [
        teacher.birthdate ? new Date(teacher.birthdate).toJSON() : null,
        teacher.pin,
        teacher.nin,
        teacher.name,
        teacher.surname,
        teacher.emis_number || '',
        teacher.subject,
        teacher.image_id,
        teacher.sex,
        teacher.weekly_load,
        id,
      ],
    );
  },
};
