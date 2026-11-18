import {Answer} from './answer';
import {Feedback} from './feedback';

export type Session = {
  id: string;
  _status?: string;

  subject: string;
  objective: string;
  key_points: string;
  lesson_time: string;
  latitude?: number;
  longitude?: number;
  students_count: string;
  coach_id: string;
  school_id: string;
  teacher_id: string;
  feedback_id: string;

  // PREPARATION, OBSERVATION, EVALUATION or COMPLETED (empty for older sessions, considered closed)
  session_status?: string | null;
  // Header of the paper tool
  level?: string | null;
  school_year?: string | null;
  teacher_weekly_load?: number | null;
  last_observation_date?: string | null;
  last_observation_rating?: string | null;
  observer_function?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  advice?: string | null;
  signed_place?: string | null;
  observation_started_at?: string | null;
  observation_ended_at?: string | null;
  completed_at?: string | null;

  feedback?: Feedback;
  answers?: Answer[];

  created_at: Date;
  updated_at: Date;
};
