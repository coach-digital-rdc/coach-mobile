// Document of the checklist of the paper tool (annex B), e.g. "Journal de classe".
export type ChecklistItem = {
  id: string;
  _status?: string;

  code: number;
  // TEACHER (documents of the teacher) or LEARNER (documents of the learners)
  owner: string;
  document_name: string;
  statement: string;
  display_order: number;
};

// Answer of the checklist for one document of a session.
export type Documentation = {
  id: string;
  _status?: string;

  session_id: string;
  checklist_item_id: string;
  // 1 = Oui, 0 = Non, empty = not checked yet
  answer?: number | boolean | null;
  // Proposal of the observer when the answer is Non
  proposal?: string | null;
  // PREPARATION (before the observation) or EVALUATION (after)
  filled_in_phase?: string | null;

  created_at?: Date;
  updated_at?: Date;
};
