import React, {useEffect, useState} from 'react';
import {
  Box,
  Center,
  HStack,
  ScrollView,
  Spinner,
  Stack,
  Text,
  TextArea,
  VStack,
  useTheme,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {isTablet} from 'react-native-device-info';
import {useLocation, useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {v4 as uuid} from 'uuid';
import CompetenceService from '../../../services/competence.service';
import {SessionService} from '../../../services/session.service';
import {TeacherService} from '../../../services/teacher.service';
import {ScoreService} from '../../../services/score.service';
import {PdpService} from '../../../services/pdp.service';
import {Competence} from '../../../types/competence';
import {Session} from '../../../types/session';
import {
  Category,
  DiagnosticEntry,
  Pdp,
  PdpLibraryItem,
  PdpObjective,
  PdpRuleSet,
} from '../../../types/pdp';
import {getSuggestedScore} from '../../../helpers/answer.helper';
import {
  diagnose,
  generateObjectives,
  getAnswerCode,
  getDiagnosticConfig,
  getDueDate,
  toObjective,
} from '../../../helpers/pdp.helper';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PhaseStepper from '../../../components/PhaseStepper';
import SessionStrip from '../../../components/SessionStrip';
import FormField from '../../../components/FormField';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page, {GUTTER} from '../../../components/Page';

// Colours of an answer: strong in green, medium in yellow, weak in red, N/A in grey
const ANSWER_TONES: {[code: string]: [string, string]} = {
  YES: ['green.0', 'green.300'],
  HIGH: ['green.0', 'green.300'],
  MEDIUM: ['yellow.0', 'yellow.300'],
  LOW: ['red.0', 'red.300'],
  NO: ['red.0', 'red.300'],
  NA: ['gray.100', 'gray.600'],
};

const CATEGORY_TONES: {[category: string]: [string, string]} = {
  STRENGTH: ['green.0', 'green.300'],
  CONSOLIDATE: ['yellow.0', 'yellow.300'],
  PRIORITY: ['red.0', 'red.300'],
};

const Chip: React.FC<{label: string; tone: [string, string]}> = ({
  label,
  tone,
}) => (
  <Text
    px="8px"
    borderRadius="999px"
    overflow="hidden"
    fontSize="11px"
    fontWeight={600}
    bg={tone[0]}
    color={tone[1]}>
    {label}
  </Text>
);

const Card: React.FC<{
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}> = ({title, extra, children}) => (
  <VStack
    mb="16px"
    p="12px"
    borderWidth="1px"
    borderRadius="12px"
    borderColor="gray.200">
    <HStack mb="8px" alignItems="center" justifyContent="space-between">
      <Text fontSize="16px" fontWeight={700} color="gray.700">
        {title}
      </Text>
      {extra}
    </HStack>
    {children}
  </VStack>
);

// "Plan de développement professionnel" of the mockups (B23): draft generated from the
// scoring with the published rules, adjusted with the teacher, then validated.
const ClassObservationPdp: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {state} = useLocation();
  const sessionId: string = state?.session?.id;
  const [session, setSession] = useState<Session>();
  const [teacherName, setTeacherName] = useState('');
  const [competencies, setCompetencies] = useState<Competence[]>([]);
  const [answers, setAnswers] = useState<{[questionId: string]: number}>({});
  const [scores, setScores] = useState<{[competenceId: string]: number}>({});
  const [suggested, setSuggested] = useState<{[competenceId: string]: number}>(
    {},
  );
  const [ruleSet, setRuleSet] = useState<PdpRuleSet>();
  const [library, setLibrary] = useState<{
    [questionId: string]: PdpLibraryItem;
  }>({});
  const [diagnostic, setDiagnostic] = useState<DiagnosticEntry[]>([]);
  const [pdp, setPdp] = useState<Pdp>();
  const [objectives, setObjectives] = useState<PdpObjective[]>([]);
  const [openCompetence, setOpenCompetence] = useState<string>();
  const [editingId, setEditingId] = useState<string>();
  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [missingRules, setMissingRules] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [current, grid, savedAnswers, savedScores, rules, saved] =
        await Promise.all([
          SessionService.getSessionById(sessionId),
          CompetenceService.listCompetenciesWithQuestions(),
          SessionService.getAnswersMap(sessionId),
          ScoreService.getScores(sessionId),
          PdpService.getPublishedRuleSet(),
          PdpService.getPdp(sessionId),
        ]);
      setSession(current);
      setCompetencies(grid);
      setAnswers(savedAnswers);
      if (current?.teacher_id) {
        TeacherService.getTeacherDetails(current.teacher_id).then(teacher =>
          setTeacherName(teacher?.name || ''),
        );
      }
      if (!rules) {
        setMissingRules(true);
        return;
      }

      const effective: {[competenceId: string]: number} = {};
      const proposed: {[competenceId: string]: number} = {};
      for (const competence of grid.filter(item => item.has_global_score)) {
        const value = getSuggestedScore(competence.questions, savedAnswers);
        if (value !== undefined) {
          proposed[competence.id] = value;
        }
        const score = savedScores[competence.id]?.value ?? value;
        if (score !== undefined && score !== null) {
          effective[competence.id] = score;
        }
      }
      setScores(effective);
      setSuggested(proposed);

      const items = await PdpService.getLibrary(rules.id);
      const entries = diagnose(
        grid,
        savedAnswers,
        effective,
        getDiagnosticConfig(rules),
      );
      const copy = JSON.stringify(entries);
      setRuleSet(rules);
      setLibrary(items);
      setDiagnostic(entries);

      // A new draft is generated when the scoring has changed, unless the plan is validated
      if (
        saved &&
        (saved.pdp.status === 'VALIDATED' || saved.pdp.diagnostic === copy)
      ) {
        setPdp(saved.pdp);
        setObjectives(saved.objectives);
        return;
      }
      const pdpId = await PdpService.saveDraft(
        sessionId,
        rules,
        copy,
        saved?.pdp.id,
      );
      const draft = generateObjectives(entries, items, rules, pdpId);
      await PdpService.saveObjectives(pdpId, draft);
      setPdp((await PdpService.getPdp(sessionId))?.pdp);
      setObjectives(draft);
    };
    load();
  }, [sessionId]);

  const validated = pdp?.status === 'VALIDATED';
  const config = ruleSet ? getDiagnosticConfig(ruleSet) : undefined;
  const maxObjectives = ruleSet?.max_objectives || 3;
  const full = objectives.length >= maxObjectives;
  const questions = competencies.flatMap(competence =>
    competence.questions.map(question => ({...question, competence})),
  );
  const questionById = (id?: string | null) =>
    questions.find(question => question.id === id);

  const save = async (next: PdpObjective[]) => {
    setObjectives(next);
    if (pdp) {
      await PdpService.saveObjectives(pdp.id, next);
    }
  };

  const updateObjective = (id: string, change: Partial<PdpObjective>) =>
    setObjectives(current =>
      current.map(objective =>
        objective.id === id
          ? {
              ...objective,
              ...change,
              origin: objective.origin === 'ADDED' ? 'ADDED' : 'EDITED',
            }
          : objective,
      ),
    );

  const move = (index: number, delta: number) => {
    const next = [...objectives];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    save(next);
  };

  const regenerate = () => {
    if (ruleSet && pdp) {
      setEditingId(undefined);
      save(generateObjectives(diagnostic, library, ruleSet, pdp.id));
    }
  };

  const addFromDiagnostic = (entry: DiagnosticEntry) => {
    if (pdp && config) {
      save([
        ...objectives,
        toObjective(
          entry,
          library,
          pdp.id,
          objectives.length + 1,
          getDueDate(config),
        ),
      ]);
    }
    setAdding(false);
  };

  const addFree = () => {
    if (pdp && config) {
      const objective: PdpObjective = {
        id: uuid(),
        pdp_id: pdp.id,
        question_id: null,
        category: 'CONSOLIDATE',
        rank: objectives.length + 1,
        objective: '',
        actions: '',
        indicator: '',
        due_date: getDueDate(config),
        origin: 'ADDED',
      };
      setObjectives(current => [...current, objective]);
      setEditingId(objective.id);
    }
    setAdding(false);
  };

  const validate = async () => {
    if (pdp) {
      await PdpService.saveObjectives(pdp.id, objectives);
      const validatedAt = await PdpService.validate(pdp.id);
      setPdp({...pdp, status: 'VALIDATED', validated_at: validatedAt});
    }
    setConfirm(false);
  };

  const goToScoring = () =>
    navigate(PathRoutes.classObservation.form, {
      replace: true,
      state: {session: {id: sessionId}},
    });

  // Next step of the session: advice and times
  const handleContinue = () =>
    navigate(PathRoutes.classObservation.advice, {
      replace: true,
      state: {session: {id: sessionId}},
    });

  // The session stays open: it can be resumed from the teacher profile
  const goBack = () =>
    navigate(
      PathRoutes.teacher.details.replace(':id', session?.teacher_id || ''),
      {replace: true},
    );

  if (missingRules) {
    return (
      <Page back title={t('classObservation.pdp.title')} onBack={goBack}>
        <Center flex={1}>
          <Text textAlign="center" color="gray.600">
            {t('classObservation.pdp.missing-rules')}
          </Text>
        </Center>
      </Page>
    );
  }

  if (!session || !pdp || !ruleSet) {
    return (
      <Center bg="white" w="full" h="full">
        <Spinner size="lg" />
      </Center>
    );
  }

  const usedQuestions = objectives.map(objective => objective.question_id);
  const candidates = diagnostic.filter(
    entry =>
      entry.category !== 'STRENGTH' &&
      !usedQuestions.includes(entry.question_id),
  );
  const incomplete =
    objectives.length === 0 ||
    objectives.some(objective => !objective.objective.trim());
  const categoryLabel = (category: Category) =>
    t(`classObservation.pdp.category.${category}`);
  const gridOrder = questions.map(question => question.id);

  const renderObjective = (objective: PdpObjective, index: number) => {
    const editing = editingId === objective.id && !validated;
    const question = questionById(objective.question_id);
    const entry = diagnostic.find(
      item => item.question_id === objective.question_id,
    );
    const actions = objective.actions
      .split('\n')
      .filter(action => action.trim());

    return (
      <VStack
        key={objective.id}
        mb="12px"
        p="12px"
        borderWidth="1px"
        borderRadius="12px"
        borderColor="gray.200">
        <HStack space={2} alignItems="center">
          <Center w="24px" h="24px" borderRadius="12px" bg="primary.200">
            <Text fontSize="12px" fontWeight={700} color="white">
              {index + 1}
            </Text>
          </Center>
          <Chip
            label={categoryLabel(objective.category)}
            tone={CATEGORY_TONES[objective.category]}
          />
          <Chip
            label={t(`classObservation.pdp.origin.${objective.origin}`)}
            tone={['gray.100', 'gray.600']}
          />
          {!validated && (
            <HStack flex={1} space={3} justifyContent="flex-end">
              <TouchableOpacity
                disabled={index === 0}
                accessibilityLabel={t('classObservation.pdp.up')}
                onPress={() => move(index, -1)}>
                <Icon
                  name="arrow-up"
                  size={16}
                  color={theme.colors.gray[index === 0 ? '300' : '600']}
                />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={index === objectives.length - 1}
                accessibilityLabel={t('classObservation.pdp.down')}
                onPress={() => move(index, 1)}>
                <Icon
                  name="arrow-down"
                  size={16}
                  color={
                    theme.colors.gray[
                      index === objectives.length - 1 ? '300' : '600'
                    ]
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={t('classObservation.pdp.edit')}
                onPress={() =>
                  setEditingId(editing ? undefined : objective.id)
                }>
                <Icon
                  name="pen"
                  size={16}
                  color={theme.colors.primary['200']}
                />
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityLabel={t('classObservation.pdp.remove')}
                onPress={() =>
                  save(objectives.filter(item => item.id !== objective.id))
                }>
                <Icon
                  name="trash-alt"
                  size={16}
                  color={theme.colors.red['200']}
                />
              </TouchableOpacity>
            </HStack>
          )}
        </HStack>

        {!!question && (
          <VStack mt="8px" p="8px" borderRadius="8px" bg="gray.100">
            <Text fontSize="13px" color="gray.700">
              <Text fontWeight={700}>{question.code}</Text> {t(question.title)}
            </Text>
            {!!entry && (
              <Text mt="2px" fontSize="12px" color="gray.600">
                {t('classObservation.pdp.reason', {
                  answer: t(`classObservation.pdp.answer.${entry.answer}`),
                })}
                {entry.low_score !== undefined &&
                  t('classObservation.pdp.reason-score', {
                    code: question.competence.code,
                    score: entry.low_score,
                  })}
              </Text>
            )}
          </VStack>
        )}

        {editing ? (
          <VStack mt="4px">
            <Text mt="10px" fontSize="13px" fontWeight={500} color="gray.700">
              {t('classObservation.pdp.objective')}
            </Text>
            <TextArea
              mt="4px"
              h="64px"
              autoCompleteType="off"
              value={objective.objective}
              onChangeText={value =>
                updateObjective(objective.id, {objective: value})
              }
            />
            <Text mt="10px" fontSize="13px" fontWeight={500} color="gray.700">
              {t('classObservation.pdp.actions-input')}
            </Text>
            <TextArea
              mt="4px"
              h="80px"
              autoCompleteType="off"
              value={objective.actions}
              onChangeText={value =>
                updateObjective(objective.id, {actions: value})
              }
            />
            <FormField
              label={t('classObservation.pdp.indicator')}
              value={objective.indicator}
              onChangeText={value =>
                updateObjective(objective.id, {indicator: value})
              }
            />
            <FormField
              label={t('classObservation.pdp.due-date-input')}
              value={objective.due_date}
              placeholder="2027-01-15"
              onChangeText={value =>
                updateObjective(objective.id, {due_date: value})
              }
            />
            <HStack mt="10px" justifyContent="flex-end">
              <Button
                mb={0}
                py="6px"
                onPress={() => {
                  setEditingId(undefined);
                  save(objectives);
                }}>
                {t('classObservation.pdp.done')}
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack mt="8px" space="6px">
            <VStack>
              <Text fontSize="12px" fontWeight={600} color="gray.500">
                {t('classObservation.pdp.objective')}
              </Text>
              <Text fontSize="14px" color="gray.700">
                {objective.objective || t('classObservation.pdp.to-fill')}
              </Text>
            </VStack>
            {actions.length > 0 && (
              <VStack>
                <Text fontSize="12px" fontWeight={600} color="gray.500">
                  {t('classObservation.pdp.actions')}
                </Text>
                {actions.map(action => (
                  <Text key={action} fontSize="14px" color="gray.700">
                    • {action}
                  </Text>
                ))}
              </VStack>
            )}
            {!!objective.indicator && (
              <VStack>
                <Text fontSize="12px" fontWeight={600} color="gray.500">
                  {t('classObservation.pdp.indicator')}
                </Text>
                <Text fontSize="14px" color="gray.700">
                  {objective.indicator}
                </Text>
              </VStack>
            )}
            <VStack>
              <Text fontSize="12px" fontWeight={600} color="gray.500">
                {t('classObservation.pdp.due-date')}
              </Text>
              <Text fontSize="14px" color="gray.700">
                {moment(objective.due_date, 'YYYY-MM-DD').isValid()
                  ? moment(objective.due_date, 'YYYY-MM-DD').format('L')
                  : objective.due_date}
              </Text>
            </VStack>
          </VStack>
        )}
      </VStack>
    );
  };

  return (
    <Page
      back
      title={t('classObservation.pdp.title')}
      onBack={goBack}
      noPadding>
      <PhaseStepper current="evaluation" />
      <ScrollView flex={1} px={GUTTER} showsVerticalScrollIndicator={false}>
        <SessionStrip teacher={teacherName} detail={session.subject} />
        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.pdp.heading')}
        </Text>
        <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
          {t('classObservation.pdp.subtitle', {
            version: ruleSet.version,
            date: ruleSet.published_at
              ? moment(ruleSet.published_at).format('L')
              : '—',
          })}
        </Text>

        {/* Summary and diagnostic side by side on a tablet, as in the mockups */}
        <Stack
          direction={isTablet() ? 'row' : 'column'}
          space={isTablet() ? 4 : 0}>
          <Box flex={isTablet() ? 3 : undefined}>
            <Card
              title={t('classObservation.pdp.summary')}
              extra={
                <HStack
                  px="8px"
                  space={1}
                  alignItems="center"
                  borderRadius="999px"
                  bg="gray.100">
                  <Icon
                    name="lock"
                    size={12}
                    color={theme.colors.gray['600']}
                  />
                  <Text fontSize="11px" fontWeight={600} color="gray.600">
                    {t('classObservation.pdp.read-only')}
                  </Text>
                </HStack>
              }>
              {competencies.map(competence => {
                const score = scores[competence.id];
                const open = openCompetence === competence.id;
                const tone: [string, string] =
                  score === undefined
                    ? ['gray.100', 'gray.600']
                    : config && score <= config.priority_threshold
                    ? ['red.0', 'red.300']
                    : score >= 4
                    ? ['green.0', 'green.300']
                    : ['yellow.0', 'yellow.300'];
                return (
                  <VStack
                    key={competence.id}
                    py="8px"
                    borderTopWidth="1px"
                    borderTopColor="gray.100">
                    <TouchableOpacity
                      accessibilityState={{expanded: open}}
                      onPress={() =>
                        setOpenCompetence(open ? undefined : competence.id)
                      }>
                      <HStack space={2} alignItems="center">
                        <Text
                          w="36px"
                          fontSize="13px"
                          fontWeight={700}
                          color="gray.600">
                          {competence.code}
                        </Text>
                        <Text flex={1} fontSize="14px" color="gray.700">
                          {competence.title}
                        </Text>
                        <Chip
                          label={
                            competence.has_global_score ? `${score}/5` : '—'
                          }
                          tone={tone}
                        />
                        <Icon
                          name={open ? 'angle-down' : 'angle-right'}
                          size={18}
                          color={theme.colors.gray['500']}
                        />
                      </HStack>
                    </TouchableOpacity>
                    <HStack mt="6px" pl="44px" flexWrap="wrap">
                      {competence.questions.map(question => {
                        const code =
                          getAnswerCode(question, answers[question.id]) || 'NA';
                        const [bg, color] = ANSWER_TONES[code];
                        return (
                          <Center
                            key={question.id}
                            mr="4px"
                            mb="4px"
                            w="22px"
                            h="22px"
                            borderRadius="11px"
                            bg={bg}>
                            <Text
                              fontSize="10px"
                              fontWeight={700}
                              color={color}>
                              {t(`classObservation.pdp.short.${code}`)}
                            </Text>
                          </Center>
                        );
                      })}
                      {competence.has_global_score &&
                        suggested[competence.id] !== undefined &&
                        suggested[competence.id] !== score && (
                          <Text fontSize="11px" color="gray.500">
                            {t('classObservation.pdp.score-note', {
                              suggested: suggested[competence.id],
                              score,
                            })}
                          </Text>
                        )}
                    </HStack>
                    {open &&
                      competence.questions.map(question => {
                        const code =
                          getAnswerCode(question, answers[question.id]) || 'NA';
                        return (
                          <HStack
                            key={question.id}
                            mt="6px"
                            pl="44px"
                            space={2}
                            alignItems="flex-start">
                            <Text
                              w="36px"
                              fontSize="12px"
                              fontWeight={600}
                              color="gray.600">
                              {question.code}
                            </Text>
                            <Text flex={1} fontSize="12px" color="gray.700">
                              {t(question.title)}
                            </Text>
                            <Chip
                              label={t(`classObservation.pdp.answer.${code}`)}
                              tone={ANSWER_TONES[code]}
                            />
                          </HStack>
                        );
                      })}
                  </VStack>
                );
              })}
            </Card>
          </Box>
          <Box flex={isTablet() ? 2 : undefined}>
            <Card title={t('classObservation.pdp.diagnostic')}>
              {(['STRENGTH', 'CONSOLIDATE', 'PRIORITY'] as Category[]).map(
                category => {
                  const entries = diagnostic
                    .filter(entry => entry.category === category)
                    .sort(
                      (a, b) =>
                        gridOrder.indexOf(a.question_id) -
                        gridOrder.indexOf(b.question_id),
                    );
                  const [bg, color] = CATEGORY_TONES[category];
                  return (
                    <VStack
                      key={category}
                      mb="8px"
                      p="8px"
                      borderRadius="8px"
                      bg={bg}>
                      <Text fontSize="13px" fontWeight={700} color={color}>
                        {t(`classObservation.pdp.group.${category}`)} (
                        {entries.length})
                      </Text>
                      <HStack mt="4px" flexWrap="wrap">
                        {entries.map(entry => (
                          <Text
                            key={entry.question_id}
                            mr="4px"
                            mb="4px"
                            px="6px"
                            borderRadius="6px"
                            overflow="hidden"
                            fontSize="12px"
                            fontWeight={600}
                            bg="white"
                            color={color}>
                            {questionById(entry.question_id)?.code}
                          </Text>
                        ))}
                      </HStack>
                    </VStack>
                  );
                },
              )}
            </Card>
          </Box>
        </Stack>

        <HStack mb="8px" alignItems="center" justifyContent="space-between">
          <Text fontSize="18px" fontWeight={700} color="gray.700">
            {t('classObservation.pdp.objectives', {
              count: objectives.length,
              max: maxObjectives,
            })}
          </Text>
          {validated ? (
            <Chip
              label={t('classObservation.pdp.validated')}
              tone={['green.0', 'green.300']}
            />
          ) : (
            <Text
              px="8px"
              py="4px"
              fontSize="14px"
              fontWeight={600}
              color="primary.200"
              onPress={regenerate}>
              {t('classObservation.pdp.regenerate')}
            </Text>
          )}
        </HStack>

        {objectives.map(renderObjective)}

        {!validated &&
          (adding ? (
            <Card
              title={t('classObservation.pdp.add')}
              extra={
                <TouchableOpacity onPress={() => setAdding(false)}>
                  <Icon
                    name="times"
                    size={18}
                    color={theme.colors.gray['600']}
                  />
                </TouchableOpacity>
              }>
              {candidates.map(entry => (
                <TouchableOpacity
                  key={entry.question_id}
                  onPress={() => addFromDiagnostic(entry)}>
                  <HStack
                    py="8px"
                    space={2}
                    alignItems="flex-start"
                    borderTopWidth="1px"
                    borderTopColor="gray.100">
                    <Chip
                      label={categoryLabel(entry.category)}
                      tone={CATEGORY_TONES[entry.category]}
                    />
                    <Text flex={1} fontSize="13px" color="gray.700">
                      <Text fontWeight={700}>
                        {questionById(entry.question_id)?.code}
                      </Text>{' '}
                      {library[entry.question_id]?.objective}
                    </Text>
                  </HStack>
                </TouchableOpacity>
              ))}
              <Button mt="8px" mb={0} variant="outlined" onPress={addFree}>
                {t('classObservation.pdp.free')}
              </Button>
            </Card>
          ) : (
            <Button
              mb="16px"
              variant="outlined"
              disabled={full}
              onPress={() => setAdding(true)}>
              {full
                ? t('classObservation.pdp.max', {max: maxObjectives})
                : t('classObservation.pdp.add')}
            </Button>
          ))}
      </ScrollView>

      <VStack
        px={GUTTER}
        pb="16px"
        pt="8px"
        borderTopWidth="1px"
        borderTopColor="gray.200">
        <HStack
          mb="8px"
          p="8px"
          space={2}
          alignItems="center"
          borderRadius="10px"
          bg={validated ? 'green.0' : 'primary.0'}>
          <Icon
            name={validated ? 'check-circle-solid' : 'info-circle'}
            size={18}
            color={
              validated
                ? theme.colors.green['300']
                : theme.colors.primary['200']
            }
          />
          <Text
            flex={1}
            fontSize="13px"
            color={validated ? 'green.300' : 'primary.200'}>
            {validated
              ? t('classObservation.pdp.validated-at', {
                  time: moment(pdp.validated_at).format('HH:mm'),
                })
              : t('classObservation.pdp.editable')}
          </Text>
        </HStack>
        {validated ? (
          <Button w="full" mb={0} onPress={handleContinue}>
            {t('classObservation.pdp.continue')}
          </Button>
        ) : (
          <HStack space={3}>
            <Button flex={1} mb={0} variant="outlined" onPress={goToScoring}>
              {t('classObservation.pdp.back-to-scoring')}
            </Button>
            <Button
              flex={1}
              mb={0}
              disabled={incomplete || editingId !== undefined}
              onPress={() => setConfirm(true)}>
              {t('classObservation.pdp.validate')}
            </Button>
          </HStack>
        )}
      </VStack>

      <ConfirmDialog
        isOpen={confirm}
        title={t('classObservation.pdp.validate-title')}
        message={t('classObservation.pdp.validate-message_interval', {
          postProcess: 'interval',
          count: objectives.length,
        })}
        confirmLabel={t('classObservation.pdp.validate-confirm')}
        onConfirm={validate}
        onCancel={() => setConfirm(false)}
      />
    </Page>
  );
};

export default ClassObservationPdp;
