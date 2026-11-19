import React, {useEffect, useState} from 'react';
import {
  Box,
  Center,
  HStack,
  ScrollView,
  Text,
  VStack,
  useTheme,
  useToast,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useNavigate, useParams} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {useCoachContext} from '../../../providers/coach.provider';
import {TeacherService} from '../../../services/teacher.service';
import {TLCService} from '../../../services/tlc.service';
import {TLC_UNITS, tlcContent, Example, Line} from '../../../data/tlc';
import FormField from '../../../components/FormField';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import Icon from '../../../components/Icon';
import Page, {GUTTER} from '../../../components/Page';

const SECTIONS = [
  'attendance',
  'intro',
  'situations',
  'explanation',
  'activities',
  'end',
];

// Page index → section of the progress bar and label of the button that leaves the page
const PAGES = [
  {section: 0, next: 'start-intro'},
  {section: 1, next: 'next'},
  {section: 1, next: 'see-examples'},
  {section: 2, next: 'see-explanation'},
  {section: 3, next: 'go-activities'},
  {section: 4, next: 'next'},
  {section: 4, next: 'see-responses'},
  {section: 4, next: 'see-task'},
  {section: 4, next: 'rate'},
  {section: 5, next: 'finish'},
];

const STEPS = [
  'attendance',
  'introduction',
  'situations',
  'explanation',
  'activities',
];

const Title: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Text mt="8px" mb="8px" fontSize="24px" fontWeight={600} color="gray.700">
    {children}
  </Text>
);

const Paragraph: React.FC<{children: React.ReactNode}> = ({children}) => (
  <Text fontSize="15px" lineHeight="22px" color="gray.700">
    {children}
  </Text>
);

// Highlighted box of the mockups (what you will learn, to discuss, what next)
const InfoBox: React.FC<{
  icon: string;
  title: string;
  tone?: 'primary' | 'violet';
  children: React.ReactNode;
}> = ({icon, title, tone = 'primary', children}) => {
  const theme = useTheme();
  return (
    <HStack
      my="10px"
      p="12px"
      space={3}
      borderRadius="12px"
      bg={tone === 'violet' ? 'violet.0' : 'primary.0'}>
      <Icon
        name={icon as any}
        size={20}
        color={
          tone === 'violet'
            ? theme.colors.violet['200']
            : theme.colors.primary['200']
        }
      />
      <VStack flex={1}>
        <Text fontSize="14px" fontWeight={700} color="gray.700">
          {title}
        </Text>
        {children}
      </VStack>
    </HStack>
  );
};

const Dialogue: React.FC<{lines: Line[]}> = ({lines}) => {
  const {t} = useTranslation();
  return (
    <VStack my="8px" space={2}>
      {lines.map((line, index) => {
        const teacher = line.who === 'teacher';
        return (
          <VStack
            key={index}
            maxW="85%"
            alignSelf={teacher ? 'flex-start' : 'flex-end'}>
            <Text fontSize="11px" fontWeight={600} color="gray.500">
              {teacher
                ? t('tlc.unit.teacher')
                : line.who === 'class'
                ? t('tlc.unit.class')
                : line.name || t('tlc.unit.learner')}
            </Text>
            <Text
              px="12px"
              py="8px"
              fontSize="14px"
              borderRadius="12px"
              overflow="hidden"
              bg={teacher ? 'gray.100' : 'primary.0'}
              color="gray.700">
              {line.text}
            </Text>
          </VStack>
        );
      })}
    </VStack>
  );
};

const ExampleCard: React.FC<{example: Example}> = ({example}) => {
  const {t} = useTranslation();
  return (
    <VStack
      mb="12px"
      p="12px"
      borderWidth="1px"
      borderRadius="12px"
      borderColor="gray.200">
      <Text fontSize="16px" fontWeight={700} color="gray.700">
        {example.title}
      </Text>
      <Text mt="4px" fontSize="14px" color="gray.700">
        {example.context}
      </Text>
      {!!example.dialogue && <Dialogue lines={example.dialogue} />}
      <InfoBox icon="comment" title={t('tlc.unit.discuss')}>
        <Text fontSize="14px" color="gray.700">
          {example.question}
        </Text>
      </InfoBox>
    </VStack>
  );
};

const Verdict: React.FC<{
  icon: string;
  color: string;
  title: string;
  text: string;
}> = ({icon, color, title, text}) => (
  <HStack
    mb="10px"
    p="12px"
    space={3}
    borderWidth="1px"
    borderRadius="12px"
    borderColor="gray.200">
    <Icon name={icon as any} size={18} color={color} />
    <VStack flex={1}>
      <Text fontSize="14px" fontWeight={700} color="gray.700">
        {title}
      </Text>
      <Text mt="2px" fontSize="14px" color="gray.700">
        {text}
      </Text>
    </VStack>
  </HStack>
);

