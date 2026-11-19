import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {PermissionsAndroid, Platform} from 'react-native';
import moment from 'moment';
import CompetenceService from './competence.service';
import {SessionService} from './session.service';
import {TeacherService} from './teacher.service';
import {ScoreService} from './score.service';
import {ChecklistService} from './checklist.service';
import {NoteService} from './note.service';
import {SignatureService} from './signature.service';
import {PdpService} from './pdp.service';
import {getDBConnection} from './database.service';
import i18n from '../i18n';
import {getSuggestedScore} from '../helpers/answer.helper';
import {
  ReportData,
  observationReportHtml,
  pdpReportHtml,
} from '../helpers/report.helper';
import {Coach} from '../types/coach';
import {School} from '../types/school';

export type ReportKind = 'observation' | 'pdp';

// A4 in points
const A4 = {width: 595, height: 842};

// Folder of the documents in the Downloads of the phone
const DOWNLOAD_FOLDER = 'Coach Digital';

// The two PDF documents of a closed session (B24, B25), generated on the device so that
// they are available right after the closure, even without connection.
export const ReportService = {
  loadData: async (
    sessionId: string,
    coach?: Coach | null,
    school?: School | null,
  ): Promise<ReportData> => {
    const db = await getDBConnection();
    const session = await SessionService.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }
    const [
      teacher,
      competencies,
      answers,
      savedScores,
      checklist,
      documentations,
      notes,
      signatures,
      saved,
      activities,
    ] = await Promise.all([
      TeacherService.getTeacherDetails(session.teacher_id),
      CompetenceService.listCompetenciesWithQuestions(),
      SessionService.getAnswersMap(sessionId),
      ScoreService.getScores(sessionId),
      ChecklistService.listItems(),
      ChecklistService.getSessionAnswers(sessionId),
      NoteService.listNotes(sessionId),
      SignatureService.getSignatures(sessionId),
      PdpService.getPdp(sessionId),
      db.executeSql(
        'SELECT * FROM session_activity WHERE session_id = ? ORDER BY display_order',
        [sessionId],
      ),
    ]);

    const scores: ReportData['scores'] = {};
    for (const competence of competencies) {
      scores[competence.id] =
        savedScores[competence.id]?.value ??
        getSuggestedScore(competence.questions, answers);
    }
    const ruleSet = saved
      ? (
          await db.executeSql('SELECT * FROM pdp_rule_set WHERE id = ?', [
            saved.pdp.rule_set_id,
          ])
        )[0].rows.raw()[0]
      : undefined;

    return {
      session,
      teacher: {name: teacher?.name || '', subject: teacher?.subject},
      school: {name: school?.name || ''},
      observer: {
        name: [coach?.name, coach?.surname].filter(Boolean).join(' '),
        phone: coach?.phone,
        email: coach?.email,
        sex: coach?.sex,
        // The function kept in the session, the current one otherwise
        function:
          session.observer_function || coach?.function
            ? // The documents follow the paper tool, in French
              i18n.t(
                `observer.function.${
                  session.observer_function || coach?.function
                }`,
                {lng: 'fr'},
              )
            : null,
        duty_station: coach?.duty_station,
        postal_box: coach?.postal_box,
      },
      activities: activities[0].rows.raw(),
      competencies,
      answers,
      scores,
      checklist,
      documentations: documentations.reduce(
        (map, answer) => ({...map, [answer.checklist_item_id]: answer}),
        {},
      ),
      notes,
      signatures,
      pdp: saved && {
        ...saved,
        ruleSet,
        diagnostic: JSON.parse(saved.pdp.diagnostic || '[]'),
      },
    };
  },

  // Name of the file, e.g. Fiche_observation_KABEYA_2026-11-18.pdf
  fileName: (kind: ReportKind, data: ReportData) => {
    const teacher = (data.teacher.name.split(' ').pop() || 'enseignant')
      .normalize('NFD')
      .replace(/[^A-Za-z0-9-]/g, '')
      .toUpperCase();
    const day = moment(
      data.session.completed_at || data.session.created_at,
    ).format('YYYY-MM-DD');
    return `${
      kind === 'observation' ? 'Fiche_observation' : 'PDP'
    }_${teacher}_${day}`;
  },

  // Copies the PDF into Downloads/Coach Digital. From Android 10 the file goes through
  // the media store, which needs no permission; before, writing needs the permission.
  download: async (path: string, fileName: string): Promise<void> => {
    if (Platform.OS === 'android' && Platform.Version < 29) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Storage permission denied');
      }
    }
    await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
      {
        name: `${fileName}.pdf`,
        parentFolder: DOWNLOAD_FOLDER,
        mimeType: 'application/pdf',
      },
      'Download',
      path,
    );
  },

  // Opens the PDF with the PDF reader of the phone
  open: (path: string) =>
    ReactNativeBlobUtil.android.actionViewIntent(path, 'application/pdf'),

  // Generates the PDF in the cache of the application and returns its path
  generate: async (kind: ReportKind, data: ReportData): Promise<string> => {
    const fileName = ReportService.fileName(kind, data);
    const {filePath} = await RNHTMLtoPDF.convert({
      html:
        kind === 'observation'
          ? observationReportHtml(data)
          : pdpReportHtml(data),
      fileName,
      ...A4,
    });
    // The library adds a random number to the name: the file is renamed before sharing it
    const path = `${RNFS.CachesDirectoryPath}/${fileName}.pdf`;
    if (await RNFS.exists(path)) {
      await RNFS.unlink(path);
    }
    await RNFS.moveFile(filePath, path);
    return path;
  },
};
