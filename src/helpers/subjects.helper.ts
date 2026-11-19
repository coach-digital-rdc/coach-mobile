import {TFunction} from 'i18next';

const SUBJECTS_COUNT = 13;

// Subjects of the secondary school offered for the teacher and the session (translations teacher.subjects.cd).
export const getSubjectOptions = (t: TFunction) =>
  Array.from({length: SUBJECTS_COUNT}, (_, i) =>
    t(`teacher.subjects.cd.$${i + 1}`),
  );