// A learning-circle unit led with the teachers of the school (B22): attendance, introduction,
// situations, explanation, activities, responses, task and the rating of the participation.
const TlcUnitScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const toast = useToast();
  const navigate = useNavigate();
  const {unitId} = useParams<{unitId: string}>();
  const {currentCoach, currentSchool} = useCoachContext();
  const unit = TLC_UNITS.find(item => String(item.id) === unitId)!;
  const content = tlcContent[unit.id];
  // -1 is the summary of the unit shown before starting
  const [page, setPage] = useState(-1);
  const [people, setPeople] = useState<{name: string; detail: string}[]>([]);
  const [present, setPresent] = useState<string[]>([]);
  const [newName, setNewName] = useState('');
  const [rating, setRating] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const last = PAGES.length - 1;

  useEffect(() => {
    if (currentSchool?.id) {
      TeacherService.findTeachersItemBySchoolId(
        '',
        currentSchool.id,
        500,
        1,
      ).then(teachers =>
        setPeople(teachers.map(teacher => ({name: teacher.name, detail: ''}))),
      );
    }
  }, [currentSchool]);

  const participants = people.filter(person => present.includes(person.name));

  const toggle = (name: string) =>
    setPresent(current =>
      current.includes(name)
        ? current.filter(item => item !== name)
        : [...current, name],
    );

  const add = () => {
    const name = newName.trim();
    if (!name || people.some(person => person.name === name)) {
      return;
    }
    setPeople(current => [...current, {name, detail: t('tlc.unit.added')}]);
    setPresent(current => [...current, name]);
    setNewName('');
  };

  const finish = async () => {
    setIsSaving(true);
    await TLCService.create({
      unit_id: String(unit.id),
      coach_id: currentCoach?.id,
      school_id: currentSchool?.id,
      evaluation: String(rating),
      participants: JSON.stringify(participants.map(person => person.name)),
      participants_count: participants.length,
    });
    toast.show({
      placement: 'top',
      render: () => (
        <Toast
          type="success"
          icon="check-circle"
          title={t('tlc.unit.saved_interval', {
            postProcess: 'interval',
            count: participants.length,
          })}
        />
      ),
    });
    navigate(PathRoutes.teacherLearningCircles.main, {replace: true});
  };

  const next = () => (page === last ? finish() : setPage(page + 1));
  const back = () =>
    page === -1 ? navigate(-1) : setPage(current => current - 1);

  const body = () => {
    switch (page) {
      case -1:
        return (
          <>
            <Title>
              {unit.title} · {unit.topic}
            </Title>
            {STEPS.map((step, index) => (
              <HStack key={step} py="8px" space={3}>
                <Center w="26px" h="26px" borderRadius="13px" bg="primary.200">
                  <Text fontSize="12px" fontWeight={700} color="white">
                    {index + 1}
                  </Text>
                </Center>
                <VStack flex={1}>
                  <HStack space={2} alignItems="center">
                    <Text fontSize="15px" fontWeight={700} color="gray.700">
                      {t(`tlc.unit.steps.${step}.title`)}
                    </Text>
                    <Text
                      px="8px"
                      borderRadius="999px"
                      overflow="hidden"
                      fontSize="11px"
                      bg="gray.100"
                      color="gray.600">
                      {t(`tlc.unit.steps.${step}.time`)}
                    </Text>
                  </HStack>
                  <Text fontSize="13px" color="gray.600">
                    {t(`tlc.unit.steps.${step}.text`)}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </>
        );
      case 0:
        return (
          <>
            <Title>{t('tlc.unit.attendance')}</Title>
            <Text mb="8px" fontSize="14px" color="gray.600">
              {t('tlc.unit.attendance-hint', {school: currentSchool?.name})}
            </Text>
            {people.map(person => {
              const checked = present.includes(person.name);
              return (
                <TouchableOpacity
                  key={person.name}
                  accessibilityRole="checkbox"
                  accessibilityState={{checked}}
                  onPress={() => toggle(person.name)}>
                  <HStack
                    py="10px"
                    space={3}
                    alignItems="center"
                    borderBottomWidth="1px"
                    borderBottomColor="gray.100">
                    <Center
                      w="24px"
                      h="24px"
                      borderRadius="6px"
                      borderWidth="2px"
                      borderColor={checked ? 'primary.200' : 'gray.300'}
                      bg={checked ? 'primary.200' : 'white'}>
                      {checked && (
                        <Icon
                          name="check"
                          size={14}
                          color={theme.colors.white}
                        />
                      )}
                    </Center>
                    <VStack flex={1}>
                      <Text fontSize="15px" fontWeight={600} color="gray.700">
                        {person.name}
                      </Text>
                      {!!person.detail && (
                        <Text fontSize="12px" color="gray.600">
                          {person.detail}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                </TouchableOpacity>
              );
            })}
            <HStack mt="4px" mb="16px" space={2} alignItems="flex-end">
              <FormField
                label={t('tlc.unit.absent-from-list')}
                placeholder={t('tlc.unit.name-placeholder') || ''}
                value={newName}
                onChangeText={setNewName}
              />
              <Button
                mb={0}
                variant="outlined"
                disabled={!newName.trim()}
                onPress={add}>
                {t('tlc.unit.add')}
              </Button>
            </HStack>
          </>
        );
      case 1:
        return (
          <>
            <Title>{t('tlc.unit.introduction')}</Title>
            <Paragraph>{content.summary}</Paragraph>
            <InfoBox icon="lightbulb-alt" title={t('tlc.unit.learn')}>
              {content.learn.map(item => (
                <Text key={item} fontSize="14px" color="gray.700">
                  • {item}
                </Text>
              ))}
            </InfoBox>
          </>
        );
      case 2:
        return (
          <>
            <Title>{content.whyTitle}</Title>
            <Paragraph>{content.why}</Paragraph>
          </>
        );
      case 3:
        return (
          <>
            <Title>{t('tlc.unit.situations')}</Title>
            <Text mb="8px" fontSize="14px" color="gray.600">
              {t('tlc.unit.situations-hint')}
            </Text>
            {content.situations.map(example => (
              <ExampleCard key={example.title} example={example} />
            ))}
          </>
        );
      case 4:
        return (
          <>
            <Title>{t('tlc.unit.explanation')}</Title>
            <Text mb="8px" fontSize="14px" color="gray.600">
              {t('tlc.unit.explanation-hint')}
            </Text>
            <Verdict
              icon="times"
              color={theme.colors.red['200']}
              title={t('tlc.unit.bad')}
              text={content.explanation.bad}
            />
            <Verdict
              icon="check"
              color={theme.colors.green['300']}
              title={t('tlc.unit.good')}
              text={content.explanation.good}
            />
          </>
        );
      case 5:
      case 6:
        return (
          <>
            <Title>{t('tlc.unit.activities')}</Title>
            <ExampleCard example={content.activities[page - 5]} />
          </>
        );
      case 7:
        return (
          <>
            <Title>{t('tlc.unit.responses')}</Title>
            {content.activities.map((activity, index) => (
              <Verdict
                key={activity.title}
                icon="comment"
                color={theme.colors.primary['200']}
                title={activity.title}
                text={content.responses[index]}
              />
            ))}
            <InfoBox
              icon="info-circle"
              tone="violet"
              title={t('tlc.unit.what-next')}>
              <Text fontSize="14px" color="gray.700">
                {content.next}
              </Text>
            </InfoBox>
          </>
        );
      case 8:
        return (
          <>
            <Title>{t('tlc.unit.task')}</Title>
            <Verdict
              icon="clipboard-notes"
              color={theme.colors.primary['200']}
              title={t('tlc.unit.task-1')}
              text={content.task}
            />
          </>
        );
      default:
        return (
          <>
            <Title>{t('tlc.unit.end')}</Title>
            <Paragraph>{t('tlc.unit.end-text')}</Paragraph>
            <InfoBox
              icon="users-alt"
              title={t('tlc.unit.participants_interval', {
                postProcess: 'interval',
                count: participants.length,
              })}>
              <Text fontSize="14px" color="gray.700">
                {participants.map(person => person.name).join(', ')}
              </Text>
            </InfoBox>
            <Text mt="8px" fontSize="13px" fontWeight={500} color="gray.700">
              {t('tlc.unit.rating')}
            </Text>
            <HStack mt="8px" space={3} justifyContent="center">
              {[1, 2, 3, 4, 5].map(value => (
                <TouchableOpacity
                  key={value}
                  accessibilityRole="radio"
                  accessibilityState={{checked: rating === value}}
                  onPress={() => setRating(value)}>
                  <Icon
                    name="star-solid"
                    size={36}
                    color={
                      value <= rating ? '#F5C518' : theme.colors.gray['200']
                    }
                  />
                </TouchableOpacity>
              ))}
            </HStack>
          </>
        );
    }
  };

  const section = page >= 0 ? PAGES[page].section : -1;

  return (
    <Page back title={t('tlc.title')} onBack={back} noPadding>
      {page >= 0 && (
        <HStack px={GUTTER} py="8px" space={1}>
          {SECTIONS.map((label, index) => (
            <VStack key={label} flex={1} alignItems="center" space="4px">
              <Box
                w="full"
                h="4px"
                borderRadius="2px"
                bg={index <= section ? 'primary.200' : 'gray.200'}
              />
              <Text
                fontSize="10px"
                color={index === section ? 'primary.200' : 'gray.500'}
                fontWeight={index === section ? 700 : 400}>
                {t(`tlc.unit.sections.${label}`)}
              </Text>
            </VStack>
          ))}
        </HStack>
      )}
      <ScrollView
        key={page}
        flex={1}
        px={GUTTER}
        keyboardShouldPersistTaps="handled">
        {body()}
      </ScrollView>
      <VStack px={GUTTER} pb="16px" pt="8px">
        <Button
          w="full"
          mb={0}
          isLoading={isSaving}
          disabled={
            (page === 0 && participants.length === 0) ||
            (page === last && rating === 0)
          }
          onPress={page === -1 ? () => setPage(0) : next}>
          {page === -1
            ? t('tlc.unit.start')
            : t(`tlc.unit.buttons.${PAGES[page].next}`)}
        </Button>
      </VStack>
    </Page>
  );
};

export default TlcUnitScreen;
