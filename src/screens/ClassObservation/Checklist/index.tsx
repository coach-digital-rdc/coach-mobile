import React, {useEffect, useState} from 'react';
import {
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  TextArea,
  VStack,
  useTheme,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useLocation, useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {ChecklistService} from '../../../services/checklist.service';
import {SessionService} from '../../../services/session.service';
import {TeacherService} from '../../../services/teacher.service';
import {ChecklistItem, Documentation} from '../../../types/checklist';
import {Session} from '../../../types/session';
import PhaseStepper from '../../../components/PhaseStepper';
import SessionStrip from '../../../components/SessionStrip';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page from '../../../components/Page';

type Entry = Partial<Documentation> & {changed?: boolean};

const YesNo: React.FC<{
  value?: number | boolean | null;
  disabled: boolean;
  onChange: (value: number) => void;
}> = ({value, disabled, onChange}) => {
  const {t} = useTranslation();
  const choices = [
    {value: 1, label: t('answer.yes'), color: 'green.200'},
    {value: 0, label: t('answer.no'), color: 'red.200'},
  ];

  return (
    <HStack space={2}>
      {choices.map(choice => {
        const selected =
          value !== null &&
          value !== undefined &&
          Number(value) === choice.value;
        return (
          <TouchableOpacity
            key={choice.value}
            disabled={disabled}
            accessibilityRole="radio"
            accessibilityState={{checked: selected, disabled}}
            onPress={() => onChange(choice.value)}>
            <Text
              minW="64px"
              px="14px"
              py="6px"
              textAlign="center"
              fontSize="14px"
              borderWidth="1px"
              borderRadius="8px"
              overflow="hidden"
              borderColor={selected ? choice.color : 'gray.300'}
              bg={selected ? choice.color : 'white'}
              color={selected ? 'white' : 'gray.700'}
              fontWeight={selected ? 600 : 400}>
              {choice.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};

// "Checklist documentaire" of the mockups (B12): the 15 documents are checked during the preparation,
// and those that could not be checked are completed after the observation. It is not part of the rating.
const ClassObservationChecklist: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {state} = useLocation();
  const sessionId: string = state?.session?.id;
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [entries, setEntries] = useState<{[itemId: string]: Entry}>({});
  const [session, setSession] = useState<Session>();
  const [teacherName, setTeacherName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      ChecklistService.listItems(),
      ChecklistService.getSessionAnswers(sessionId),
      SessionService.getSessionById(sessionId),
    ]).then(([checklist, answers, current]) => {
      setItems(checklist);
      setEntries(
        answers.reduce(
          (map, answer) => ({...map, [answer.checklist_item_id]: answer}),
          {},
        ),
      );
      setSession(current);
      if (current?.teacher_id) {
        TeacherService.getTeacherDetails(current.teacher_id).then(teacher =>
          setTeacherName(teacher?.name || ''),
        );
      }
    });
  }, [sessionId]);

  const preparing = session?.session_status === 'PREPARATION';
  const observing = session?.session_status === 'OBSERVATION';
  const phase = preparing ? 'PREPARATION' : 'EVALUATION';

  const change = (itemId: string, value: Partial<Documentation>) =>
    setEntries(current => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        ...value,
        // The step is recorded when the answer is given or changed
        ...(value.answer !== undefined && {filled_in_phase: phase}),
        changed: true,
      },
    }));

  const answered = items.filter(
    item =>
      entries[item.id]?.answer !== undefined &&
      entries[item.id]?.answer !== null,
  ).length;
  const remaining = items.length - answered;

  const save = () =>
    ChecklistService.saveAnswers(
      sessionId,
      Object.keys(entries)
        .filter(itemId => entries[itemId].changed)
        .map(itemId => ({...entries[itemId], checklist_item_id: itemId})),
    );

  // The session stays open: it can be resumed from the teacher profile
  const goBack = async () => {
    if (!observing) {
      await save();
    }
    if (state?.returnTo) {
      navigate(state.returnTo.path, {
        replace: true,
        state: state.returnTo.state,
      });
    } else {
      navigate(
        PathRoutes.teacher.details.replace(':id', session?.teacher_id || ''),
        {replace: true},
      );
    }
  };

  const handleStart = async () => {
    setIsSaving(true);
    await save();
    await SessionService.startObservation(sessionId);
    navigate(PathRoutes.classObservation.form, {
      replace: true,
      state: {session: {id: sessionId, teacher_id: session?.teacher_id}},
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await goBack();
  };

  const renderItem = (item: ChecklistItem) => {
    const entry = entries[item.id] || {};
    const isNo =
      entry.answer !== null &&
      entry.answer !== undefined &&
      Number(entry.answer) === 0;

    return (
      <VStack
        key={item.id}
        mb="10px"
        p="12px"
        borderWidth="1px"
        borderRadius="12px"
        borderColor={isNo ? 'red.100' : 'gray.200'}>
        <HStack space="10px">
          <Center w="26px" h="26px" borderRadius="13px" bg="primary.0">
            <Text fontSize="12px" fontWeight={700} color="primary.200">
              {item.code}
            </Text>
          </Center>
          <VStack flex={1}>
            <Text fontSize="15px" fontWeight={600} color="gray.700">
              {item.document_name}
            </Text>
            <Text mt="2px" fontSize="13px" color="gray.600">
              {item.statement}
            </Text>
          </VStack>
        </HStack>
        <HStack
          mt="10px"
          pl="36px"
          space={2}
          alignItems="center"
          justifyContent="space-between">
          <YesNo
            value={entry.answer}
            disabled={observing}
            onChange={answer => change(item.id, {answer})}
          />
          {!!entry.filled_in_phase && (
            <Text
              px="8px"
              borderRadius="999px"
              overflow="hidden"
              fontSize="11px"
              fontWeight={600}
              bg="gray.100"
              color="gray.600">
              {entry.filled_in_phase === 'PREPARATION'
                ? t('classObservation.checklist.before')
                : t('classObservation.checklist.after')}
            </Text>
          )}
        </HStack>
        {isNo && (
          <VStack mt="10px" pl="36px" space="4px">
            <Text fontSize="13px" fontWeight={500} color="gray.700">
              {t('classObservation.checklist.proposal')}
            </Text>
            <TextArea
              h="64px"
              autoCompleteType="off"
              isReadOnly={observing}
              value={entry.proposal || ''}
              placeholder={
                t('classObservation.checklist.proposal-placeholder') || ''
              }
              onChangeText={proposal => change(item.id, {proposal})}
            />
          </VStack>
        )}
      </VStack>
    );
  };

  if (!session) {
    return (
      <Center bg="white" w="full" h="full">
        <Spinner size="lg" />
      </Center>
    );
  }

  const groups = [
    {
      owner: 'TEACHER',
      title: t('classObservation.checklist.teacher-documents'),
    },
    {
      owner: 'LEARNER',
      title: t('classObservation.checklist.learner-documents'),
    },
  ];

  return (
    <Page back title={t('classObservation.title')} onBack={goBack} noPadding>
      <PhaseStepper
        current={
          observing ? 'observation' : preparing ? 'preparation' : 'evaluation'
        }
      />
      <ScrollView flex={1} px="16px" showsVerticalScrollIndicator={false}>
        <SessionStrip teacher={teacherName} detail={session.subject} />
        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.checklist.title')}
        </Text>
        <Text mt="8px" fontSize="14px" color="gray.600">
          {observing
            ? t('classObservation.checklist.subtitle-observing')
            : preparing
            ? t('classObservation.checklist.subtitle-before')
            : t('classObservation.checklist.subtitle-after')}
        </Text>

        {groups.map(group => (
          <VStack key={group.owner}>
            <Text
              mt="20px"
              mb="10px"
              fontSize="18px"
              fontWeight={700}
              color="gray.700">
              {group.title}
            </Text>
            {items.filter(item => item.owner === group.owner).map(renderItem)}
          </VStack>
        ))}
      </ScrollView>

      <VStack
        px="16px"
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
          bg={remaining === 0 ? 'green.0' : 'yellow.0'}>
          <Icon
            name="file-check"
            size={18}
            color={
              remaining === 0
                ? theme.colors.green['300']
                : theme.colors.yellow['300']
            }
          />
          <Text
            flex={1}
            fontSize="13px"
            color={remaining === 0 ? 'green.300' : 'yellow.300'}>
            {t('classObservation.checklist.status', {
              count: answered,
              total: items.length,
            })}
            {remaining > 0 &&
              (preparing
                ? t('classObservation.checklist.status-later_interval', {
                    postProcess: 'interval',
                    count: remaining,
                  })
                : t('classObservation.checklist.status-left', {
                    count: remaining,
                  }))}
          </Text>
        </HStack>
        {observing ? (
          <Button w="full" mb={0} variant="outlined" onPress={goBack}>
            {t('classObservation.checklist.back-to-observation')}
          </Button>
        ) : (
          <Button
            w="full"
            mb={0}
            isLoading={isSaving}
            onPress={preparing ? handleStart : handleSave}>
            {preparing
              ? t('classObservation.checklist.start')
              : t('classObservation.checklist.save')}
          </Button>
        )}
      </VStack>
    </Page>
  );
};

export default ClassObservationChecklist;
