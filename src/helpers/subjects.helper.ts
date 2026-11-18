import {TFunction} from 'i18next';
import {COUNTRY} from '@env';

const SUBJECTS_COUNT: {[country: string]: number} = {cd: 13, np: 9, sl: 10};

// Subjects offered for the teacher and the session, by country (translations teacher.subjects.<country>).
export const getSubjectOptions = (t: TFunction) => {
  const country = SUBJECTS_COUNT[COUNTRY] ? COUNTRY : 'sl';
  return Array.from({length: SUBJECTS_COUNT[country]}, (_, i) =>
    t(`teacher.subjects.${country}.$${i + 1}`),
  );
};
