// Timestamped note taken during the observation (B13).
export type ObservationNote = {
  id: string;
  _status?: string;

  session_id: string;
  // Time of the device when the note was written
  noted_at: string;
  content: string;

  created_at?: string;
  updated_at?: string;
  // Deleted notes are kept until the next sync
  deleted_at?: string | null;
};
