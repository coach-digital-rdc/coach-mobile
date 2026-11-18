import moment from 'moment';
import {v4 as uuid} from 'uuid';
import {Competence} from '../types/competence';
import {Question} from '../types/question';
import {
  DiagnosticConfig,
  DiagnosticEntry,
  PdpLibraryItem,
  PdpObjective,
  PdpRuleSet,
} from '../types/pdp';
import {NOT_APPLICABLE} from './answer.helper';

export const getDiagnosticConfig = (ruleSet: PdpRuleSet): DiagnosticConfig =>
  typeof ruleSet.diagnostic_config === 'string'
    ? JSON.parse(ruleSet.diagnostic_config)
    : ruleSet.diagnostic_config;

// Code of an answer of the grid, as used by the rules
export const getAnswerCode = (question: Question, value?: number) => {
  if (value === undefined || value === null || value === NOT_APPLICABLE) {
    return undefined;
  }
  if (question.type === 'YES_NO') {
    return Number(value) === 1 ? 'YES' : 'NO';
  }
  return ['LOW', 'MEDIUM', 'HIGH'][Number(value) - 1];
};

// Applies the rules to a scored session (B18): one entry per behaviour (N/A excluded),
// ordered by priority.
export const diagnose = (
  competencies: Competence[],
  answers: {[questionId: string]: number},
  scores: {[competenceId: string]: number | undefined},
  config: DiagnosticConfig,
): DiagnosticEntry[] => {
  const entries: DiagnosticEntry[] = [];
  for (const competence of competencies) {
    const score = scores[competence.id];
    const belowThreshold =
      score !== undefined && score <= config.priority_threshold;
    for (const question of competence.questions) {
      const answer = getAnswerCode(question, answers[question.id]);
      if (!answer) {
        continue;
      }
      const strong = config.strength.includes(answer);
      const weak = config.priority.includes(answer);
      let category: DiagnosticEntry['category'] = strong
        ? 'STRENGTH'
        : weak
        ? 'PRIORITY'
        : 'CONSOLIDATE';
      let rank = strong ? 9 : weak ? 2 : 4;
      const entry: DiagnosticEntry = {
        question_id: question.id,
        competence_id: competence.id,
        answer,
        category,
        rank,
      };
      if (belowThreshold && !strong) {
        entry.category = 'PRIORITY';
        entry.rank = rank - 1;
        entry.low_score = score;
      }
      entries.push(entry);
    }
  }
  // Stable order: by rank, then in the order of the grid
  return entries
    .map((entry, index) => ({entry, index}))
    .sort((a, b) => a.entry.rank - b.entry.rank || a.index - b.index)
    .map(({entry}) => entry);
};

export const getDueDate = (config: DiagnosticConfig) =>
  moment()
    .add(config.due_in_days || 42, 'days')
    .format('YYYY-MM-DD');

export const toObjective = (
  entry: DiagnosticEntry,
  library: {[questionId: string]: PdpLibraryItem},
  pdpId: string,
  rank: number,
  dueDate: string,
): PdpObjective => {
  const item = library[entry.question_id];
  return {
    id: uuid(),
    pdp_id: pdpId,
    question_id: entry.question_id,
    category: entry.category === 'PRIORITY' ? 'PRIORITY' : 'CONSOLIDATE',
    rank,
    objective: item?.objective || '',
    actions: item?.actions || '',
    indicator: item?.indicator || '',
    due_date: dueDate,
    origin: 'GENERATED',
  };
};

// The draft PDP (B23): the first objectives of the diagnostic, up to the maximum set by the rules
export const generateObjectives = (
  diagnostic: DiagnosticEntry[],
  library: {[questionId: string]: PdpLibraryItem},
  ruleSet: PdpRuleSet,
  pdpId: string,
): PdpObjective[] => {
  const dueDate = getDueDate(getDiagnosticConfig(ruleSet));
  return diagnostic
    .filter(entry => entry.category !== 'STRENGTH')
    .slice(0, ruleSet.max_objectives)
    .map((entry, index) =>
      toObjective(entry, library, pdpId, index + 1, dueDate),
    );
};
