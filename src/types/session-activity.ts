// Observed activity of the paper tool ("Activité(s) observée(s)"): one per session in this version.
export type SessionActivity = {
  id: string;
  _status?: string;

  session_id: string;
  // Sub-domain of the curriculum (e.g. Mathématiques), not of the observation grid
  sub_domain?: string | null;
  discipline?: string | null;
  sheet_code?: string | null;
  class_name?: string | null;
  // "P/I" column of the paper tool
  p_i?: string | null;
  time?: string | null;
  essential_knowledge?: string | null;
  display_order?: number | null;

  created_at?: Date;
  updated_at?: Date;
};
