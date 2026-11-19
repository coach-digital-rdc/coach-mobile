import axios from 'axios';
import {Answer} from '../types/answer';
import {SessionActivity} from '../types/session-activity';
import {Coach} from '../types/coach';
import {Feedback} from '../types/feedback';
import {Image} from '../types/image';
import {Session} from '../types/session';
import {Teacher} from '../types/teacher';
import {getDBConnection} from './database.service';
import DeviceInfo from 'react-native-device-info';
import GeolocationService from './geolocation.service';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {StorageService} from './storage.service';
import {SyncData} from '../types/sync';
import {TeacherService} from './teacher.service';
import {SessionService} from './session.service';
import {AnswerService} from './answer.service';
import {API_URL} from '@env';
import CompetenceService from './competence.service';
import {QuestionService} from './question.service';
import {CoachService} from './coach.service';
import {ChecklistService} from './checklist.service';
import {Documentation} from '../types/checklist';
import {NoteService} from './note.service';
import {ObservationNote} from '../types/observation-note';
import {ScoreService} from './score.service';
import {CompetenceScore} from '../types/competence-score';
import {PdpService} from './pdp.service';
import {SignatureService} from './signature.service';

const SyncService = {
  getUnsyncedItemsCount: async (): Promise<{
    pendingTeachers: number;
    pendingFeedbacks: number;
    pendingSessions: number;
  }> => {
    const db = await getDBConnection();

    const results = await db.executeSql(`
        SELECT
            (SELECT COUNT(*) FROM teacher where _status != 'synced') AS pendingTeachers,
            (SELECT COUNT(*) FROM feedback where _status != 'synced') AS pendingFeedbacks,
            (SELECT COUNT(*) FROM session where _status != 'synced') AS pendingSessions
    `);

    return results[0].rows.raw()[0];
  },

  trySyncData: async (firstSync = false): Promise<void> => {
    try {
      const db = await getDBConnection();

      const changes = {
        images: firstSync ? [] : await SyncService.getPendingImages(db),
        coaches: firstSync ? [] : await SyncService.getPendingCoaches(db),
        coachSchools: firstSync
          ? []
          : await SyncService.getPendingCoachSchools(db),
        teachers: firstSync ? [] : await SyncService.getPendingTeachers(db),
        sessions: firstSync ? [] : await SyncService.getPendingSessions(db),
        answers: firstSync ? [] : await SyncService.getPendingAnswers(db),
        feedbacks: firstSync ? [] : await SyncService.getPendingFeedbacks(db),
        sessionActivities: firstSync
          ? []
          : await SyncService.getPendingSessionActivities(db),
        documentations: firstSync
          ? []
          : await SyncService.getPendingDocumentations(db),
        observationNotes: firstSync
          ? []
          : await SyncService.getPendingObservationNotes(db),
        competenceScores: firstSync
          ? []
          : await SyncService.getPendingCompetenceScores(db),
        pdps: firstSync ? [] : await SyncService.getPending(db, 'pdp'),
        sessionSignatures: firstSync
          ? []
          : await SyncService.getPending(db, 'session_signature'),
        pdpObjectives: firstSync
          ? []
          : await SyncService.getPending(db, 'pdp_objective'),
      };
      console.log('2');

      const currentSchool = await StorageService.getCurrentSchool();
      const lastSync = await StorageService.getLastSync();

      const response = await axios.post<SyncData>(
        `${API_URL}/sync`,
        {
          changes,
          lastSync,
          model: DeviceInfo.getDeviceId(),
          apiLevel: await DeviceInfo.getApiLevel(),
          deviceId: await DeviceInfo.getUniqueId(),
          ...(await GeolocationService.getLocation()),
        },
        {headers: {token: currentSchool?.schoolKey}},
      );

      if (response.status !== 200) {
        throw new Error('Fail to sync');
      }

      if (currentSchool && response.data.total > 0) {
        await CompetenceService.sync(response.data.competencies);
        await SyncService.syncCoaches(response.data.coaches);
        await QuestionService.sync(response.data.questions);
        await TeacherService.sync(response.data.teachers);
        await SessionService.sync(response.data.sessions);
        await AnswerService.sync(response.data.answers);
        await SessionService.syncActivities(response.data.sessionActivities);
        await ChecklistService.syncItems(response.data.checklistItems);
        await ChecklistService.syncAnswers(response.data.documentations);
        await NoteService.syncNotes(response.data.observationNotes);
        await ScoreService.syncScores(response.data.competenceScores);
        await PdpService.syncRules(
          response.data.pdpRuleSets,
          response.data.pdpLibraryItems,
        );
        await SignatureService.syncSignatures(response.data.sessionSignatures);
        await PdpService.syncPdps(
          response.data.pdps,
          response.data.pdpObjectives,
        );
        await SessionService.syncFeedbacks(response.data.feedbacks);
        await StorageService.setLastSync(new Date());
      }

      await SyncService.updateAllToSynced(db);
    } catch (err) {
      console.log(JSON.stringify(err));
    }
  },

  // Coaches of the school; the profile of the connected observer is refreshed
  syncCoaches: async (coaches: Coach[]): Promise<void> => {
    const currentCoach = await StorageService.getCurrentCoach();
    for (const coach of coaches || []) {
      await CoachService.insertOrUpdateCoach(coach);
      if (coach.id === currentCoach?.id) {
        await StorageService.setCurrentCoach({...currentCoach, ...coach});
      }
    }
  },

  updateAllToSynced: async (db: SQLiteDatabase): Promise<void> => {
    await Promise.all([
      SyncService.updateToSyncedImages(db),
      SyncService.updateToSyncedCoachSchools(db),
      SyncService.updateToSyncedCoaches(db),
      SyncService.updateToSyncedTeachers(db),
      SyncService.updateToSyncedSession(db),
      SyncService.updateToSyncedAnswers(db),
      SyncService.updateToSyncedSessionActivities(db),
      SyncService.updateToSyncedDocumentations(db),
      SyncService.updateToSyncedObservationNotes(db),
      SyncService.updateToSyncedCompetenceScores(db),
      SyncService.updateToSynced(db, 'pdp'),
      SyncService.updateToSynced(db, 'session_signature'),
      SyncService.updateToSynced(db, 'pdp_objective'),
      SyncService.updateToSyncedFeedbacks(db),
    ]);
  },

  getPendingImages: async (db: SQLiteDatabase): Promise<Image[]> => {
    const results = await db.executeSql(
      "SELECT * FROM image WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedImages: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE image SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingCoaches: async (db: SQLiteDatabase): Promise<Coach[]> => {
    const results = await db.executeSql(
      "SELECT * FROM coach WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  getPendingCoachSchools: async (db: SQLiteDatabase): Promise<Coach[]> => {
    const results = await db.executeSql(
      "SELECT * FROM coach_school WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedCoachSchools: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE coach_school SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  updateToSyncedCoaches: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE coach SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingTeachers: async (db: SQLiteDatabase): Promise<Teacher[]> => {
    const results = await db.executeSql(
      "SELECT * FROM teacher WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedTeachers: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE teacher SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingSessions: async (db: SQLiteDatabase): Promise<Session[]> => {
    const results = await db.executeSql(
      "SELECT * FROM session WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedSession: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE session SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingSessionActivities: async (
    db: SQLiteDatabase,
  ): Promise<SessionActivity[]> => {
    const results = await db.executeSql(
      "SELECT * FROM session_activity WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedSessionActivities: async (
    db: SQLiteDatabase,
  ): Promise<void> => {
    await db.executeSql(
      "UPDATE session_activity SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingDocumentations: async (
    db: SQLiteDatabase,
  ): Promise<Documentation[]> => {
    const results = await db.executeSql(
      "SELECT * FROM documentation WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedDocumentations: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE documentation SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingObservationNotes: async (
    db: SQLiteDatabase,
  ): Promise<ObservationNote[]> => {
    const results = await db.executeSql(
      "SELECT * FROM observation_note WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedObservationNotes: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE observation_note SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingCompetenceScores: async (
    db: SQLiteDatabase,
  ): Promise<CompetenceScore[]> => {
    const results = await db.executeSql(
      "SELECT * FROM competence_score WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedCompetenceScores: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE competence_score SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  // Rows of a table created or changed on the device since the last sync
  getPending: async (db: SQLiteDatabase, table: string): Promise<any[]> => {
    const results = await db.executeSql(
      `SELECT * FROM ${table} WHERE _status != 'synced'`,
    );

    return results[0].rows.raw();
  },

  updateToSynced: async (db: SQLiteDatabase, table: string): Promise<void> => {
    await db.executeSql(
      `UPDATE ${table} SET _status = 'synced' WHERE _status != 'synced'`,
    );
  },

  getPendingAnswers: async (db: SQLiteDatabase): Promise<Answer[]> => {
    const results = await db.executeSql(
      "SELECT * FROM answer WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedAnswers: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE answer SET _status = 'synced' WHERE _status != 'synced'",
    );
  },

  getPendingFeedbacks: async (db: SQLiteDatabase): Promise<Feedback[]> => {
    const results = await db.executeSql(
      "SELECT * FROM feedback WHERE _status != 'synced'",
    );

    return results[0].rows.raw();
  },

  updateToSyncedFeedbacks: async (db: SQLiteDatabase): Promise<void> => {
    await db.executeSql(
      "UPDATE feedback SET _status = 'synced' WHERE _status != 'synced'",
    );
  },
};

export default SyncService;
