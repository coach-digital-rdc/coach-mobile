import React, {useEffect, useState} from 'react';
import {
  Center,
  HStack,
  Modal,
  ScrollView,
  Spinner,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useLocation, useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import CompetenceService from '../../../services/competence.service';
import {SessionService} from '../../../services/session.service';
import {TeacherService} from '../../../services/teacher.service';
import {NoteService} from '../../../services/note.service';
import {ScoreService} from '../../../services/score.service';
import {ChecklistService} from '../../../services/checklist.service';
import {Competence} from '../../../types/competence';
import {Question} from '../../../types/question';
import {Session} from '../../../types/session';
import {ObservationNote} from '../../../types/observation-note';
import {CompetenceScore} from '../../../types/competence-score';
import {
  NOT_APPLICABLE,
  getAnswerChoices,
  getSuggestedScore,
  toAnswers,
} from '../../../helpers/answer.helper';
import BottomSheetTooltip from './BottomSheetTooltip';
import {NoteTimeline} from '../Notes';
import PhaseStepper from '../../../components/PhaseStepper';
import SessionStrip from '../../../components/SessionStrip';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page, {GUTTER} from '../../../components/Page';

// Colour of a selected answer, as in the mockups: low in red, medium in yellow, high in green
const CHOICE_COLORS: {[label: string]: string} = {
  'answer.no': 'red.200',
  'answer.low': 'red.200',
  'answer.medium': 'yellow.200',
  'answer.yes': 'green.200',
  'answer.high': 'green.200',
  'answer.na': 'gray.600',
};

const ChoiceRow: React.FC<{
  question: Question;
  value?: number;
  onPress: (value: number) => void;
}> = ({question, value, onPress}) => {
  const {t} = useTranslation();
  const choices = getAnswerChoices(question);
  // N/A first, as in the mockups
  const ordered = [
    ...choices.filter(choice => choice.value === NOT_APPLICABLE),
    ...choices.filter(choice => choice.value !== NOT_APPLICABLE),
  ];

  return (
    <HStack mt="8px" pl="48px" space="6px">
      {ordered.map(choice => {
        const selected = value === choice.value;
        const color = CHOICE_COLORS[choice.label];
        return (
          <TouchableOpacity
            key={choice.value}
            style={{flex: 1, maxWidth: 96}}
            accessibilityRole="radio"
            accessibilityState={{checked: selected}}
            onPress={() => !selected && onPress(choice.value)}>
            <Text
              py="7px"
              textAlign="center"
              fontSize="13px"
              fontWeight={500}
              borderWidth="1px"
              borderRadius="8px"
              overflow="hidden"
              borderColor={selected ? color : 'gray.300'}
              bg={selected ? color : 'white'}
              color={selected ? 'white' : 'gray.700'}>
              {t(choice.label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};

const ScorePicker: React.FC<{
  suggested?: number;
  score?: CompetenceScore;
  onPress: (value: number) => void;
}> = ({suggested, score, onPress}) => {
  const {t} = useTranslation();
  const value = score?.value ?? suggested;
  const changed =
    suggested !== undefined &&
    score?.value !== undefined &&
    score?.value !== null &&
    score.value !== suggested;

  return (
    <VStack
      p="12px"
      borderTopWidth="1px"
      borderTopColor="gray.200"
      bg="primary.0">
      <HStack space={2} alignItems="center" justifyContent="space-between">
        <Text fontSize="14px" fontWeight={700} color="gray.700">
          {t('classObservation.form.global-score')}
        </Text>
        {suggested === undefined ? (
          <Text flex={1} textAlign="right" fontSize="12px" color="gray.500">
            {t('classObservation.form.suggested-later')}
          </Text>
        ) : (
          <Text
            px="8px"
            borderRadius="999px"
            overflow="hidden"
            fontSize="11px"
            fontWeight={600}
            bg={changed ? 'yellow.0' : 'gray.100'}
            color={changed ? 'yellow.300' : 'gray.600'}>
            {changed
              ? t('classObservation.form.changed', {value: suggested})
              : t('classObservation.form.suggested')}
          </Text>
        )}
      </HStack>
      <HStack mt="8px" space={2}>
        {[1, 2, 3, 4, 5].map(n => {
          const selected = value === n;
          return (
            <TouchableOpacity
              key={n}
              style={{flex: 1}}
              accessibilityRole="radio"
              accessibilityState={{checked: selected}}
              onPress={() => onPress(n)}>
              <Center
                h="40px"
                borderRadius="10px"
                borderWidth={selected || suggested === n ? '2px' : '1px'}
                borderStyle={!selected && suggested === n ? 'dashed' : 'solid'}
                borderColor={
                  selected || suggested === n ? 'primary.200' : 'gray.300'
                }
                bg={selected ? 'primary.200' : 'white'}>
                <Text
                  fontSize="16px"
                  fontWeight={700}
                  color={selected ? 'white' : 'gray.700'}>
                  {n}
                </Text>
              </Center>
            </TouchableOpacity>
          );
        })}
      </HStack>
    </VStack>
  );
};

// "Cotation" of the mockups (B14, B15): the 30 behaviours and the global score of the
// sub-domains, with the notes at hand. It is unlocked at the end of the observation.
const ClassObservationForm: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {state} = useLocation();
  const sessionId: string = state?.session?.id;
  const [session, setSession] = useState<Session>();
  const [teacherName, setTeacherName] = useState('');
  const [competencies, setCompetencies] = useState<Competence[]>([]);
  const [answers, setAnswers] = useState<{[questionId: string]: number}>({});
  const [scores, setScores] = useState<{
    [competenceId: string]: CompetenceScore;
  }>({});
  const [notes, setNotes] = useState<ObservationNote[]>([]);
  const [uncheckedDocuments, setUncheckedDocuments] = useState(0);
  const [closed, setClosed] = useState<string[]>([]);
  const [tooltip, setTooltip] = useState<string>();
  const [showNotes, setShowNotes] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      SessionService.getSessionById(sessionId),
      CompetenceService.listCompetenciesWithQuestions(),
      SessionService.getAnswersMap(sessionId),
      ScoreService.getScores(sessionId),
      NoteService.listNotes(sessionId),
      ChecklistService.countUnchecked(sessionId),
    ]).then(([current, grid, savedAnswers, savedScores, savedNotes, left]) => {
      setSession(current);
      setCompetencies(grid);
      setAnswers(savedAnswers);
      setScores(savedScores);
      setNotes(savedNotes);
      setUncheckedDocuments(left);
      if (current?.teacher_id) {
        TeacherService.getTeacherDetails(current.teacher_id).then(teacher =>
          setTeacherName(teacher?.name || ''),
        );
      }
    });
  }, [sessionId]);

  const suggestedScore = (competence: Competence, values = answers) =>
    getSuggestedScore(competence.questions, values);

  // Each answer is saved at once, so that the scoring can be resumed
  const answer = async (
    competence: Competence,
    question: Question,
    value: number,
  ) => {
    const next = {...answers, [question.id]: value};
    setAnswers(next);
    await SessionService.saveAnswers(
      sessionId,
      toAnswers({[question.id]: value}),
    );
    if (competence.has_global_score) {
      const score = {
        suggested_value: suggestedScore(competence, next) ?? null,
        value: scores[competence.id]?.value ?? null,
      };
      setScores(current => ({
        ...current,
        [competence.id]: {...current[competence.id], ...score},
      }));
      await ScoreService.saveScore(sessionId, competence.id, score);
    }
  };

  const setScore = async (competence: Competence, value: number) => {
    const score = {
      suggested_value: suggestedScore(competence) ?? null,
      value,
    };
    setScores(current => ({
      ...current,
      [competence.id]: {...current[competence.id], ...score},
    }));
    await ScoreService.saveScore(sessionId, competence.id, score);
  };

  const questions = competencies.flatMap(competence => competence.questions);
  const answered = questions.filter(
    question => answers[question.id] !== undefined,
  ).length;
  const scored = competencies.filter(
    competence =>
      competence.has_global_score &&
      (scores[competence.id]?.value ?? suggestedScore(competence)) !==
        undefined,
  ).length;
  const scoreTotal = competencies.filter(
    competence => competence.has_global_score,
  ).length;
  const complete = answered === questions.length && scored === scoreTotal;

  // The score kept is the one of the observer, or the suggested one
  const handleFinish = async () => {
    setIsSaving(true);
    for (const competence of competencies.filter(
      item => item.has_global_score,
    )) {
      const suggested = suggestedScore(competence);
      await ScoreService.saveScore(sessionId, competence.id, {
        suggested_value: suggested,
        value: scores[competence.id]?.value ?? suggested,
      });
    }
    navigate(PathRoutes.classObservation.pdp, {
      replace: true,
      state: {session: {id: sessionId}},
    });
  };

  // The session stays open: it can be resumed from the teacher profile
  const goBack = () =>
    navigate(
      PathRoutes.teacher.details.replace(':id', session?.teacher_id || ''),
      {replace: true},
    );

  const openChecklist = () =>
    navigate(PathRoutes.classObservation.checklist, {
      replace: true,
      state: {
        session: {id: sessionId, teacher_id: session?.teacher_id},
        returnTo: {
          path: PathRoutes.classObservation.form,
          state: {session: {id: sessionId, teacher_id: session?.teacher_id}},
        },
      },
    });

  if (!session || competencies.length === 0) {
    return (
      <Center bg="white" w="full" h="full">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (!session.observation_ended_at) {
    return (
      <Page back title={t('classObservation.title')} onBack={goBack}>
        <PhaseStepper current="observation" />
        <Center flex={1} px={GUTTER}>
          <Center w="72px" h="72px" borderRadius="36px" bg="yellow.0">
            <Icon name="lock" size={36} color={theme.colors.yellow['300']} />
          </Center>
          <Text mt="16px" fontSize="24px" fontWeight={600} color="gray.700">
            {t('classObservation.form.locked-title')}
          </Text>
          <Text mt="8px" mb="16px" textAlign="center" color="gray.600">
            {notes.length === 0
              ? t('classObservation.notes.locked')
              : t('classObservation.form.locked-end')}
          </Text>
          <Button
            onPress={() =>
              navigate(PathRoutes.classObservation.notes, {
                replace: true,
                state: {session: {id: sessionId}},
              })
            }>
            {t('classObservation.form.go-to-notes')}
          </Button>
        </Center>
      </Page>
    );
  }

  return (
    <Page back title={t('classObservation.title')} onBack={goBack} noPadding>
      <PhaseStepper current="evaluation" />
      <ScrollView flex={1} px={GUTTER} showsVerticalScrollIndicator={false}>
        <SessionStrip teacher={teacherName} detail={session.subject} />
        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.form.title')}
        </Text>
        <HStack mt="8px" space={2}>
          <Button
            mb={0}
            py="6px"
            variant="outlined"
            onPress={() => setShowNotes(true)}>
            {t('classObservation.form.notes', {count: notes.length})}
          </Button>
          <Button mb={0} py="6px" variant="outlined" onPress={openChecklist}>
            {t('classObservation.form.checklist', {
              count: 15 - uncheckedDocuments,
            })}
          </Button>
        </HStack>
        <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
          {t('classObservation.form.subtitle')}
        </Text>

        {competencies.map(competence => {
          const done = competence.questions.every(
            question => answers[question.id] !== undefined,
          );
          const isOpen = !closed.includes(competence.id);
          const numbered =
            competence.code && competence.code.includes('.')
              ? `${competence.code}. ${competence.title}`
              : competence.title;
          return (
            <VStack
              key={competence.id}
              mb="12px"
              borderWidth="1px"
              borderRadius="12px"
              borderColor="gray.200"
              overflow="hidden">
              <TouchableOpacity
                accessibilityState={{expanded: isOpen}}
                onPress={() =>
                  setClosed(current =>
                    isOpen
                      ? [...current, competence.id]
                      : current.filter(id => id !== competence.id),
                  )
                }>
                <HStack
                  p="12px"
                  space={2}
                  bg="gray.100"
                  alignItems="center"
                  justifyContent="space-between">
                  <VStack flex={1}>
                    {!!competence.domain_title &&
                      competence.domain_title !== competence.title && (
                        <Text
                          fontSize="11px"
                          fontWeight={700}
                          color="gray.500"
                          textTransform="uppercase">
                          {competence.domain_title}
                        </Text>
                      )}
                    <Text fontSize="16px" fontWeight={700} color="gray.700">
                      {numbered}
                    </Text>
                  </VStack>
                  <Icon
                    name={
                      done
                        ? 'check-circle-solid'
                        : isOpen
                        ? 'angle-down'
                        : 'angle-right'
                    }
                    size={22}
                    color={
                      done
                        ? theme.colors.green['200']
                        : theme.colors.gray['500']
                    }
                  />
                </HStack>
              </TouchableOpacity>
              {isOpen && (
                <>
                  {competence.questions.map(question => (
                    <VStack
                      key={question.id}
                      p="12px"
                      borderTopWidth="1px"
                      borderTopColor="gray.100">
                      <HStack space={2} alignItems="flex-start">
                        <Text
                          w="40px"
                          fontSize="14px"
                          fontWeight={600}
                          color="gray.600">
                          {question.code}
                        </Text>
                        <Text flex={1} fontSize="14px" color="gray.700">
                          {t(question.title)}
                        </Text>
                        {!!question.tooltip_data && (
                          <TouchableOpacity
                            accessibilityLabel={t('classObservation.form.help')}
                            onPress={() => setTooltip(question.tooltip_data)}>
                            <Icon
                              name="info-circle"
                              size={18}
                              color={theme.colors.primary['200']}
                            />
                          </TouchableOpacity>
                        )}
                      </HStack>
                      <ChoiceRow
                        question={question}
                        value={answers[question.id]}
                        onPress={value => answer(competence, question, value)}
                      />
                    </VStack>
                  ))}
                  {competence.has_global_score && (
                    <ScorePicker
                      suggested={suggestedScore(competence)}
                      score={scores[competence.id]}
                      onPress={value => setScore(competence, value)}
                    />
                  )}
                </>
              )}
            </VStack>
          );
        })}
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
          bg={complete ? 'green.0' : 'yellow.0'}>
          <Icon
            name="star"
            size={18}
            color={
              complete ? theme.colors.green['300'] : theme.colors.yellow['300']
            }
          />
          <Text
            flex={1}
            fontSize="13px"
            color={complete ? 'green.300' : 'yellow.300'}>
            {t('classObservation.form.progress', {
              answered,
              total: questions.length,
              scored,
              scoreTotal,
            })}
          </Text>
        </HStack>
        <Button
          w="full"
          mb={0}
          disabled={!complete}
          isLoading={isSaving}
          onPress={handleFinish}>
          {t('classObservation.form.button')}
        </Button>
      </VStack>

      <Modal isOpen={!!tooltip} onClose={() => setTooltip(undefined)}>
        <VStack w="full" mt="auto" p="16px" bg="white" borderTopRadius="20px">
          <BottomSheetTooltip content={tooltip || ''} />
          <Button variant="outlined" onPress={() => setTooltip(undefined)}>
            Ok
          </Button>
        </VStack>
      </Modal>

      <Modal isOpen={showNotes} onClose={() => setShowNotes(false)}>
        <VStack
          w="full"
          maxH="80%"
          mt="auto"
          p="16px"
          bg="white"
          borderTopRadius="20px">
          <Text mb="12px" fontSize="18px" fontWeight={700} color="gray.700">
            {t('classObservation.form.notes-title')}
          </Text>
          <ScrollView>
            <NoteTimeline
              notes={notes}
              start={session.observation_started_at || ''}
            />
          </ScrollView>
          <Button
            mt="8px"
            variant="outlined"
            onPress={() => setShowNotes(false)}>
            Ok
          </Button>
        </VStack>
      </Modal>
    </Page>
  );
};

export default ClassObservationForm;
