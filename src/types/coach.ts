import {CoachSchool} from './coach_school';
import {Session} from './session';

export type Coach = {
  id: string;

  name?: string;
  surname?: string;
  nin?: string;
  pin?: string;
  birthdate?: Date;
  phone?: string;
  email?: string;

  image_id?: string;

  // Profile of the observer (B21)
  sex?: string | null;
  // INSPECTOR, ADVISOR, SCHOOL_HEAD or PEER
  function?: string | null;
  // Duty station, or area of intervention of an inspector or an advisor
  duty_station?: string | null;
  postal_box?: string | null;

  sessions?: Session[];
  coachSchools?: CoachSchool[];

  _status?: string;
  created_at: Date;
  updated_at: Date;

  sessionCount?: number;
};
