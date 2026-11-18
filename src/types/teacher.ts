export type Teacher = {
  id: string;

  nin?: string;
  pin?: string;
  name?: string;
  surname?: string;
  subject?: string;
  // F or M
  sex?: string;
  // Weekly teaching load, in hours
  weekly_load?: number | null;
  birthdate?: Date;
  emis_number?: string;

  image_id?: string;
  school_id?: string;
  _status?: string;
  created_at: Date;
  updated_at: Date;
};

export type TeacherItemType = {
  id: string;
  image?: string;
  name: string;
  last_session_date?: Date;
  sessionsCount: number;
  feedbacksCount: number;
};

export type TeacherDetailsType = {
  id: string;
  name: string;
  subject?: string;
  weekly_load?: number | null;
  last_session_date?: string | null;
  image?: string;
};

export type TeacherToEditType = {
  id: string;
  name: string;
  surname: string;
  subject?: string;
  birthdate?: Date;
  pin?: string;
  nin?: string;
  sex?: string;
  weekly_load?: number | null;
  emis_number?: string;
  image_id?: string;
  image_name?: string;
  image_value?: string;
};
