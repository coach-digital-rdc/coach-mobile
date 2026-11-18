import {Feedback} from './feedback';
import {Question} from './question';

export type Answer = {
  id: string;

  // Empty when not_applicable is set ("N/A")
  value: string | null;
  not_applicable?: boolean | number;
  question_id: string;
  session_id: string;

  question?: Question;
  feedback?: Feedback[];

  _status?: string;
  created_at: Date;
  updated_at: Date;
};
