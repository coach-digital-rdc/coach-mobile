import {Answer} from './answer';

export type Question = {
  id: string;
  title: string;
  scale: number;
  description: string;
  tooltip_data: string;
  competence_id: string;
  // option (stars), YES_NO or FME (Faible/Moyen/Élevé)
  type?: string;
  // Behaviour number in the paper tool (1.1, 2.1.3...)
  code?: string | null;
  display_order?: number | null;
  allow_na?: boolean | number;

  answers?: Answer[];
};
