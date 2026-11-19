import React, {useEffect, useState} from 'react';
import {Center, HStack, ScrollView, Text, VStack, useTheme} from 'native-base';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-native';
import moment from 'moment';
import {useCoachContext} from '../../../../providers/coach.provider';
import {SessionService} from '../../../../services/session.service';
import {getResumeRoute} from '../../../../helpers/resume.helper';
import {Session} from '../../../../types/session';
import BottomNavigator from '../../BottomNavigator';
import ListRow from '../../../../components/ListRow';
import Icon from '../../../../components/Icon';
import Page, {GUTTER} from '../../../../components/Page';

const STATUS_TONES: {[status: string]: [string, string]} = {
  PREPARATION: ['primary.0', 'primary.200'],
  OBSERVATION: ['red.0', 'red.300'],
  EVALUATION: ['yellow.0', 'yellow.300'],
};

// "Séances en cours" of the mockups: sessions started and not closed, to resume them
// at their step. They are kept on the device, even without connection.
const PendingSessionsScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {currentSchool} = useCoachContext();
  const [sessions, setSessions] = useState<
    (Session & {teacher_name: string; notes: number})[]
  >([]);

  useEffect(() => {
    if (currentSchool?.id) {
      SessionService.listOpenSessions(currentSchool.id).then(setSessions);
    }
  }, [currentSchool]);

  const resume = (session: Session) => {
    const {path, state} = getResumeRoute(session);
    navigate(path, {state});
  };

  return (
    <Page title={t('home.pending.page_title')} noPadding>
      <ScrollView flex={1} px={GUTTER}>
        <Text mt="8px" fontSize="24px" fontWeight={600} color="gray.700">
          {t('home.pending.title')}
        </Text>
        <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
          {t('home.pending.subtitle')}
        </Text>
        {sessions.length === 0 ? (
          <HStack
            p="8px"
            space={2}
            alignItems="center"
            borderRadius="10px"
            bg="primary.0">
            <Icon
              name="info-circle"
              size={18}
              color={theme.colors.primary['200']}
            />
            <Text flex={1} fontSize="13px" color="primary.200">
              {t('home.pending.empty')}
            </Text>
          </HStack>
        ) : (
          <VStack>
            {sessions.map((session, index) => {
              const status = session.session_status || 'OBSERVATION';
              const [bg, color] = STATUS_TONES[status];
              return (
                <ListRow
                  key={session.id}
                  divider={index > 0}
                  title={session.teacher_name}
                  subtitle={t('home.pending.started_interval', {
                    postProcess: 'interval',
                    count: session.notes,
                    date: moment(session.created_at).format('L'),
                  })}
                  onPress={() => resume(session)}
                  leading={
                    <Center
                      w="36px"
                      h="36px"
                      borderRadius="18px"
                      bg="primary.0">
                      <Icon
                        name="user"
                        size={18}
                        color={theme.colors.primary['200']}
                      />
                    </Center>
                  }>
                  <Text
                    alignSelf="flex-start"
                    px="8px"
                    borderRadius="999px"
                    overflow="hidden"
                    fontSize="11px"
                    fontWeight={600}
                    bg={bg}
                    color={color}>
                    {t(`home.pending.status.${status}`)}
                  </Text>
                </ListRow>
              );
            })}
          </VStack>
        )}
      </ScrollView>
      <BottomNavigator active="pending" />
    </Page>
  );
};

export default PendingSessionsScreen;
