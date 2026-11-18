// Global score of a sub-domain for a session (B15).
export type CompetenceScore = {
  id: string;
  _status?: string;

  session_id: string;
  competence_id: string;
  // Score suggested by the application from the behaviours of the sub-domain
  suggested_value?: number | null;
  // Score chosen by the observer; empty while the suggestion is kept
  value?: number | null;

  created_at?: string;
  updated_at?: string;
};
