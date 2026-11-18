import React, {useCallback, useEffect, useState} from 'react';
import {Center, HStack, Image, Text, VStack, useTheme} from 'native-base';
import {useNavigate, useParams} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {TeacherDetailsType} from '../../../types/teacher';
import {TeacherService} from '../../../services/teacher.service';
import {SessionService} from '../../../services/session.service';
import {useCoachContext} from '../../../providers/coach.provider';
import {Session} from '../../../types/session';
import PathRoutes from '../../../routers/paths';
import TabButton from '../../../components/TabButton';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page from '../../../components/Page';
import TeacherStatsTab from './Tabs/TeacherStats';
import SessionList from './Tabs/SessionListTab';

type params = {
  id: string;
  tabIndex: string;
};

// Teacher profile of the mockups: identity, observations and evolution, and the
// button that starts a new observation or resumes the one in progress.
const TeacherDetailsScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {id, tabIndex} = useParams<params>();
  const defaultTab =
    tabIndex === ':tabIndex' ? 0 : parseInt(tabIndex || '0', 10);
  const [selectedTabIndex, setSelectedTabIndex] = useState(defaultTab || 0);
  const [teacher, setTeacher] = useState<TeacherDetailsType>();
  const [openSession, setOpenSession] = useState<Session>();
  const {currentSchool} = useCoachContext();

  useEffect(() => {
    if (id) {
      TeacherService.getTeacherDetails(id).then(setTeacher);
      SessionService.findOpenSession(id).then(setOpenSession);
    }
  }, [id]);

  const resumeSession = useCallback(
    (session: Session) =>
      navigate(PathRoutes.classObservation.form, {
        state: {session: {id: session.id, teacher_id: session.teacher_id}},
      }),
    [navigate],
  );

  const tabs = [
    {
      Component: <SessionList teacherId={id || ''} onResume={resumeSession} />,
      label: 'teacher.tabs.session.title',
    },
    {
      Component: <TeacherStatsTab teacherId={id || ''} />,
      label: 'teacher.tabs.stats.evolution-tab',
    },
  ];

  return (
    <Page back title={t('teacher.details.title')}>
      <HStack space={3} alignItems="center">
        <Center w="56px" h="56px" borderRadius="28px" bg="primary.0">
          {teacher?.image ? (
            <Image
              w="100%"
              h="100%"
              alt="Teacher"
              borderRadius="28px"
              source={{uri: teacher.image}}
            />
          ) : (
            <Icon name="user" size={28} color={theme.colors.primary['200']} />
          )}
        </Center>
        <VStack flex={1}>
          <Text fontSize="22px" fontWeight={600} color="gray.700">
            {teacher?.name}
          </Text>
          <Text fontSize="13px" color="gray.600">
            {[teacher?.subject, currentSchool?.name]
              .filter(Boolean)
              .join(' · ')}
          </Text>
        </VStack>
        {teacher && (
          <TouchableOpacity
            accessibilityLabel={t('teacher.details.editTeacher') || ''}
            onPress={() =>
              navigate(PathRoutes.teacher.form.replace(':id', teacher.id))
            }>
            <Icon name="pen" size={22} color={theme.colors.primary['200']} />
          </TouchableOpacity>
        )}
      </HStack>

      <HStack
        mt="12px"
        mb={2}
        borderBottomWidth="2px"
        borderBottomColor="gray.200">
        {tabs.map((item, index) => (
          <TabButton
            key={index}
            label={item.label}
            onPress={() => setSelectedTabIndex(index)}
            isActive={selectedTabIndex === index}
          />
        ))}
      </HStack>

      <VStack flex={1} w="full">
        {tabs[selectedTabIndex].Component}
      </VStack>

      <Button
        mt="8px"
        mb={0}
        w="full"
        onPress={() =>
          openSession
            ? resumeSession(openSession)
            : navigate(
                PathRoutes.classObservation.about.replace(
                  ':teacherId',
                  id || '',
                ),
              )
        }>
        <HStack space={2} alignItems="center">
          <Icon
            name={openSession ? 'history' : 'plus'}
            size={18}
            color={theme.colors.white}
          />
          <Text fontSize="15px" fontWeight={600} color="gray.0">
            {openSession
              ? t('teacher.details.resume-observation')
              : t('teacher.details.new-observation')}
          </Text>
        </HStack>
      </Button>
    </Page>
  );
};

export default TeacherDetailsScreen;
