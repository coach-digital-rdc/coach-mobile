export type SignerRole = 'TEACHER' | 'SCHOOL_HEAD' | 'OBSERVER';

// Signature of the observation sheet (B17)
export type SessionSignature = {
  id: string;
  _status?: string;

  session_id: string;
  signer_role: SignerRole;
  signer_name?: string | null;
  // Drawing of the signature, as an SVG image in the image table
  image_id?: string | null;
  signed_at?: string | null;
  // Teacher only: reason for refusing to sign
  refusal_reason?: string | null;
  // School head only: reason for the absence
  absence_reason?: string | null;

  created_at?: string;
  updated_at?: string;
};
