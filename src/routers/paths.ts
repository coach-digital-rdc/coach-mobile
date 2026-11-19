const PathRoutes = {
  splash: '/',

  language: '/language',

  selectSchool: '/selectSchool',

  selectAccount: '/selectAccount',

  createAccount: '/createAccount',

  accountCreated: '/accountCreated',

  syncDetails: '/syncDetails',

  qrScan: '/qrScan',

  sync: '/sync',

  coachScripts: '/coachScripts',

  settings: {
    main: '/settings',
  },

  login: {
    main: '/login',
    otp: '/login/:id',
    fastLogin: '/fastlogin',
  },

  signup: {
    main: '/signup',
    success: '/signup/success',
  },

  home: {
    main: '/home',
    pendingSessions: '/pendingSessions',
    newSession: '/quickNewSessionScreen',
    stats: '/quickStatsScreen',
  },

  teacher: {
    details: '/teacher/:id/:tabIndex?',
    form: '/teacher/form/:id',
    competenceStats: '/teacher/competences/:competence_index/:id',
  },

  teacherLearningCircles: {
    onboarding: '/teacherlearningcircles/onboarding',
    checkingStats: '/teacherlearningcircles/checkingStats',
    unitSelect: '/teacherlearningcircles/unitSelect',
    introduction: '/teacherlearningcircles/introduction/:unitId',
    situations: '/teacherlearningcircles/situations/:unitId',
    explanation: '/teacherlearningcircles/explanation/:unitId',
    activities: '/teacherlearningcircles/activities/:unitId',
    finish: '/teacherlearningcircles/finish/:unitId',
  },

  communityOfPractice: {
    onboarding: '/communityOfPractice/onboarding',
    checkingStats: '/communityOfPractice/checkingStats',
    insights: '/communityOfPractice/insights',
    positives: '/communityOfPractice/positives',
    improvements: '/communityOfPractice/improvements',
    next_steps: '/communityOfPractice/next_steps',
    finish: '/communityOfPractice/finish',
  },

  classObservation: {
    about: '/classObservation/about/:teacherId',
    onboarding: '/classObservation/onboarding',
    setup: '/classObservation/setup',
    checklist: '/classObservation/checklist',
    notes: '/classObservation/notes',
    pdp: '/classObservation/pdp',
    advice: '/classObservation/advice',
    signatures: '/classObservation/signatures',
    form: '/classObservation/forms',
    completed: '/classObservation/completed/:sessionId',
    report: '/classObservation/report/:sessionId',
  },
};

export default PathRoutes;
