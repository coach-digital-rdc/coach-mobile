const frTranslation = {
  errors: {requiredField: 'Ce champ est obligatoire.'},
  answer: {
    yes: 'Oui',
    no: 'Non',
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    na: 'N/A',
  },
  splash: {
    tagline: 'Observation des pratiques de classe',
    version: 'Version {{value}}',
  },
  common: {
    cancel: 'Annuler',
    save: 'Enregistrer',
    'load-more': 'Afficher plus',
    optional: 'Facultatif',
    search: 'Rechercher',
    'image-view': "Aperçu de l'image",
    'image-picker': {
      'upload-image-modal-title': 'Envoyer une image',
      'upload-image-modal-description': 'Choisissez comment envoyer la photo',
      'upload-image-modal-option-title': "Options d'envoi",
      'upload-image-modal-option-description':
        'Choisissez comment envoyer la photo de vos annotations',
      'take-photo-button': 'Prendre une photo',
      'photo-gallery-button': 'Galerie de photos',
    },
  },
  bottom_navigator: {
    home: 'Accueil',
    tlc: 'Cercles',
    pending: 'En cours',
    cop: 'CdP',
    settings: 'Paramètres',
  },
  components: {
    starRating: {low: 'Faible', mid: 'Moyen', high: 'Élevé'},
    starsTag: {
      notEvaluted: 'Insuffisant',
      needsWork: 'À travailler',
      needsAttention: 'À surveiller',
      almostThere: 'Presque atteint',
      doingGreat: 'Très bien',
    },
  },
  aboutScan: {
    title: 'Scanner le QR code',
    description:
      "Scannez le QR code fourni par l'administration pour enregistrer votre établissement dans l'application",
    scan: 'Scanner le QR code',
  },
  login: {
    main: {
      welcome: 'Bienvenue !',
      tagline: 'Observation de classe',
      subtitle:
        "Connectez-vous avec l'adresse e-mail ou le numéro de téléphone de votre compte.",
      user_id: 'Adresse e-mail ou téléphone',
      user_id_placeholder: 'ex. nom@example.com',
      error:
        'Utilisateur introuvable. Essayez avec votre numéro de téléphone ou créez un compte.',
      button: 'Se connecter',
      create_account: 'Pas encore de compte ? ',
      create_account_button: 'Créer un compte',
    },
    otp: {
      header: 'Vérification',
      heading: 'Code de vérification',
      title: 'Saisissez le code à 6 chiffres envoyé à',
      error: 'Code incorrect. Veuillez réessayer.',
      button: 'Vérifier',
      not_receive_code: 'Code non reçu ?',
      resend_code: 'Renvoyer le code',
      change_email: "Changer d'adresse e-mail",
    },
    fastlogin: {
      welcome: 'Bon retour !',
      title: 'Vous étiez connecté en tant que',
      button: 'Se connecter en tant que',
      change_coach_button: "Changer d'observateur",
    },
    createAccount: {
      title: 'Nouveau compte',
      takePhoto: 'Prendre/choisir une photo',
      name: 'Prénom',
      surname: 'Nom',
      pin: 'PIN',
      pin_description: "Numéro personnel d'identification",
      nin: 'NIN',
      email: 'E-mail',
      phone: 'Téléphone',
      birthdate: "Date de naissance de l'observateur",
      nin_description: "Numéro national d'identification",
      'create-account-button': 'Créer le compte',
      success: 'Compte créé',
    },
    accountCreated: {
      title: 'Compte créé',
      subtitle:
        'Vous pouvez maintenant utiliser votre compte pour vous connecter sur cet appareil',
    },
  },
  signup: {
    success: {
      title: 'Profil créé',
      subtitle:
        'Vous pouvez maintenant enregistrer votre établissement et commencer les observations',
      button: "Choisir l'établissement",
    },
  },
  logout: {
    title: 'Voulez-vous vraiment vous déconnecter ?',
    'confirm-button': 'Oui',
    'cancel-button': 'Annuler',
  },
  settings: {
    title: 'Paramètres',
    logout: 'Se déconnecter',
    'logout-description': 'Recommencer depuis le début ',
    language: 'Langue',
    lastSync: 'Dernière synchronisation : {{value}}',
    'never-synced': 'jamais',
    'try-sync': 'Synchroniser',
    appVersion: "Version de l'application",
    'unsynced-items': 'Éléments non synchronisés',
    'unsynced-teacher': 'Enseignants :',
    'unsynced-session': 'Séances :',
    'unsynced-feedback': 'Retours :',
    'sync-error-title': 'Impossible de synchroniser les données',
    'sync-error-description': 'Vérifiez votre connexion et réessayez',
    changeLanguage: {title: 'Choisir la langue', button: 'Suivant'},
  },
  coachSelect: {
    title: 'Choisissez votre profil',
    'new-profile': 'Créer un profil',
    'item-description_interval':
      '(0)[Aucune séance];(1)[1 séance];(2-inf)[{{count}} séances];',
    'item-description-empty': 'Aucun profil',
  },
  schoolSelect: {
    header: 'Établissement',
    title: "Choisissez l'établissement",
    subtitle:
      "Choisissez l'établissement où vous observez, ou ajoutez-le en scannant son QR code.",
    'qr-title': "Scanner le QR code de l'établissement",
    'qr-hint': "Le code figure sur la fiche remise par l'administration",
    search: 'Rechercher un établissement',
    empty: 'Aucun établissement trouvé.',
    'item-description_interval':
      '(0)[Aucun enseignant];(1)[1 enseignant];(2-inf)[{{count}} enseignants];',
  },
  syncDetails: {
    title: 'Configuration terminée',
    description: "L'appareil a été configuré avec les données de base de",
    start: "Commencer à utiliser l'application",
    'description-list': 'Vous pourrez :',

    list_0: '- Choisir {{ value }} dans la liste des établissements',
    list_1: '- Créer des enseignants',
    list_2: '- Choisir des enseignants déjà créés',
    list_3: '- Consulter les données des enseignants déjà créés',
    list_4: '- Consulter les données de {{ value }}',
  },
  home: {
    salutation: 'Bonjour',
    tiles: {
      'new-observation': 'Nouvelle observation',
      'in-progress': 'Séances en cours',
      manual: 'Manuel',
      tlc: "Cercles d'apprentissage",
      cop: 'Communauté de pratique',
      sync: 'Synchronisation',
    },
    sync: {
      done: 'Synchronisé {{date}}',
      never: 'Pas encore synchronisé',
      pending_interval:
        '(1)[1 élément à synchroniser];(2-inf)[{{count}} éléments à synchroniser];',
    },
    teachersLength_interval: 'Établissement :',
    'menu-items': {
      newSession: 'Nouvelle observation',
      switchSchools: "Changer d'établissement",
      switchCoach: "Changer d'observateur",
      coachScript: "Manuel d'utilisation",
      pendingSession: 'Séances en attente',
      switchProfile: 'Passer à un autre profil',
      startOver: 'Se déconnecter',
      statics: 'Statistiques',
    },
    teachers: {
      title: 'Enseignants',
      addNew: 'Ajouter un enseignant',
      'no-session': 'Aucune séance. Commencez une observation !',
      'last-session': 'Mis à jour le {{date}}',
      session_interval: '(1)[1 observation];(2-inf)[{{count}} observations];',
      teachers_count: 'Enseignants de cet établissement :',
      section: 'Enseignant.e.s ({{count}})',
      add: 'Ajouter',
      search: 'Rechercher un.e enseignant.e',
      'last-observation': 'dernière le {{date}}',
      'no-observation': 'aucune observation',
    },
    emptyState: {
      title: 'Aucun enseignant enregistré',
      description: 'Ajoutez un enseignant pour commencer les observations',
    },
    newSession: {
      title: 'Nouvelle séance',
      subtitle:
        "Choisissez un enseignant pour commencer une séance d'observation",
    },
    stats: {
      page_title: 'Statistiques',
      title: 'Statistiques des enseignants',
      tabs: {
        available: 'Disponibles',
        unavailable: 'Non disponibles',
      },
      empty: {
        title: 'Aucun enseignant enregistré',
        subtitle:
          'Ajoutez un enseignant et réalisez 3 séances pour voir les statistiques',
      },
      available: {
        title: 'Statistiques disponibles',
        subtitle:
          'Choisissez un enseignant pour voir son évolution au fil des séances',
        empty: {
          title: 'Aucune statistique disponible',
          subtitle:
            'Les statistiques d’un enseignant sont disponibles après trois séances.',
        },
      },
      unavailable: {
        title: 'Statistiques non disponibles',
        subtitle:
          'Il faut au moins 3 séances terminées avec ces enseignants pour voir les statistiques.',
        empty: {
          title: 'Toutes les statistiques sont disponibles',
          subtitle:
            'Il faut au moins 3 séances terminées avec ces enseignants pour voir les statistiques.',
        },
        label: '{{value}} séance(s) supplémentaire(s) nécessaire(s)',
      },
    },
    pending: {
      page_title: 'Séances inachevées',
      title: 'Séances inachevées',
      subtitle: "Terminez l'entretien avec les enseignants suivants",
      list_subtitle: 'Entretien en attente',
    },
  },
  teacher: {
    form: {
      name: 'Prénom',
      'name-placeholder': 'ex. Daniel',
      'surname-placeholder': 'ex. MUKENDI',
      'heading-new': 'Ajouter un.e enseignant.e',
      subtitle:
        "L'enseignant.e est enregistré.e sur l'appareil puis envoyé.e au serveur à la prochaine synchronisation.",
      sex: 'Sexe',
      female: 'Féminin',
      male: 'Masculin',
      'weekly-load': 'Charge hebdomadaire (h)',
      birthdate: "Date de naissance de l'enseignant",
      birthdate_title: 'Choisir une date',
      birthdate_confirm: 'Confirmer',
      birthdate_cancel: 'Annuler',
      teacher_code: "Code de l'enseignant",
      teacher_code_description: "Code de l'enseignant",
      matricule: 'Matricule',
      matricule_description: "Matricule de l'enseignant",
      surname: 'Nom',
      'title-new': 'Nouvel enseignant.e',
      'title-edit': "Modifier l'enseignant",
      subject: 'Discipline principale',
      'new-teacher-button': "Ajouter l'enseignant.e",
      'update-teacher-button': 'Enregistrer',
      success: 'Enseignant ajouté',
      success_update: 'Enseignant mis à jour',
      pin: 'PIN',
      pin_description: "Numéro personnel d'identification",
      nin: 'NIN',
      nin_description: "Numéro national d'identification",
    },
    details: {
      title: 'Enseignant.e',
      'new-observation': 'Nouvelle observation',
      'resume-observation': "Reprendre l'observation",
      subject: 'Discipline principale',
      school: 'Établissement',
      editTeacher: "Modifier l'enseignant",
      description: 'Enseignant de {{subject}} à {{school}}',
    },
    tabs: {
      session: {
        title: 'Observations',
        'observation-of': 'Observation du {{date}}',
        'in-progress': 'En cours',
        closed: 'Clôturée',
        session: "Séance d'observation",
        newClassObservation: 'Nouvelle observation de classe',
        stillNoSession: "Aucune séance d'observation enregistrée",
        stillNoSessionDescription:
          'Vous pouvez commencer une observation de classe avec cet enseignant',
        selectCoach: 'Choisir la séance',
        viewSummary:
          "Vous pouvez consulter le résumé de l'observation ou le retour donné à l'enseignant",
      },
      stats: {
        title: "Statistiques de l'enseignant",
        'evolution-tab': 'Évolution',
        overallRating: 'Appréciation générale',
        currentRating: "L'appréciation actuelle est :",
        ratingAverage:
          'Cette appréciation est la moyenne des sous-domaines de la dernière observation',
        evolution:
          'Cette appréciation est la moyenne des sous-domaines de la dernière observation',
        comparision:
          "Évolution des appréciations de l'enseignant au fil des séances",
        lastSession: 'depuis la dernière séance',
        seeDetails: 'Voir le détail',
        button: 'Nouvelle observation de classe',
        empty: {
          title: 'Aucune donnée à afficher pour le moment',
          subtitle:
            'Réalisez au moins trois observations de classe avec entretien pour voir les statistiques',
          button: 'Nouvelle observation de classe',
        },
        ratingPerSession: 'Appréciation par séance',
        teacherComparision:
          "Évolution des appréciations de l'enseignant au fil des séances",
        sessionName: 'Séance {{value}}',
        teacherAt: 'Enseignant à {{school}}',
      },
    },
    subjects: {
      np: {
        $1: 'Anglais',
        $2: 'Mathématiques',
        $3: 'Sciences et technologie',
        $4: 'Études sociales et valeurs humaines',
        $5: 'Santé, éducation physique et arts',
        $6: 'Langue maternelle et matières locales',
        $7: 'Hamro serofero',
        $8: 'Népali',
        $9: 'Autre',
      },
      sl: {
        $1: 'Arabe',
        $2: 'Arts créatifs et du spectacle',
        $3: 'Sciences générales',
        $4: 'Économie domestique',
        $5: 'Langue',
        $6: 'Mathématiques',
        $7: 'Éducation physique et santé',
        $8: 'Aptitude quantitative et verbale',
        $9: 'Études sociales/éducation civique',
        $10: 'Autre',
      },
      cd: {
        $1: 'Français',
        $2: 'Anglais',
        $3: 'Mathématiques',
        $4: 'Physique',
        $5: 'Chimie',
        $6: 'Biologie',
        $7: 'Histoire',
        $8: 'Géographie',
        $9: 'Éducation civique et morale',
        $10: 'Religion',
        $11: 'Informatique',
        $12: 'Éducation physique et sportive',
        $13: 'Autre',
      },
    },
  },
  classObservation: {
    title: 'Observation de classe',
    phases: {
      preparation: 'Préparation',
      observation: 'Observation',
      evaluation: 'Évaluation',
      closing: 'Clôture',
    },
    about: {
      title: 'Déroulement de la séance',
      subtitle:
        "L'observation se fait en quatre étapes. Chaque étape doit être terminée avant de passer à la suivante.",
      steps: {
        preparation:
          "Échangez avec l'enseignant.e avant la leçon, complétez l'en-tête de la fiche et, si possible, la checklist des documents.",
        observation:
          'Installez-vous au fond de la classe et notez les faits observés au fil de la séquence.',
        evaluation:
          "Cotez les 30 comportements, puis établissez le plan de développement avec l'enseignant.e.",
        closing:
          'Ajoutez vos conseils et recueillez les signatures : la fiche est alors verrouillée et prête à être synchronisée.',
      },
      'start-button': 'Commencer la préparation',
      step1: {
        title: 'Préparation',
        subtitle: '5 minutes',
        description:
          "Échangez avec l'enseignant avant le cours et relisez vos notes des visites précédentes s'il a déjà été observé.",
      },
      step2: {
        title: 'Observation de classe',
        subtitle: '30 à 45 minutes',
        description:
          'Installez-vous au fond de la classe pour prendre des notes et pensez à mettre votre téléphone en mode silencieux.',
      },
      step3: {
        title: 'Entretien',
        subtitle: '20 à 30 minutes',
        description:
          "Présentez vos observations à l'enseignant en soulignant les points forts et les axes d'amélioration de sa pratique.",
      },
      step4: {
        title: 'Prochaines étapes',
        subtitle: '5 minutes',
        description:
          "Après vous être accordé avec l'enseignant sur les priorités, planifiez votre prochaine visite.",
      },
    },
    advice: {
      title: 'Conseils et horaires',
      subtitle:
        "Les heures sont reprises de l'observation ; corrigez-les si besoin.",
      'start-time': 'Début de la séquence',
      'end-time': 'Fin de la séquence',
      advice: "Conseils à l'enseignant.e",
      'advice-placeholder':
        'Points forts à maintenir, conseils pratiques pour la prochaine séquence…',
      place: 'Fait à',
      'place-placeholder': 'ex. Kinshasa',
      date: 'Le',
      button: 'Passer aux signatures',
    },
    pdp: {
      title: 'Plan de développement',
      heading: 'Plan de développement professionnel',
      subtitle:
        "Projet établi à partir de la cotation, selon les règles PDP version {{version}} (publiées le {{date}}). Ajustez-le avec l'enseignant.e puis validez-le.",
      'missing-rules':
        "Les règles du PDP ne sont pas encore sur l'appareil. Synchronisez l'application puis revenez à cette étape.",
      summary: 'Résumé de la cotation',
      'read-only': 'Lecture seule',
      'score-note': 'cote proposée {{suggested}}, saisie {{score}}',
      diagnostic: 'Diagnostic',
      group: {
        STRENGTH: 'Points forts',
        CONSOLIDATE: 'Axes à consolider',
        PRIORITY: 'Axes prioritaires',
      },
      category: {
        STRENGTH: 'Point fort',
        CONSOLIDATE: 'À consolider',
        PRIORITY: 'Axe prioritaire',
      },
      origin: {GENERATED: 'Généré', EDITED: 'Modifié', ADDED: 'Ajouté'},
      answer: {
        YES: 'Oui',
        NO: 'Non',
        LOW: 'Faible',
        MEDIUM: 'Moyen',
        HIGH: 'Élevé',
        NA: 'N/A',
      },
      short: {YES: 'O', NO: 'N', LOW: 'F', MEDIUM: 'M', HIGH: 'E', NA: '–'},
      reason: 'Coté {{answer}}',
      'reason-score': ' ; sous-domaine {{code}} coté {{score}}/5',
      objectives: 'Objectifs du plan ({{count}}/{{max}})',
      regenerate: 'Régénérer',
      validated: 'Validé',
      up: 'Monter',
      down: 'Descendre',
      edit: 'Modifier',
      remove: 'Retirer',
      objective: 'Objectif',
      actions: 'Actions',
      'actions-input': 'Actions (une par ligne)',
      indicator: 'Indicateur de suivi',
      'due-date': 'Échéance',
      'due-date-input': 'Échéance (AAAA-MM-JJ)',
      'to-fill': 'À renseigner',
      done: 'Terminer',
      add: 'Ajouter un objectif',
      free: 'Objectif libre',
      max: 'Maximum {{max}} objectifs atteint',
      editable: "Projet modifiable jusqu'à sa validation",
      'validated-at': "PDP validé avec l'enseignant.e à {{time}}",
      'back-to-scoring': 'Cotation',
      validate: 'Valider le PDP',
      'validate-title': 'Valider le PDP ?',
      'validate-message_interval':
        "(1)[Le plan compte 1 objectif. Une fois validé avec l'enseignant.e, il ne pourra plus être modifié.];(2-inf)[Le plan compte {{count}} objectifs. Une fois validé avec l'enseignant.e, il ne pourra plus être modifié.];",
      'validate-confirm': 'Valider',
      continue: 'Continuer',
    },
    notes: {
      title: 'Notes chronologiques',
      subtitle:
        'Notez les faits observés au fil de la séquence. Chaque note est horodatée automatiquement.',
      'subtitle-read-only':
        'Les notes sont en lecture seule. Elles restent visibles pendant la cotation.',
      running: 'Observation en cours depuis {{time}}',
      ended: 'Observation terminée à {{time}}',
      count_interval: '(0-1)[note];(2-inf)[notes];',
      empty: "Aucune note pour l'instant.",
      placeholder: 'Décrivez ce que vous observez…',
      add: 'Ajouter la note',
      edit: 'Modifier la note',
      delete: 'Supprimer la note',
      locked:
        "La cotation est verrouillée tant qu'aucune note n'est enregistrée",
      'unlock-at-end': "La cotation pourra commencer à la fin de l'observation",
      unlocked: 'Cotation déverrouillée',
      end: "Terminer l'observation",
      'end-title': "Terminer l'observation ?",
      'end-message_interval':
        "(1)[Vous avez enregistré 1 note. Après la fin de l'observation, les notes ne pourront plus être modifiées et la cotation sera déverrouillée.];(2-inf)[Vous avez enregistré {{count}} notes. Après la fin de l'observation, les notes ne pourront plus être modifiées et la cotation sera déverrouillée.];",
      'end-confirm': 'Terminer',
      'go-to-scoring': 'Passer à la cotation',
    },
    checklist: {
      title: 'Checklist documentaire',
      'subtitle-before':
        "Vérifiez la présence des documents de l'enseignant.e et des apprenant.e.s. Ce qui ne peut pas être vérifié maintenant pourra l'être après l'observation. La checklist n'entre pas dans la cotation.",
      'subtitle-after':
        "Complétez les documents qui n'ont pas pu être vérifiés avant l'observation. La checklist n'entre pas dans la cotation.",
      'subtitle-observing':
        "L'observation est en cours : la checklist pourra être complétée après l'observation.",
      'teacher-documents': "Documents de l'enseignant.e",
      'learner-documents': "Documents de l'apprenant.e",
      before: "Avant l'observation",
      after: "Après l'observation",
      proposal: "Proposition de l'observateur",
      'proposal-placeholder': 'Ex. : mettre à jour le document chaque semaine',
      status: '{{count}}/{{total}} documents vérifiés',
      'status-later_interval':
        "(1)[ · le dernier sera à compléter après l'observation];(2-inf)[ · les {{count}} restants seront à compléter après l'observation];",
      'status-left': ' · {{count}} à compléter',
      start: "Démarrer l'observation",
      save: 'Enregistrer la checklist',
      'back-to-observation': "Retour à l'observation",
      reminder_interval:
        '(1)[Checklist : 1 document non vérifié (facultatif)];(2-inf)[Checklist : {{count}} documents non vérifiés (facultatif)];',
      complete: 'Compléter',
    },
    setup: {
      title: 'En-tête de la fiche',
      subtitle:
        'Les informations connues sont reprises automatiquement : vérifiez-les et complétez les autres.',
      button: 'Enregistrer et continuer',
      observer: 'Observateur.trice',
      profile: 'Profil',
      name: 'Nom',
      contact: 'Contact',
      session: 'Séance',
      school: 'Établissement',
      teacher: 'Enseignant.e',
      'last-observation': 'Dernière observation',
      none: 'Aucune',
      level: 'Niveau',
      secondary: 'Secondaire',
      disciplines: 'Discipline(s)',
      'weekly-load': 'Charge hebdomadaire (h)',
      'school-year': 'Année scolaire',
      activity: 'Activité observée',
      'sub-domain': 'Sous-domaine',
      'sub-domain-placeholder': 'ex. Mathématiques',
      discipline: 'Discipline',
      'sheet-code': 'N° fiche / code matrice',
      'class-name': 'Classe',
      'p-i': 'P/I',
      time: 'Heure',
      'essential-knowledge': 'Savoirs essentiels / sujet de la séquence',
      missing:
        "Renseignez la discipline de la séance et celle de l'activité observée",
      questions: {
        $0: {title: 'La classe est composée de', placeholder: 'Mixte'},
        $1: {
          title: "Combien d'élèves compte la classe ?",
          placeholder: 'ex. 40',
          options: {
            $1: 'Filles et garçons',
            $2: 'Garçons uniquement',
            $3: 'Filles uniquement',
          },
          counters: {
            $1: '1 - 10',
            $2: '10 - 30',
            $3: '30 - 60',
            $4: '60+',
          },
        },
        $2: {title: 'Quelle est la discipline ?', placeholder: 'Discipline'},
        $3: {
          title: 'Quelle est la durée de la leçon ?',
          placeholder: '50 min',
          options: {
            $1: '25 min',
            $2: '30 min',
            $3: '35 min',
            $4: '40 min',
            $5: '45 min',
            $6: '50 min',
            $7: '55 min',
            $8: '60 min',
          },
        },

        $4: {
          title: 'Quels sont les objectifs de la leçon ?',
          placeholder: "Description par l'enseignant de ce qui sera enseigné",
        },
      },
    },
    form: {
      title: 'Cotation',
      subtitle:
        "Cotez chaque comportement à partir de vos notes. Utilisez N/A lorsque le comportement n'a pas pu être observé.",
      notes: 'Notes ({{count}})',
      'notes-title': "Notes d'observation",
      checklist: 'Checklist ({{count}}/15)',
      help: 'Aide à la cotation',
      'global-score': 'Cote globale du sous-domaine',
      'suggested-later': 'proposée une fois les comportements cotés',
      suggested: 'Proposée',
      changed: 'Modifiée · proposée {{value}}',
      progress:
        '{{answered}}/{{total}} comportements cotés · {{scored}}/{{scoreTotal}} cotes globales',
      button: 'Terminer la cotation',
      'locked-title': 'Cotation verrouillée',
      'locked-end': "Terminez l'observation pour commencer la cotation.",
      'go-to-notes': 'Aller aux notes',
    },
    formConfirmation: {
      button: 'Confirmer',
      buttonEdit: 'Modifier',
      competenceView: {
        title: "Résumé de l'observation",
        subtitle: 'Vérifiez votre observation de classe',
        overallRating: "Appréciation générale de l'observation",
      },
    },
    observationCompleted: {
      title: 'Observation terminée',
      subtitle: "Merci. L'observation de classe est terminée !",
      whatsNext: 'Et ensuite ?',
      startFeedback:
        "Vous pouvez commencer dès maintenant l'entretien avec l'enseignant, ou revenir à l'accueil et le faire plus tard depuis la fiche de l'enseignant",
      button: "Commencer l'entretien",
      buttonBack: "Revenir à l'accueil",
    },
  },
  feedback: {
    mentoringSection: {
      title: 'Bonnes pratiques',
      subtitle:
        'Rappelez-vous les bonnes pratiques vues en formation et mettez-les en œuvre.',
      bestPratices:
        "Si vous ne vous en souvenez plus, consultez le manuel d'utilisation",
      continueButton: "Passer à l'entretien",
      trainingButton: "Ouvrir le manuel d'utilisation",
    },
    preparation: {
      title: 'Choisir les sous-domaines',
      subtitle: "Choisissez 1 sous-domaine à travailler avec l'enseignant",
      teachingPratice: 'Sous-domaine {{index}}',
      button: "Terminer l'entretien",
    },
    form: {
      title: 'Convenir des actions',
      subtitle:
        "Convenez avec l'enseignant des actions qu'il mènera pour progresser dans ce sous-domaine",
      actionsToImprove: "Actions d'amélioration",
      describeActions:
        "Décrivez les actions convenues avec l'enseignant pour progresser dans ce sous-domaine",
      textAreaPlaceholder:
        "ex. être plus attentif à sa façon de s'adresser aux élèves",
      uploadImage: 'Ajouter une image',
      sendPicture:
        "Vous pouvez aussi joindre une photo des notes prises pendant l'observation et l'entretien, ou de tout document utile",
      uploadPhoto: 'Ajouter une photo',
      button: "Terminer l'entretien",
    },
    completed: {
      title: 'Entretien terminé',
      subtitle: "Merci ! Vous avez terminé l'accompagnement.",
      aboutNext: 'Et ensuite ?',
      aboutNextDescription:
        "Préparez les Cercles d'apprentissage. D'ici là, vous pouvez réaliser d'autres observations en revenant à l'accueil et en choisissant un enseignant",
      button: "Revenir à l'accueil",
    },
  },
  cop: {
    onboarding: {
      page_title: 'Communauté de pratique',
      title: 'Pour commencer',
      subtitle:
        "La CdP est la troisième étape de l'accompagnement. Elle est animée par le chef d'établissement, avec l'appui d'enseignants référents. ",
      description:
        'Découvrez les étapes de la Communauté de pratique (CdP) et commencez une séance :',
      button: 'Commencer la Communauté de pratique',

      process: {
        $1: {
          title: 'Fixer un ordre du jour',
          subtitle: '',
          description:
            "Planifiez une réunion avec tous les enseignants de l'établissement.",
        },
        $2: {
          title: 'Consulter les statistiques',
          subtitle: '5 min',
          description:
            'Consultez le résumé des statistiques des observations. Chaque observateur a ses propres statistiques, établies à partir de ses observations.',
        },
        $3: {
          title: 'Partager les constats',
          subtitle: '10-20 min',
          description: 'Partagez les constats tirés des observations',
        },
        $4: {
          title: 'Discuter des points forts',
          subtitle: '10-20 min',
          description:
            'Discutez des sous-domaines qui se sont distingués lors des observations.',
        },
        $5: {
          title: "Discuter des axes d'amélioration ",
          subtitle: '10-20 min',
          description:
            'Discutez des sous-domaines que les enseignants doivent améliorer.',
        },
        $6: {
          title: 'Prochaines étapes',
          subtitle: '5 min',
          description:
            'Réfléchissez aux stratégies que les enseignants peuvent appliquer en classe.',
        },
      },
    },
    checkingStats: {
      page_title: 'Communauté de pratique',
      title: 'Résumé des statistiques',
      subtitle:
        "La CdP est la troisième étape de l'accompagnement. Elle est animée par le chef d'établissement, avec l'appui d'enseignants référents.",
      button: 'Continuer',

      chart: {
        title: "Moyenne de l'établissement",
        average_title: "L'appréciation moyenne de l'établissement est :",
        average_subitle:
          "Cette appréciation est la moyenne de tous les sous-domaines observés dans l'établissement",
      },

      keys: {
        title: 'Sous-domaines clés',
        subtitle:
          "Les sous-domaines clés sont ceux qui obtiennent les meilleures et les moins bonnes appréciations dans l'établissement",

        tab_positive: 'Points forts',
        tab_negative: 'À améliorer',
      },
    },
    insights: {
      page_title: 'Communauté de pratique',
      title: 'Partager les constats',
      feedback: {
        title: 'Quels constats avez-vous faits ?',
        placeholder:
          'ex. les enseignants vérifient rarement la compréhension des élèves',
        upload_title: 'Ajouter une image',
        upload_description:
          'Joignez une photo des annotations faites pendant cette étape',
      },
    },
    positives: {
      page_title: 'Communauté de pratique',
      title: 'Bonnes stratégies',
      feedback: {
        title: "Qu'est-ce qui était positif ?",
        placeholder:
          'ex. les enseignants essaient toujours de répondre aux besoins des élèves',
        upload_title: 'Ajouter une image',
        upload_description:
          'Joignez une photo des annotations faites pendant cette étape',
      },
    },
    improvements: {
      page_title: 'Communauté de pratique',
      title: "Axes d'amélioration",
      feedback: {
        title: "Qu'est-ce qui doit être amélioré ?",
        placeholder: 'ex. les enseignants devraient mieux expliquer les leçons',
        upload_title: 'Ajouter une image',
        upload_description:
          'Joignez une photo des annotations faites pendant cette étape',
      },
    },
    next_steps: {
      page_title: 'Communauté de pratique',
      title: 'Prochaines étapes',
      feedback: {
        title:
          'Quelles stratégies les enseignants peuvent-ils appliquer en classe ?',
        placeholder:
          "ex. les enseignants devraient donner plus d'exemples à chaque étape",
        upload_title: 'Ajouter une image',
        upload_description:
          'Joignez une photo des annotations faites pendant cette étape',
      },
    },
    finish: {
      page_title: 'Communauté de pratique',
      title: 'Communauté de pratique terminée',
      description:
        'Félicitations, vous avez terminé la Communauté de pratique !',
      button: 'Terminer',
    },
  },
  tlc: {
    page_title: "Cercles d'apprentissage",

    loadingBar: {
      checkingStats: 'Statistiques',
      unitSelect: 'Unité',
      introduction: 'Introduction',
      situations: 'Situations',
      explanation: 'Explication',
      activities: 'Activités',
      finish: 'Fin',
    },

    onboarding: {
      title: 'Pour commencer',
      subtitle:
        "Découvrez les étapes du Cercle d'apprentissage et commencez une séance",
      button: 'Commencer',

      process: {
        step1: {
          title: "Consulter les statistiques de l'établissement",
          subtitle: '5 min',
          description:
            "Consultez les statistiques de l'établissement pour choisir l'unité",
        },
        step2: {
          title: "Choisir l'unité",
          subtitle: '5 min',
          description:
            "Choisissez une unité dans la liste pour ce Cercle d'apprentissage",
        },
        step3: {
          title: "Introduction de l'unité",
          subtitle: '15 min',
          description:
            "Expliquez aux enseignants l'objet de l'unité et ce qu'elle peut leur apporter",
        },
        step4: {
          title: 'Situations',
          subtitle: '10 min',
          description:
            'Présentez aux enseignants des situations de classe et faites-les réagir',
        },
        step5: {
          title: 'Explication des situations',
          subtitle: '10 min',
          description:
            'Expliquez pourquoi ces situations étaient bonnes ou mauvaises',
        },
        step6: {
          title: 'Activités',
          subtitle: '15 min',
          description:
            'Faites des activités avec les enseignants pour mettre en pratique ce qu’ils ont appris',
        },
      },
    },
    checkingStats: {
      title: 'Appréciation générale',
      graphDesc:
        "Cette appréciation est la moyenne de l'établissement dans tous les sous-domaines",
      ratingTitle: 'Appréciation par sous-domaine',
      ratingDesc: "Moyenne de l'établissement dans chaque sous-domaine",
      empty: {
        title: 'Données insuffisantes pour cet établissement',
        description:
          "Réalisez des observations de classe et des entretiens pour obtenir les statistiques de l'établissement la prochaine fois",
      },
      button: 'Suivant',
    },
    unitSelect: {
      title: "Choisir l'unité",
      description:
        'Chaque unité porte sur une pratique clé, que les enseignants travaillent ensemble',
      button: "Commencer l'unité",
    },
    introduction: {
      $1: {
        title: 'Introduction',
        description:
          "Ce Cercle d'apprentissage porte sur l'usage d'un langage positif en classe pour créer un environnement d'apprentissage encourageant pour les élèves.",

        learn: {
          title: 'Dans cette unité, vous verrez :',

          $1: {
            title: 'Pourquoi un langage positif est important en classe',
          },
          $2: {
            title:
              'Comment utiliser un langage positif en classe pour encourager les élèves',
          },
        },

        button: 'Suivant',
      },
      $2: {
        title: 'Pourquoi utiliser un langage positif en classe ?',
        description:
          "Il est important de créer en classe un environnement où les élèves se sentent en sécurité et soutenus sur le plan affectif. Tous les élèves se sentent les bienvenus si l'enseignant les traite tous avec respect.",
        button: 'Voir les exemples',
      },
    },
    situations: {
      title: 'Situations',
      description:
        'Lisez à voix haute les exemples ci-dessous et posez les questions aux enseignants',

      steps: {
        $1: {
          title: 'Exemple 1',
          description:
            "L'enseignant explique une notion à la classe puis donne un exercice. Il remarque qu'un élève n'arrive pas à faire le travail demandé. Il va vers lui et lui dit : « tu n'es pas un bon élève », « tu ne fais jamais ton travail » ou « tu n'y arriveras pas ».",
          box: {
            title: 'Discutez de la question suivante',
            description:
              "Comment pensez-vous que l'élève va se sentir ? Comment va-t-il se comporter ?",
          },
        },

        $2: {
          title: 'Exemple 2',
          description:
            "L'enseignant explique une notion à la classe puis donne un exercice. Il remarque qu'un élève n'arrive pas à faire le travail demandé. Il va vers lui et lui dit : « tu es un bon élève, et si tu fais un effort tu peux y arriver ».",
          box: {
            title: 'Discutez de la question suivante',
            description:
              "Comment pensez-vous que l'élève va se sentir ? Comment va-t-il se comporter ?",
          },
        },
      },

      button: "Voir l'explication",
    },
    explanation: {
      title: 'Explication',
      description:
        'Expliquez aux enseignants ce qui était mauvais et ce qui était bon dans les exemples',

      steps: {
        $1: {
          title: 'Exemple 1',
          description:
            "Dans le premier échange, les mots de l'enseignant ne soutiennent ni n'encouragent l'élève. Celui-ci ne se sentira pas bien et ne sera pas motivé pour travailler. L'enseignant doit soutenir les élèves pour qu'ils travaillent davantage.",
        },
        $2: {
          title: 'Exemple 2',
          description:
            "Dans le second exemple, l'enseignant voit que l'élève a des difficultés et essaie de le soutenir par des mots positifs et encourageants.",
        },
      },
      button: 'Suivant',
    },
    activities: {button: 'Suivant'},
    finish: {
      title: "Évaluer l'activité",
      description: "Comment s'est-elle déroulée ?",
      question:
        "Les enseignants ont-ils bien répondu ? Ont-ils compris l'usage d'un langage positif ?",
      button: 'Terminer',
    },
  },
  sessionDetails: {
    title: 'Séance précédente',
    feedback: 'Entretien',
    observation: 'Observation',
  },
  feedbackSession: {title: 'Entretien'},
};

export default frTranslation;
