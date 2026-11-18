import {Answer} from './answer';
import {Question} from './question';

export type Competence = {
  id: string;
  title: string;
  // Sub-domain number in the paper tool (I, II.1...) and its domain
  code?: string | null;
  domain_code?: string | null;
  domain_title?: string | null;
  display_order?: number | null;
  has_global_score?: boolean;
  questions: Question[];
};

export type CompetenceAnalytics = {
  id: string;
  title: string;
  questionsScale: number;
  sumAnswers: number;
  totalQuestions: number;
};

export type CompetenceAnswers = {
  id: string;
  title: string;
  answers: Answer[];
};
