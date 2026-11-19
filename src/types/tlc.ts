// Learning circle run with the teachers of a school (B22)
export type TLC = {
  id: string;
  _status?: string;
  unit_id: string;
  coach_id: string;
  school_id?: string | null;
  // Rating of the participation, from 1 to 5
  evaluation: string;
  // Names of the teachers who took part, in JSON
  participants?: string | null;
  participants_count?: number | null;
};
