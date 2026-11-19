// Content of the three learning-circle units (B22), in French, taken from the validated mockups:
// introduction, situations, explanation, activities, responses and task. The examples are adapted
// to DRC secondary classes; the content is to be validated by SERNAFOR.

// Units offered to the schools, with the behaviour of the grid they work on
export const TLC_UNITS = [
  {
    id: 1,
    title: 'Unité 1',
    topic: 'Utiliser un langage positif',
    behaviour: '2.1.2',
  },
  {
    id: 2,
    title: 'Unité 2',
    topic: 'Énoncer clairement les objectifs de la séquence',
    behaviour: '3.1.5',
  },
  {
    id: 3,
    title: 'Unité 3',
    topic: 'Vérifier la compréhension des apprenant.e.s',
    behaviour: '3.1.7',
  },
];

export type Line = {
  who: 'teacher' | 'learner' | 'class';
  name?: string;
  text: string;
};

export type Example = {
  title: string;
  context: string;
  dialogue?: Line[];
  question: string;
};

export type UnitContent = {
  summary: string;
  learn: string[];
  whyTitle: string;
  why: string;
  situations: Example[];
  explanation: {bad: string; good: string};
  activities: Example[];
  responses: string[];
  next: string;
  task: string;
};

export const tlcContent: Record<number, UnitContent> = {
  1: {
    summary:
      "Cette unité porte sur l'utilisation d'un langage positif en classe, pour créer un climat qui encourage tous les apprenant.e.s, filles et garçons, à participer.",
    learn: [
      'Pourquoi le langage positif est important en classe',
      'Comment encourager les apprenant.e.s par les mots, en particulier quand ils ou elles se trompent',
    ],
    whyTitle: 'Pourquoi utiliser un langage positif en classe ?',
    why: "Les apprenant.e.s apprennent mieux lorsqu'ils et elles se sentent en sécurité et respecté.e.s. Une remarque humiliante devant la classe peut décourager un.e élève pour longtemps et pousse les autres à ne plus lever la main. Les filles, souvent moins interrogées, sont souvent les premières à se taire.",
    situations: [
      {
        title: 'Exemple 1',
        context:
          "Cours de français en 2e. Pendant un exercice de conjugaison au passé simple, l'enseignant remarque que Plamedi n'a rien écrit. Il s'arrête devant son banc et dit à voix haute : « Toi, tu ne fais jamais rien. Avec toi, c'est peine perdue. »",
        question:
          'Comment Plamedi va-t-il se sentir ? Comment va-t-il se comporter au prochain exercice ?',
      },
      {
        title: 'Exemple 2',
        context:
          "Même classe. Merveille écrit « ils finissèrent » au tableau et quelques élèves éclatent de rire. L'enseignant calme la classe : « On ne se moque pas, se tromper fait partie de l'apprentissage. Merveille, finir est du 2e groupe : regarde comment nous avons conjugué choisir. » Merveille corrige : « ils finirent ». « Exactement, bravo ! »",
        question:
          "Qu'a fait l'enseignant face aux rires ? Quel effet cela aura-t-il sur Merveille et sur le reste de la classe ?",
      },
    ],
    explanation: {
      bad: "Dans l'exemple 1, l'enseignant juge la personne au lieu du travail. Plamedi est humilié devant ses camarades : il risque de ne plus essayer et de décrocher. Il aurait fallu chercher ce qui le bloque et l'aider à démarrer.",
      good: "Dans l'exemple 2, l'enseignant protège Merveille des moqueries, présente l'erreur comme normale et donne un indice pour qu'elle trouve elle-même la bonne réponse. Merveille reste motivée, et la classe comprend qu'on peut participer sans crainte.",
    },
    activities: [
      {
        title: 'Activité 1',
        context:
          "Cours d'histoire en 3e. L'enseignante interroge la classe sur l'indépendance du pays.",
        dialogue: [
          {
            who: 'teacher',
            text: 'Qui peut me dire en quelle année le Congo est devenu indépendant ?',
          },
          {who: 'learner', name: 'Exaucé', text: 'En 1965, madame.'},
          {
            who: 'teacher',
            text: "Faux ! Tu dors encore en classe, comme d'habitude.",
          },
          {who: 'learner', name: 'Exaucé', text: 'Pardon, madame.'},
          {who: 'teacher', text: 'Pardon de quoi ? Assieds-toi.'},
        ],
        question:
          'Comment Exaucé va-t-il se sentir ? Lèvera-t-il encore la main ?',
      },
      {
        title: 'Activité 2',
        context:
          "Même classe, même question, avec une autre réaction de l'enseignante.",
        dialogue: [
          {
            who: 'teacher',
            text: 'Qui peut me dire en quelle année le Congo est devenu indépendant ?',
          },
          {who: 'learner', name: 'Exaucé', text: 'En 1965, madame.'},
          {
            who: 'teacher',
            text: "1965 est aussi une date importante : c'est l'arrivée au pouvoir de Mobutu. Mais l'indépendance vient avant. Souviens-toi du discours de Lumumba, le 30 juin…",
          },
          {who: 'learner', name: 'Exaucé', text: '1960 !'},
          {
            who: 'teacher',
            text: 'Oui, le 30 juin 1960. Merci Exaucé, tu as bien fait le lien entre les deux dates.',
          },
        ],
        question:
          "Comment Exaucé va-t-il se sentir cette fois ? Qu'est-ce qui a changé dans la réaction de l'enseignante ?",
      },
    ],
    responses: [
      "L'enseignante rejette la réponse et s'en prend à l'élève. Exaucé a honte devant la classe et risque de ne plus participer.",
      "L'enseignante reconnaît ce qui est juste dans la réponse, donne un indice et félicite l'effort. Exaucé trouve lui-même la bonne réponse et garde confiance.",
    ],
    next: 'Pour la tâche, chaque enseignant.e va préparer des phrases positives à utiliser en classe.',
    task: "Préparez trois phrases d'encouragement à utiliser quand un.e apprenant.e se trompe dans votre discipline. Utilisez-les pendant la semaine, puis partagez au prochain cercle ce qui a changé dans la participation de la classe.",
  },
  2: {
    summary:
      "Cette unité porte sur l'énoncé clair des objectifs de la séance et sur le lien entre ces objectifs et les activités de la classe.",
    learn: [
      "Pourquoi les apprenant.e.s doivent savoir ce qu'ils et elles vont apprendre",
      'Comment formuler un objectif simple et y relier chaque activité',
    ],
    whyTitle: 'Pourquoi énoncer clairement les objectifs de la séance ?',
    why: "Quand les apprenant.e.s savent ce qu'ils et elles devront être capables de faire à la fin de la séance, ils et elles comprennent à quoi sert chaque activité et peuvent vérifier leurs propres progrès. Un objectif clair aide aussi l'enseignant.e à choisir les activités et à faire le bilan de la séance.",
    situations: [
      {
        title: 'Exemple 1',
        context:
          "Cours de physique en 3e. L'enseignant entre, écrit au tableau « Chapitre 4 : la vitesse » et commence à dicter la définition. Après vingt minutes de copie, il donne un exercice sur un bus qui roule de Kinshasa à Kisantu.",
        question:
          "Les apprenant.e.s savent-ils ce qu'ils doivent apprendre aujourd'hui ? Comprennent-ils à quoi sert l'exercice ?",
      },
      {
        title: 'Exemple 2',
        context:
          "Une autre enseignante commence ainsi : « À la fin de la séance, vous saurez calculer la vitesse moyenne d'un véhicule à partir de la distance et de la durée du trajet. » Elle écrit l'objectif au tableau. Avant l'exercice, elle rappelle : « Cet exercice sert à vérifier que vous savez calculer une vitesse moyenne. » À la fin, elle relit l'objectif avec la classe.",
        question:
          "Qu'est-ce qui change pour les apprenant.e.s ? Comment peuvent-ils et elles savoir s'ils ont atteint l'objectif ?",
      },
    ],
    explanation: {
      bad: "Dans l'exemple 1, le titre du chapitre n'est pas un objectif. Les apprenant.e.s copient sans savoir ce qu'on attend d'eux et ne voient pas le lien entre la définition et l'exercice.",
      good: "Dans l'exemple 2, l'objectif dit ce que les apprenant.e.s sauront faire, il reste visible au tableau, et l'enseignante y relie l'exercice puis le bilan. Chacun.e sait ce qu'il faut apprendre et peut mesurer ses progrès.",
    },
    activities: [
      {
        title: 'Activité 1',
        context: 'Cours de biologie en 4e, sur la photosynthèse.',
        dialogue: [
          {
            who: 'teacher',
            text: "Ouvrez vos cahiers. Aujourd'hui : la photosynthèse.",
          },
          {
            who: 'learner',
            name: 'Christelle',
            text: "Monsieur, est-ce qu'on aura une interrogation là-dessus ?",
          },
          {
            who: 'teacher',
            text: "Contentez-vous de copier ce que j'écris au tableau.",
          },
          {who: 'learner', name: 'Christelle', text: "D'accord, monsieur."},
        ],
        question:
          "Christelle sait-elle ce qu'elle devra être capable de faire à la fin de la séance ?",
      },
      {
        title: 'Activité 2',
        context: 'Même classe, même leçon, avec une autre introduction.',
        dialogue: [
          {
            who: 'teacher',
            text: "Aujourd'hui, nous allons voir comment la plante fabrique sa nourriture. À la fin de la séance, vous saurez expliquer le rôle de la lumière, de l'eau et du gaz carbonique dans la photosynthèse.",
          },
          {
            who: 'learner',
            name: 'Christelle',
            text: "Monsieur, est-ce qu'on aura une interrogation là-dessus ?",
          },
          {
            who: 'teacher',
            text: "Oui, vendredi : vous devrez expliquer ce schéma avec vos propres mots. C'est pour cela que l'expérience de tout à l'heure est importante.",
          },
          {
            who: 'learner',
            name: 'Christelle',
            text: "Alors je vais bien observer l'expérience.",
          },
        ],
        question:
          "Qu'est-ce qui a changé pour Christelle ? Sur quoi va-t-elle porter son attention ?",
      },
    ],
    responses: [
      "L'enseignant annonce un thème, pas un objectif, et ne répond pas à la question. Christelle copie sans savoir ce qu'on attend d'elle.",
      "L'objectif dit ce que les apprenant.e.s sauront faire, et l'enseignant y relie l'expérience et l'interrogation. Christelle sait sur quoi porter son attention.",
    ],
    next: "Pour la tâche, chaque enseignant.e va formuler les objectifs d'une prochaine séance.",
    task: 'Choisissez une séance de la semaine prochaine. Écrivez son objectif sous la forme « À la fin de la séance, les apprenant.e.s sauront… », puis notez pour chaque activité prévue en quoi elle sert cet objectif. Présentez votre fiche au prochain cercle.',
  },
  3: {
    summary:
      "Cette unité porte sur l'utilisation des questions et d'autres stratégies pour vérifier, pendant la séance, si les apprenant.e.s ont compris.",
    learn: [
      'Pourquoi vérifier la compréhension tout au long de la séance',
      'Quelques stratégies simples pour vérifier la compréhension de toute la classe',
    ],
    whyTitle: 'Pourquoi vérifier la compréhension des apprenant.e.s ?',
    why: "L'enseignant.e doit savoir si les apprenant.e.s comprennent ce qu'on attend d'eux. Il faut le vérifier tout au long de la séance : à la fin de la séance ou au moment de l'interrogation, il est trop tard pour aider ceux et celles qui n'ont pas compris. Sinon, quelques élèves suivent la leçon et les autres décrochent.",
    situations: [
      {
        title: 'Exemple 1',
        context:
          'Cours de mathématiques en 3e, sur les fractions équivalentes.',
        dialogue: [
          {
            who: 'teacher',
            text: 'Est-ce que 2/3 est égal à 4/6 ? Oui ou non ?',
          },
          {who: 'learner', name: 'Glodie', text: 'Oui.'},
          {who: 'teacher', text: 'Très bien. Tout le monde a compris ?'},
          {who: 'class', text: 'Oui, monsieur !'},
        ],
        question:
          "L'enseignant sait-il si Glodie a compris ou si elle a deviné ? Et le reste de la classe ?",
      },
      {
        title: 'Exemple 2',
        context: 'Même classe, même notion.',
        dialogue: [
          {who: 'teacher', text: 'Est-ce que 2/3 est égal à 4/6 ?'},
          {who: 'learner', name: 'Glodie', text: 'Oui.'},
          {who: 'teacher', text: 'Explique-nous comment tu le sais.'},
          {
            who: 'learner',
            name: 'Glodie',
            text: 'On a multiplié le numérateur et le dénominateur par 2.',
          },
          {
            who: 'teacher',
            text: 'Bien. Maintenant, chacun.e écrit sur son ardoise une fraction égale à 3/5, et on lève les ardoises tous ensemble.',
          },
        ],
        question:
          "Qu'apprend l'enseignant cette fois ? Que fera-t-il si plusieurs ardoises sont fausses ?",
      },
    ],
    explanation: {
      bad: "Dans l'exemple 1, la question n'admet que oui ou non : Glodie a une chance sur deux de deviner, et la classe répond « oui » par habitude. Personne n'ose dire qu'il ou elle n'a pas compris.",
      good: "Dans l'exemple 2, l'enseignant demande d'expliquer le raisonnement, puis fait répondre toute la classe en même temps. Il voit d'un coup d'œil qui a compris et peut réexpliquer tout de suite à ceux et celles qui se trompent.",
    },
    activities: [
      {
        title: 'Activité 1',
        context: "Cours de chimie en 4e, sur l'équilibrage des équations.",
        dialogue: [
          {
            who: 'teacher',
            text: "J'ai équilibré l'équation au tableau : 2 H₂ + O₂ → 2 H₂O. C'est clair pour tout le monde ?",
          },
          {who: 'class', text: 'Oui, madame.'},
          {
            who: 'teacher',
            text: 'Parfait. Recopiez, et nous passons au chapitre suivant.',
          },
        ],
        question:
          "Comment l'enseignante pourrait-elle savoir qui sait vraiment équilibrer une équation ?",
      },
      {
        title: 'Activité 2',
        context: 'Même classe, même notion, avec une autre façon de vérifier.',
        dialogue: [
          {
            who: 'teacher',
            text: 'Avant de continuer, équilibrez seul.e.s cette équation : H₂ + Cl₂ → HCl. Vous avez deux minutes.',
          },
          {
            who: 'teacher',
            text: 'Bienvenu, quel coefficient as-tu mis devant HCl ?',
          },
          {who: 'learner', name: 'Bienvenu', text: '2, madame.'},
          {who: 'teacher', text: 'Pourquoi 2 ?'},
          {
            who: 'learner',
            name: 'Bienvenu',
            text: "Parce qu'il y a deux atomes de chlore à gauche et un seul dans HCl.",
          },
          {
            who: 'teacher',
            text: 'Très bien. Levez la main si vous avez trouvé autre chose : nous allons voir ensemble où ça bloque.',
          },
        ],
        question:
          "Quelles stratégies l'enseignante utilise-t-elle ? Qu'apprend-elle sur sa classe ?",
      },
    ],
    responses: [
      "« C'est clair pour tout le monde ? » ne vérifie rien. Les apprenant.e.s qui n'ont pas compris ne le disent pas, et l'enseignante passe à la suite sans le savoir.",
      "L'enseignante fait faire un court exercice individuel, demande de justifier la réponse et invite ceux et celles qui se sont trompé.e.s à le dire. Elle sait qui a compris et peut corriger aussitôt.",
    ],
    next: 'Pour la tâche, chaque enseignant.e va prévoir des moments de vérification dans une prochaine séance.',
    task: "Dans la fiche de préparation d'une prochaine séance, prévoyez trois moments de vérification de la compréhension : une question ouverte, un court exercice individuel et une réponse de toute la classe (ardoises ou mains levées). Notez ce que vous ferez si une partie de la classe n'a pas compris.",
  },
};
