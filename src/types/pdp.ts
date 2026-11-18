// Rules of the diagnostic, in JSON in pdp_rule_set.diagnostic_config
export type DiagnosticConfig = {
  // Answers of each category: YES, NO, LOW, MEDIUM, HIGH
  strength: string[];
  consolidate: string[];
  priority: string[];
  // A sub-domain scored at or below this value has all its non-strong behaviours treated as priorities
  priority_threshold: number;
  // Time given to the teacher to reach the objectives
  due_in_days: number;
};

export type PdpRuleSet = {
  id: string;
  _status?: string;
  version: number;
  status: string;
  diagnostic_config: string | DiagnosticConfig;
  max_objectives: number;
  published_at?: string | null;
};

export type PdpLibraryItem = {
  id: string;
  _status?: string;
  rule_set_id: string;
  question_id: string;
  objective: string;
  // One action per line
  actions: string;
  indicator: string;
};

export type Category = 'STRENGTH' | 'CONSOLIDATE' | 'PRIORITY';

// Category of a behaviour in the diagnostic, kept in JSON in pdp.diagnostic
export type DiagnosticEntry = {
  question_id: string;
  competence_id: string;
  // Answer code: YES, NO, LOW, MEDIUM or HIGH
  answer: string;
  category: Category;
  // 1 weak in a low sub-domain, 2 other weak, 3 medium in a low sub-domain, 4 medium, 9 strong
  rank: number;
  // Score of the sub-domain when it made the behaviour a priority
  low_score?: number;
};

export type Pdp = {
  id: string;
  _status?: string;
  session_id: string;
  rule_set_id: string;
  rule_set_version: number;
  diagnostic: string;
  // DRAFT then VALIDATED
  status: string;
  validated_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PdpObjective = {
  id: string;
  _status?: string;
  pdp_id: string;
  // Behaviour concerned; empty for an objective added freely
  question_id?: string | null;
  category: 'PRIORITY' | 'CONSOLIDATE';
  rank: number;
  objective: string;
  actions: string;
  indicator: string;
  // YYYY-MM-DD
  due_date: string;
  // GENERATED, EDITED or ADDED
  origin: 'GENERATED' | 'EDITED' | 'ADDED';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
};
