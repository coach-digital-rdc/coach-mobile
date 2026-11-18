import PathRoutes from '../routers/paths';
import {Session} from '../types/session';

// Screen where an open session is resumed, according to its step (B10)
export const getResumeRoute = (session: Session) => {
  const state = {session: {id: session.id, teacher_id: session.teacher_id}};
  switch (session.session_status) {
    case 'PREPARATION':
      return {path: PathRoutes.classObservation.checklist, state};
    case 'EVALUATION':
      return {path: PathRoutes.classObservation.form, state};
    default:
      return {path: PathRoutes.classObservation.notes, state};
  }
};
