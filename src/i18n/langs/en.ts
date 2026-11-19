const enTranslation = {
  errors: {requiredField: 'This field is required.'},
  answer: {
    yes: 'Yes',
    no: 'No',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    na: 'N/A',
  },
  splash: {
    tagline: 'Classroom practice observation',
    version: 'Version {{value}}',
  },
  observer: {
    function: {
      INSPECTOR: 'Inspector',
      ADVISOR: 'Pedagogical advisor',
      SCHOOL_HEAD: 'School head',
      PEER: 'Peer (teacher)',
    },
    scope: {
      INSPECTOR: 'Schools of your area of intervention',
      ADVISOR: 'Schools of your area of intervention',
      SCHOOL_HEAD: 'School you are in charge of',
      PEER: 'School you are attached to',
    },
  },
  language: {
    hint: 'The language can be changed at any time in the settings.',
    continue: 'Continue',
  },
  common: {
    cancel: 'Cancel',
    save: 'Save',
    'load-more': 'Load more',
    optional: 'Optional',
    search: 'Search',
    'image-view': 'Image view',
    'image-picker': {
      'upload-image-modal-title': 'Upload as image',
      'upload-image-modal-description':
        'Choose the way you want do send the picture',
      'upload-image-modal-option-title': 'Upload options',
      'upload-image-modal-option-description':
        'Choose the way you want to send the picture of your annotations',
      'take-photo-button': 'Take photo',
      'photo-gallery-button': 'Photo gallery',
    },
  },
  bottom_navigator: {
    home: 'Home',
    tlc: 'TLC',
    pending: 'Pending',
    cop: 'COP',
    settings: 'Settings',
  },
  components: {
    starRating: {low: 'Low', mid: 'Mid', high: 'High'},
    starsTag: {
      notEvaluted: 'Poor',
      needsWork: 'Needs work',
      needsAttention: 'Needs attention',
      almostThere: 'Almost there',
      doingGreat: 'Doing great',
    },
  },
  aboutScan: {
    title: 'Scan the QR Code',
    description:
      "Scan the QR code in the Coach's Manual to setup your School information in the app",
    scan: 'Scan QR Code',
  },
  login: {
    main: {
      welcome: 'Welcome!',
      tagline: 'Classroom observation',
      subtitle:
        'Sign in with the email address or phone number of your account.',
      user_id: 'User ID',
      user_id_placeholder: 'Email ID or Phone number',
      error:
        'User not found. Try logging in using phone number or create an account.',
      button: 'Login',
      create_account: "Don't have an account? ",
      create_account_button: 'Register now',
    },
    otp: {
      header: 'Verification',
      heading: 'Verification code',
      title: 'Enter the 6-digit code sent to',
      error: 'Incorrect code. Please try again.',
      button: 'Verify',
      not_receive_code: "Didn't receive a verification code?",
      resend_code: 'Resend code',
      change_email: 'Change email',
    },
    fastlogin: {
      welcome: 'Welcome back!',
      title: 'You were previously logged in as',
      button: 'Login as',
      change_coach_button: 'Change coach',
    },
    createAccount: {
      heading: 'Observer account',
      subtitle:
        'This information is shown in the header of each observation sheet.',
      sex: 'Sex',
      function: 'Function',
      zone: 'Area of intervention',
      'zone-placeholder': 'e.g. Kinshasa-Lukunga education province',
      'duty-station': 'Duty station',
      'duty-station-placeholder': 'e.g. Bon Espoir secondary school',
      'postal-box': 'Postal box',
      error:
        'The account could not be created. Check the connection and the e-mail address.',
      title: 'New account',
      takePhoto: 'Take/Choose photo',
      name: 'First name',
      surname: 'Last name',
      pin: 'PIN',
      pin_description: 'Personal Identification Number',
      nin: 'NIN',
      email: 'Email',
      phone: 'Phone',
      birthdate: "Coach's date of birth",
      nin_description: 'National Identification Number',
      'create-account-button': 'Create account',
      success: 'Account created successfully',
    },
    accountCreated: {
      title: 'Account created',
      subtitle: 'Now you can use your account to log in to this device',
    },
  },
  signup: {
    success: {
      title: 'Profile created',
      subtitle:
        'Now you can register your school and start coaching the teachers',
      button: 'Go to school selection',
    },
  },
  logout: {
    title: 'Are you sure you want to sign out?',
    'confirm-button': 'Yes',
    'cancel-button': 'Cancel',
  },
  settings: {
    title: 'Settings',
    logout: 'Sign out',
    'logout-description': 'Start from the beginning ',
    language: 'Language',
    lastSync: 'Last sync: {{value}}',
    'never-synced': 'no sync',
    'try-sync': 'Try sync',
    appVersion: 'App version',
    'unsynced-items': 'Unsynchronized items',
    'unsynced-teacher': 'Teachers:',
    'unsynced-session': 'Sessions:',
    'unsynced-feedback': 'Feedback:',
    'sync-error-title': 'Unable to synchronize data',
    'sync-error-description': 'Check your connection and try again',
    changeLanguage: {title: 'Select language', button: 'Next'},
  },
  coachSelect: {
    title: 'Select your profile',
    'new-profile': 'Create new profile',
    'item-description_interval':
      '(0)[No sessions here];(1)[1 session here];(2-inf)[{{count}} sessions here];',
    'item-description-empty': 'No profiles here',
  },
  schoolSelect: {
    header: 'School',
    title: 'Select the school',
    subtitle:
      'Choose the school where you observe, or add it by scanning its QR code.',
    'qr-title': "Scan the school's QR code",
    'qr-hint': 'The code is on the sheet provided by the administration',
    search: 'Search a school',
    empty: 'No school found.',
    'item-description_interval':
      '(0)[No teachers here];(1)[1 teacher here];(2-inf)[{{count}} teachers here];',
  },
  syncDetails: {
    preparing: 'Preparing the device',
    downloading: 'Downloading the data of {{school}}…',
    title: 'Setup complete',
    description:
      'The device can now be used without connection. Data downloaded:',
    offline:
      'No connection: the device uses the data already present. Synchronise as soon as possible.',
    teachers_interval:
      '(0-1)[{{count}} teacher of the school];(2-inf)[{{count}} teachers of the school];',
    grid: 'DRC observation grid: {{competencies}} sub-domains, {{questions}} behaviours',
    checklist: 'Document checklist: {{count}} documents',
    rules: 'PDP rules, version {{version}}',
    manual: 'User manual (available offline)',
    start: 'Start',
  },
  qrScan: {
    title: 'Scan the QR code',
    hint: 'Place the QR code in the frame',
    found: 'Code recognised',
    invalid: 'This QR code is not the one of a school',
    permission: 'Allow access to the camera to scan the QR code.',
    confirm: 'Confirm the school',
    list: 'Choose from the list',
  },
  home: {
    salutation: 'Hi',
    tiles: {
      'new-observation': 'New observation',
      'in-progress': 'Sessions in progress',
      manual: 'Manual',
      tlc: 'Learning circles',
      cop: 'Community of practice',
      sync: 'Synchronisation',
    },
    sync: {
      done: 'Synced {{date}}',
      never: 'Not synced yet',
      pending_interval:
        '(1)[1 item to synchronise];(2-inf)[{{count}} items to synchronise];',
    },
    teachersLength_interval: 'Coaching in:',
    'menu-items': {
      newSession: 'Start a new session',
      switchSchools: 'Switch schools',
      switchCoach: 'Switch coaches',
      coachScript: 'Coach script',
      pendingSession: 'Pending Sessions',
      switchProfile: 'Switch to a different coach profile',
      startOver: 'Sign out',
      statics: 'Statistics',
    },
    teachers: {
      title: 'Teachers',
      addNew: 'Add new teacher',
      'no-session': 'No sessions yet. Start coaching!',
      'last-session': 'Updated {{date}}',
      session_interval: '(1)[1 Observation];(2-inf)[{{count}} Observations];',
      teachers_count: 'Teachers in this school:',
      section: 'Teachers ({{count}})',
      add: 'Add',
      search: 'Search a teacher',
      'last-observation': 'last on {{date}}',
      'no-observation': 'no observation yet',
    },
    emptyState: {
      title: 'No teacher registered',
      description: 'Add a new teacher to start coaching',
    },
    newSession: {
      title: 'Start new session',
      subtitle: 'Select a teacher and start a new observation session',
    },
    stats: {
      page_title: 'Statistics',
      title: 'Check teacher stats',
      tabs: {
        available: 'Available statistics',
        unavailable: 'Unavailable statistics',
      },
      empty: {
        title: 'No teacher registered',
        subtitle:
          'Add a new teacher and complete 3 coaching sessions to view statistics',
      },
      available: {
        title: 'Available statistics',
        subtitle:
          'Select a teacher to view their evolution through the coaching sessions',
        empty: {
          title: 'No statistics available',
          subtitle:
            "Each teacher's statistics becomes available after three coaching sessions.",
        },
      },
      unavailable: {
        title: 'Unavailable statistics',
        subtitle:
          'You need at least 3 coaching sessions completed with those teachers to see the statistics.',
        empty: {
          title: 'All statistics are available',
          subtitle:
            'You need at least 3 coaching sessions completed with those teachers to see the statistics.',
        },
        label: '{{value}} Additional coaching sessions required',
      },
    },
    pending: {
      page_title: 'Sessions in progress',
      title: 'Sessions in progress',
      subtitle:
        'Sessions started and not closed. They are kept on the device, even without connection.',
      list_subtitle: 'Coaching session pending',
      empty: 'Start an observation to see it here.',
      started_interval:
        '(0-1)[Started on {{date}} · {{count}} note];(2-inf)[Started on {{date}} · {{count}} notes];',
      status: {
        PREPARATION: 'Preparation',
        OBSERVATION: 'Observation',
        EVALUATION: 'Evaluation',
      },
    },
  },
  teacher: {
    form: {
      name: 'First name',
      'name-placeholder': 'e.g. Daniel',
      'surname-placeholder': 'e.g. MUKENDI',
      'heading-new': 'Add a teacher',
      subtitle:
        'The teacher is saved on the device, then sent to the server at the next synchronisation.',
      sex: 'Sex',
      female: 'Female',
      male: 'Male',
      'weekly-load': 'Weekly load (h)',
      birthdate: "Teacher's date of birth",
      birthdate_title: 'Select a date',
      birthdate_confirm: 'Confirm',
      birthdate_cancel: 'Cancel',
      teacher_code: 'Teacher code',
      teacher_code_description: 'Code of the teacher',
      matricule: 'Registration number',
      matricule_description: 'Teacher registration number (matricule)',
      surname: 'Last name',
      'title-new': 'New teacher',
      'title-edit': 'Edit teacher',
      subject: 'Principal subject',
      'new-teacher-button': 'Add teacher',
      'update-teacher-button': 'Edit teacher',
      success: 'Teacher created successfully',
      success_update: 'Teacher updated successfully',
      pin: 'PIN',
      pin_description: 'Personal Identification Number',
      nin: 'NIN',
      nin_description: 'National Identification Number',
    },
    details: {
      title: 'Teacher',
      'new-observation': 'New observation',
      'resume-observation': 'Resume the observation',
      subject: 'Principal Subject',
      school: 'School',
      editTeacher: 'Edit teacher',
      description: '{{subject}} teacher at {{school}}',
    },
    tabs: {
      session: {
        title: 'Observations',
        'observation-of': 'Observation of {{date}}',
        'in-progress': 'In progress',
        closed: 'Closed',
        session: 'Observation session',
        newClassObservation: 'New class observation',
        stillNoSession: 'There are no observation sessions recorded',
        stillNoSessionDescription:
          'You may start a new class observation with this teacher',
        selectCoach: 'Select coaching session',
        viewSummary:
          'You may view the summary of the observation or the feedback you provided to the teacher',
      },
      stats: {
        title: "Teacher's stats",
        'evolution-tab': 'Evolution',
        overallRating: 'Overall rating',
        currentRating: 'The current rating is:',
        ratingAverage:
          'This rating is the average of all 5 Teaching Practices in the last observation',
        evolution:
          'This rating is the average of all 5 Teaching Practices in the last observation',
        comparision: "Changes in the teacher's ratings over coaching sessions",
        lastSession: 'since last session',
        seeDetails: 'See details',
        button: 'New class observation',
        empty: {
          title: 'No data are available to show now',
          subtitle:
            'Complete at least three class observations with feedback sessions to show statistics',
          button: 'New class observation',
        },
        ratingPerSession: 'Rating per session',
        teacherComparision:
          "Changes in the teacher's ratings over coaching sessions",
        sessionName: 'Session {{value}}',
        teacherAt: 'Teacher at {{school}}',
      },
    },
    subjects: {
      cd: {
        $1: 'French',
        $2: 'English',
        $3: 'Mathematics',
        $4: 'Physics',
        $5: 'Chemistry',
        $6: 'Biology',
        $7: 'History',
        $8: 'Geography',
        $9: 'Civic and Moral Education',
        $10: 'Religion',
        $11: 'Computer Science',
        $12: 'Physical Education and Sports',
        $13: 'Other',
      },
    },
  },
  classObservation: {
    title: 'Class observation',
    phases: {
      preparation: 'Preparation',
      observation: 'Observation',
      evaluation: 'Evaluation',
      closing: 'Closing',
    },
    about: {
      title: 'Session flow',
      subtitle:
        'The observation has four steps. Each step must be finished before moving to the next one.',
      steps: {
        preparation:
          'Talk with the teacher before the lesson, fill in the header of the sheet and, if possible, the document checklist.',
        observation:
          'Sit at the back of the class and note what you observe during the lesson.',
        evaluation:
          'Rate the 30 behaviours, then agree on the development plan with the teacher.',
        closing:
          'Add your advice and collect the signatures: the sheet is then locked and ready to be synchronised.',
      },
      'start-button': 'Start preparation',
      step1: {
        title: 'Preparation',
        subtitle: '5 minutes',
        description:
          'Talk to the teacher before the class and review your notes on previous visits if you already had a coach observation before.',
      },
      step2: {
        title: 'Classroom observation',
        subtitle: '30-45 minutes',
        description:
          'Sit at the back of the class to take notes and remember to put your phone in silent mode.',
      },
      step3: {
        title: 'Coaching conversation',
        subtitle: '20-30 minutes',
        description:
          'Present your observations to the teacher, pointing out the positive aspects and areas of improvement for their class teaching.',
      },
      step4: {
        title: 'Next steps',
        subtitle: '5 minutes',
        description:
          'After agreeing with the teacher about priority next steps for improvement, schedule your next visit.',
      },
    },
    report: {
      title: 'PDF documents',
      observation: 'Observation sheet',
      pdp: 'PDP (coaching report)',
      share: 'Share',
      download: 'Download',
      downloaded: 'Document saved',
      'downloaded-detail':
        'Downloads › Coach Digital › {{file}}. Tap this message to open it.',
      'download-error': 'The document could not be saved',
      generating: 'Preparing the document…',
      error:
        'The document could not be generated. Try again from the closed session screen.',
    },
    signatures: {
      title: 'Signatures',
      subtitle:
        'Each signer signs with the finger. The teacher may refuse to sign and give the reason; only the school head may be absent.',
      role: {
        TEACHER: 'Teacher',
        SCHOOL_HEAD: 'School head',
        OBSERVER: 'Observer',
      },
      name: 'Name',
      'sign-here': 'Tap to sign',
      sign: 'Sign',
      validate: 'Confirm the signature',
      clear: 'Clear',
      refuses: 'Refuses to sign',
      refusal: 'Reason for refusing to sign',
      'refusal-placeholder':
        'e.g. the teacher disputes the score of sub-domain III.1',
      absent: 'Absent',
      absence: 'Reason for the absence',
      'absence-placeholder': 'e.g. at a meeting at the sub-division',
      'observer-is-head':
        'You are the school head: your observer signature stands for this box.',
      'before-closing': 'Before closing',
      'condition-scoring':
        'Scoring complete ({{answered}}/{{total}} behaviours, {{scored}}/{{scoreTotal}} scores)',
      'condition-pdp': 'PDP validated with the teacher',
      'condition-signatures':
        'Signatures of the teacher, the school head and the observer',
      close: 'Close the session',
      'close-title': 'Close the session?',
      'close-message':
        'Once closed, the sheet can no longer be changed. It will be sent to the server at the next synchronisation.',
      'close-confirm': 'Close',
    },
    advice: {
      title: 'Advice and times',
      subtitle:
        'The times are taken from the observation; correct them if needed.',
      'start-time': 'Start of the sequence',
      'end-time': 'End of the sequence',
      advice: 'Advice to the teacher',
      'advice-placeholder':
        'Strengths to keep, practical advice for the next sequence…',
      place: 'Done at',
      'place-placeholder': 'e.g. Kinshasa',
      date: 'On',
      button: 'Go to the signatures',
    },
    pdp: {
      title: 'Development plan',
      heading: 'Professional development plan',
      subtitle:
        'Draft set up from the scoring, with the PDP rules version {{version}} (published on {{date}}). Adjust it with the teacher, then validate it.',
      'missing-rules':
        'The PDP rules are not on the device yet. Synchronise the application, then come back to this step.',
      summary: 'Scoring summary',
      'read-only': 'Read-only',
      'score-note': 'suggested score {{suggested}}, entered {{score}}',
      diagnostic: 'Diagnostic',
      group: {
        STRENGTH: 'Strengths',
        CONSOLIDATE: 'Areas to consolidate',
        PRIORITY: 'Priority areas',
      },
      category: {
        STRENGTH: 'Strength',
        CONSOLIDATE: 'To consolidate',
        PRIORITY: 'Priority',
      },
      origin: {GENERATED: 'Generated', EDITED: 'Edited', ADDED: 'Added'},
      answer: {
        YES: 'Yes',
        NO: 'No',
        LOW: 'Low',
        MEDIUM: 'Medium',
        HIGH: 'High',
        NA: 'N/A',
      },
      short: {YES: 'Y', NO: 'N', LOW: 'L', MEDIUM: 'M', HIGH: 'H', NA: '–'},
      reason: 'Scored {{answer}}',
      'reason-score': '; sub-domain {{code}} scored {{score}}/5',
      objectives: 'Objectives of the plan ({{count}}/{{max}})',
      regenerate: 'Regenerate',
      validated: 'Validated',
      up: 'Move up',
      down: 'Move down',
      edit: 'Edit',
      remove: 'Remove',
      objective: 'Objective',
      actions: 'Actions',
      'actions-input': 'Actions (one per line)',
      indicator: 'Follow-up indicator',
      'due-date': 'Due date',
      'due-date-input': 'Due date (YYYY-MM-DD)',
      'to-fill': 'To be filled in',
      done: 'Done',
      add: 'Add an objective',
      free: 'Free objective',
      max: 'Maximum of {{max}} objectives reached',
      editable: 'Draft can be changed until it is validated',
      'validated-at': 'PDP validated with the teacher at {{time}}',
      'back-to-scoring': 'Scoring',
      validate: 'Validate the PDP',
      'validate-title': 'Validate the PDP?',
      'validate-message_interval':
        '(1)[The plan has 1 objective. Once validated with the teacher, it can no longer be changed.];(2-inf)[The plan has {{count}} objectives. Once validated with the teacher, it can no longer be changed.];',
      'validate-confirm': 'Validate',
      continue: 'Continue',
    },
    notes: {
      title: 'Chronological notes',
      subtitle:
        'Write down the facts observed during the sequence. Each note is timestamped automatically.',
      'subtitle-read-only':
        'The notes are read-only. They remain visible during the scoring.',
      running: 'Observation in progress since {{time}}',
      ended: 'Observation ended at {{time}}',
      count_interval: '(0-1)[note];(2-inf)[notes];',
      'count-label_interval': '(0-1)[{{count}} note];(2-inf)[{{count}} notes];',
      empty: 'No note yet.',
      placeholder: 'Describe what you observe…',
      add: 'Add the note',
      edit: 'Edit the note',
      delete: 'Delete the note',
      locked: 'The scoring is locked until a note is saved',
      'unlock-at-end': 'The scoring can start at the end of the observation',
      unlocked: 'Scoring unlocked',
      end: 'End the observation',
      'end-title': 'End the observation?',
      'end-message_interval':
        '(1)[You saved 1 note. After the end of the observation, the notes can no longer be changed and the scoring will be unlocked.];(2-inf)[You saved {{count}} notes. After the end of the observation, the notes can no longer be changed and the scoring will be unlocked.];',
      'end-confirm': 'End',
      'go-to-scoring': 'Go to the scoring',
    },
    checklist: {
      title: 'Document checklist',
      'subtitle-before':
        'Check that the documents of the teacher and of the learners are available. What cannot be checked now can be checked after the observation. The checklist is not part of the rating.',
      'subtitle-after':
        'Complete the documents that could not be checked before the observation. The checklist is not part of the rating.',
      'subtitle-observing':
        'The observation is in progress: the checklist can be completed after the observation.',
      'teacher-documents': 'Documents of the teacher',
      'learner-documents': 'Documents of the learners',
      before: 'Before the observation',
      after: 'After the observation',
      proposal: 'Proposal of the observer',
      'proposal-placeholder': 'E.g. update the document every week',
      status: '{{count}}/{{total}} documents checked',
      'status-later_interval':
        '(1)[ · the last one will be completed after the observation];(2-inf)[ · the remaining {{count}} will be completed after the observation];',
      'status-left': ' · {{count}} left',
      start: 'Start the observation',
      save: 'Save the checklist',
      'back-to-observation': 'Back to the observation',
      reminder_interval:
        '(1)[Checklist: 1 document not checked (optional)];(2-inf)[Checklist: {{count}} documents not checked (optional)];',
      complete: 'Complete',
    },
    setup: {
      title: 'Header of the sheet',
      subtitle:
        'Known information is filled in automatically: check it and complete the rest.',
      button: 'Save and continue',
      observer: 'Observer',
      profile: 'Profile',
      name: 'Name',
      contact: 'Contact',
      session: 'Session',
      school: 'School',
      teacher: 'Teacher',
      'last-observation': 'Last observation',
      none: 'None',
      level: 'Level',
      secondary: 'Secondary',
      disciplines: 'Subject(s)',
      'weekly-load': 'Weekly load (h)',
      'school-year': 'School year',
      activity: 'Observed activity',
      'sub-domain': 'Sub-domain',
      'sub-domain-placeholder': 'e.g. Mathematics',
      discipline: 'Subject',
      'sheet-code': 'Sheet no. / matrix code',
      'class-name': 'Class',
      'p-i': 'P/I',
      time: 'Time',
      'essential-knowledge': 'Essential knowledge / lesson topic',
      missing:
        'Fill in the subject of the session and of the observed activity',
      questions: {
        $0: {title: 'Classroom consists of', placeholder: 'Both'},
        $1: {
          title: 'How many students are in the class?',
          placeholder: 'e.g. 7',
          options: {
            $1: 'Both boys and girls',
            $2: 'Only boys',
            $3: 'Only girls',
          },
          counters: {
            $1: '1 - 10',
            $2: '10 - 30',
            $3: '30 - 60',
            $4: '60+',
          },
        },
        $2: {title: 'What is the subject?', placeholder: 'Math'},
        $3: {
          title: 'How long will the lesson last?',
          placeholder: '30 min',
          options: {
            $1: '25 mins',
            $2: '30 mins',
            $3: '35 mins',
            $4: '40 mins',
            $5: '45 mins',
            $6: '50 mins',
            $7: '55 mins',
            $8: '60 mins',
          },
        },

        $4: {
          title: 'What are the objectives of the lesson?',
          placeholder: "Teacher's description of what is to be taught",
        },
      },
    },
    form: {
      title: 'Scoring',
      subtitle:
        'Score each behaviour from your notes. Use N/A when the behaviour could not be observed.',
      notes: 'Notes ({{count}})',
      'notes-title': 'Observation notes',
      checklist: 'Checklist ({{count}}/15)',
      help: 'Scoring help',
      'global-score': 'Global score of the sub-domain',
      'suggested-later': 'suggested once the behaviours are scored',
      suggested: 'Suggested',
      changed: 'Changed · suggested {{value}}',
      progress:
        '{{answered}}/{{total}} behaviours scored · {{scored}}/{{scoreTotal}} global scores',
      button: 'End the scoring',
      'locked-title': 'Scoring locked',
      'locked-end': 'End the observation to start the scoring.',
      'go-to-notes': 'Go to the notes',
    },
    formConfirmation: {
      button: 'Confirm',
      buttonEdit: 'Edit',
      competenceView: {
        title: 'Class observation summary',
        subtitle: 'Review your class observation',
        overallRating: 'Overall observation rating',
      },
    },
    observationCompleted: {
      title: 'Session closed',
      'closed-at': 'Closed on {{date}} at {{time}}.',
      teacher: 'Teacher',
      observation: 'Observation',
      duration: '{{minutes}} min',
      pdp: 'PDP',
      'pdp-summary': '{{count}} objectives',
      'pdp-validated': ', validated',
      sync: 'Synchronisation',
      synced: 'Synchronised',
      pending: 'Pending',
      pdf: 'See the PDF documents',
      subtitle: 'Thank you. The class observation section is complete!',
      whatsNext: "What's next?",
      startFeedback:
        'You may start entering your feedback to the teacher now or you can go back to the home screen and do it later by selecting the teacher profile',
      button: 'Provide feedback',
      buttonBack: 'Return to home screen',
    },
  },
  feedback: {
    mentoringSection: {
      title: 'Best practices',
      subtitle:
        'Remember the good practices from your training and put them in practice.',
      bestPratices:
        'If you do not recall the best practices, refer to the Coach manual',
      continueButton: 'Continue to feedback session',
      trainingButton: 'Access Coach manual',
    },
    preparation: {
      title: 'Choose teaching practices',
      subtitle: 'Choose 1 teaching practice to work on with the teacher',
      teachingPratice: 'Teaching practice {{index}}',
      button: 'Complete coaching session',
    },
    form: {
      title: 'Agree on actions',
      subtitle:
        'Agree with the teacher which actions they will take to improve this teaching practice',
      actionsToImprove: 'Actions for improvement',
      describeActions:
        'Describe the actions you and the teacher agreed they will take to improve in regard to this teaching practice',
      textAreaPlaceholder:
        'e.g., become more aware of the way they speak with students',
      uploadImage: 'Upload an image',
      sendPicture:
        'You may also send a picture of the notes you took during the class observation and coaching session or any other interesting documentation from your observation',
      uploadPhoto: 'Upload a photo',
      button: 'Complete coach session',
    },
    completed: {
      title: 'Coaching session complete',
      subtitle: 'Thank you! You just completed the coaching process.',
      aboutNext: "What's next?",
      aboutNextDescription:
        'Stay prepared for Teaching Learning Circles, until then you may create new observations with a teacher by returning to the home screen and selecting a new teacher',
      button: 'Return to home screen',
    },
  },
  cop: {
    onboarding: {
      page_title: 'Community of Practice',
      title: 'Getting started',
      subtitle:
        'The CoP is the third step of Coach. It is conducted by the Head Teacher and can be supported by Lead Teachers. ',
      description:
        'Check out the Community of Practice (CoP) steps and start a new session:',
      button: 'Start Community of Practice',

      process: {
        $1: {
          title: 'Set a agenda',
          subtitle: '',
          description: 'Schedule a meeting with all teachers of the school.',
        },
        $2: {
          title: 'Check stats',
          subtitle: '5min',
          description:
            'View the summary of the statistics of the observations. Each coach will have different statistics once they are based on the observations.',
        },
        $3: {
          title: 'Sharing insights',
          subtitle: '10-20min',
          description: 'Share insights from the observations',
        },
        $4: {
          title: 'Discuss positives',
          subtitle: '10-20min',
          description:
            'Discuss the Teaching Practices that had highlights during evaluations.',
        },
        $5: {
          title: 'Discuss areas of improvement ',
          subtitle: '10-20min',
          description:
            'Discuss the Teaching Practices that teachers should improve.',
        },
        $6: {
          title: 'Next steps',
          subtitle: '5min',
          description:
            'Reflect on strategies teachers can apply in the classroom.',
        },
      },
    },
    checkingStats: {
      page_title: 'Community of Practice',
      title: 'Statistics summary',
      subtitle:
        'The CoP is the third step of Coach. It is conducted by the Head Teacher and can be supported by Lead Teachers.',
      button: 'Continue',

      chart: {
        title: 'School average score',
        average_title: 'The average school rating is:',
        average_subitle:
          'This rating is the average of all Teaching Practices observed in the school',
      },

      keys: {
        title: 'Key teaching pratices',
        subtitle:
          'Key teaching practices are the ones with highest and lowest scores in the school',

        tab_positive: 'Positives',
        tab_negative: 'Needs improvement',
      },
    },
    insights: {
      page_title: 'Community of Practice',
      title: 'Sharing insights',
      feedback: {
        title: 'What insights you had',
        placeholder: "e.g. teachers usually don't check for understanding",
        upload_title: 'Upload an image',
        upload_description:
          'Send a picture of the annotations you made in this step',
      },
    },
    positives: {
      page_title: 'Community of Practice',
      title: 'Good strategies',
      feedback: {
        title: 'What was positive',
        placeholder: 'e.g. teachers always try to respond to student’s needs',
        upload_title: 'Upload an image',
        upload_description:
          'Send a picture of the annotations you made in this step',
      },
    },
    improvements: {
      page_title: 'Community of Practice',
      title: 'Areas of improvement',
      feedback: {
        title: 'What needs improvement',
        placeholder: 'e.g. teachers should explain better the lessons',
        upload_title: 'Upload an image',
        upload_description:
          'Send a picture of the annotations you made in this step',
      },
    },
    next_steps: {
      page_title: 'Community of Practice',
      title: 'Next steps',
      feedback: {
        title: 'What strategies teachers can apply in the classroom',
        placeholder: 'e.g. teachers should bring more examples in each step',
        upload_title: 'Upload an image',
        upload_description:
          'Send a picture of the annotations you made in this step',
      },
    },
    finish: {
      page_title: 'Community of Practice',
      title: 'Community of Practice complete',
      description:
        'Congratulations, you just completed the Community of Practice!',
      button: 'Finish',
    },
  },
  tlc: {
    page_title: 'Teacher Learning Circles',

    loadingBar: {
      checkingStats: 'Check stats',
      unitSelect: 'Unit select',
      introduction: 'Introduction',
      situations: 'Situations',
      explanation: 'Explanation',
      activities: 'Activities',
      finish: 'Finish',
    },

    onboarding: {
      title: 'Getting started',
      subtitle:
        'Check out the Teaching Learning Circle steps and start a new session',
      button: 'Get started',

      process: {
        step1: {
          title: 'Check school stats',
          subtitle: '5 min',
          description:
            'View the school statistics to help you decide which unit to choose',
        },
        step2: {
          title: 'Select unit',
          subtitle: '5 min',
          description:
            'Select a unit from the list to work in this Teaching Learning Circle',
        },
        step3: {
          title: 'Unit introduction',
          subtitle: '15 min',
          description:
            'Explain to the teachers what this unit is about and how it can help them be a better teacher',
        },
        step4: {
          title: 'Situational examples',
          subtitle: '10 min',
          description:
            'Explain to the teachers what this unit is about and how it can help them be a better teacher',
        },
        step5: {
          title: 'Situation explanation',
          subtitle: '10 min',
          description: 'Explain why those situations were good or bad',
        },
        step6: {
          title: 'Activities',
          subtitle: '15 min',
          description:
            'Do some activities with the teachers to exercise what they learned',
        },
      },
    },
    checkingStats: {
      title: 'Overall rating',
      graphDesc:
        'This rating is the average of the school in all Teaching Practices',
      ratingTitle: 'Rating per Teaching Practice',
      ratingDesc: 'How is the average of the school in each Teaching Practice',
      empty: {
        title: 'No sufficient data for this school',
        description:
          'Complete class observations and feedback sessions to unlock the statistics of the school next time',
      },
      button: 'Next',
    },
    unitSelect: {
      title: 'Choose unit',
      description:
        'Each unit focus on one key teaching practice for teachers to learn from ans with each other',
      button: 'Start unit',
    },
    introduction: {
      $1: {
        title: 'Introduction',
        description:
          'This Teacher Learning Circle is about using positive language in the classroom to create an encouraging learning environment for students.',

        learn: {
          title: "In this unit you'll learn:",

          $1: {
            title: 'Why using positive language is important in a classroom',
          },
          $2: {
            title:
              'How positive language can be used in the classroom to encourage students',
          },
        },

        button: 'Next',
      },
      $2: {
        title: 'Why is it useful to use positive language in the classroom?',
        description:
          'It is important to create a classroom environment where students can feel emotionally safe and supported. All students feel welcome if the teacher treats them all respectfully.',
        button: 'Start examples',
      },
    },
    situations: {
      title: 'Situational examples',
      description:
        'Read out loud the examples below and ask the questions for the teachers',

      steps: {
        $1: {
          title: 'Example 1',
          description:
            'The teacher teaches a concept to the class and gives them classwork. The teacher notices that one student is not able to do the work assigned to him. The teacher goes to the student and starts telling him that ‘you are not a good student’, ‘you never do your work’ or ‘you cannot do this work’.',
          box: {
            title: 'Discuss the following question',
            description:
              'How do you think the student will feel? How do you think they will behave?',
          },
        },

        $2: {
          title: 'Example 2',
          description:
            'The teacher teaches a concept to the class and gives them classwork. The teacher notices that one student is not able to do the work assigned to him. The teacher goes to the student and tells him ‘you are a great student and if you try harder you can do this’',
          box: {
            title: 'Discuss the following question',
            description:
              'How do you think the student will feel? How do you think they will behave?',
          },
        },
      },

      button: 'Check explanation',
    },
    explanation: {
      title: 'Explanation',
      description:
        'Let the teachers know what was bad and what was good in the examples',

      steps: {
        $1: {
          title: 'Example 1',
          description:
            'In the first exchange, the words that the teacher uses are not supporting and encouraging for the student. The student will not feel good after hearing the words and will not be motivated to work hard. A teacher should try to be supportive to the students so students can work harder.',
        },
        $2: {
          title: 'Example 2',
          description:
            'In the second example the teacher sees that the student is finding it difficult to work and then tries to support him by saying positive words and encouraging them.',
        },
      },
      button: 'Next',
    },
    activities: {button: 'Next'},
    finish: {
      title: 'Rate the activity',
      description: 'How did it go?',
      question:
        'Did they manage to answer correctly? Did they understood the correct use of positive language?',
      button: 'Finish',
    },
  },
  sessionDetails: {
    title: 'Previous session',
    feedback: 'Feedback',
    observation: 'Observation',
  },
  feedbackSession: {title: 'Coaching session'},
};

export default enTranslation;
