import React, {useEffect, useState} from 'react';
import {Center, HStack, Text, VStack, useTheme} from 'native-base';
import {useLocation, useNavigate, useParams} from 'react-router-native';
import {useNetInfo} from '@react-native-community/netinfo';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import SyncService from '../../../services/sync.service';
import {SessionService} from '../../../services/session.service';
import {TeacherService} from '../../../services/teacher.service';
import {NoteService} from '../../../services/note.service';
import {PdpService} from '../../../services/pdp.service';
import {Session} from '../../../types/session';
import PhaseStepper from '../../../components/PhaseStepper';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page, {GUTTER} from '../../../components/Page';

const InfoRow: React.FC<{label: string; children: React.ReactNode}> = ({
  label,
  children,
}) => (
  <HStack
    py="10px"
    space={3}
    alignItems="center"
    borderBottomWidth="1px"
    borderBottomColor="gray.100">
    <Text w="120px" fontSize="13px" fontWeight={600} color="gray.500">
      {label}
    </Text>
    <VStack flex={1}>{children}</VStack>
  </HStack>
);

// "Séance clôturée" of the mockups: summary of the closed session. The sheet is sent
// to the server as soon as the device is connected.
const ClassObservationCompleted: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {isConnected} = useNetInfo();
  const {state} = useLocation();
  const {sessionId = ''} = useParams<{sessionId: string}>();
  const [session, setSession] = useState<Session>();
  const [teacherName, setTeacherName] = useState('');
  const [notesCount, setNotesCount] = useState(0);
  const [pdp, setPdp] = useState<{count: number; validated: boolean}>();

  const load = async () => {
    const current = await SessionService.getSessionById(sessionId);
    setSession(current);
    if (current?.teacher_id) {
      const teacher = await TeacherService.getTeacherDetails(
        current.teacher_id,
      );
      setTeacherName(teacher?.name || '');
    }
    setNotesCount((await NoteService.listNotes(sessionId)).length);
    const saved = await PdpService.getPdp(sessionId);
    setPdp(
      saved && {
        count: saved.objectives.length,
        validated: saved.pdp.status === 'VALIDATED',
      },
    );
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    if (isConnected) {
      SyncService.trySyncData().then(load);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const duration =
    session?.observation_started_at && session?.observation_ended_at
      ? moment(session.observation_ended_at).diff(
          moment(session.observation_started_at),
          'minutes',
        )
      : undefined;
  const synced = session?._status === 'synced';

  return (
    <Page
      back
      title={t('classObservation.title')}
      onBack={() =>
        state?.fromTeacher
          ? navigate(-1)
          : navigate(PathRoutes.home.main, {replace: true})
      }
      noPadding>
      <PhaseStepper current="closing" />
      <VStack flex={1} px={GUTTER} justifyContent="center">
        <Center>
          <Icon
            name="check-circle-solid"
            size={64}
            color={theme.colors.green['200']}
          />
          <Text mt="12px" fontSize="24px" fontWeight={600} color="gray.700">
            {t('classObservation.observationCompleted.title')}
          </Text>
          {!!session?.completed_at && (
            <Text mt="4px" fontSize="14px" color="gray.600">
              {t('classObservation.observationCompleted.closed-at', {
                date: moment(session.completed_at).format('L'),
                time: moment(session.completed_at).format('HH:mm'),
              })}
            </Text>
          )}
        </Center>
        <VStack mt="24px">
          <InfoRow label={t('classObservation.observationCompleted.teacher')}>
            <Text fontSize="14px" color="gray.700">
              {teacherName}
            </Text>
          </InfoRow>
          <InfoRow
            label={t('classObservation.observationCompleted.observation')}>
            <Text fontSize="14px" color="gray.700">
              {duration !== undefined
                ? t('classObservation.observationCompleted.duration', {
                    minutes: duration,
                  }) + ' · '
                : ''}
              {t('classObservation.notes.count-label_interval', {
                postProcess: 'interval',
                count: notesCount,
              })}
            </Text>
          </InfoRow>
          <InfoRow label={t('classObservation.observationCompleted.pdp')}>
            <Text fontSize="14px" color="gray.700">
              {pdp
                ? t('classObservation.observationCompleted.pdp-summary', {
                    count: pdp.count,
                  }) +
                  (pdp.validated
                    ? t('classObservation.observationCompleted.pdp-validated')
                    : '')
                : '—'}
            </Text>
          </InfoRow>
          <InfoRow label={t('classObservation.observationCompleted.sync')}>
            <Text
              alignSelf="flex-start"
              px="8px"
              borderRadius="999px"
              overflow="hidden"
              fontSize="11px"
              fontWeight={600}
              bg={synced ? 'green.0' : 'yellow.0'}
              color={synced ? 'green.300' : 'yellow.300'}>
              {synced
                ? t('classObservation.observationCompleted.synced')
                : t('classObservation.observationCompleted.pending')}
            </Text>
          </InfoRow>
        </VStack>
      </VStack>

      <VStack px={GUTTER} pb="16px" pt="8px" space={3}>
        <Button
          w="full"
          mb={0}
          onPress={() =>
            navigate(
              PathRoutes.classObservation.report.replace(
                ':sessionId',
                sessionId,
              ),
            )
          }>
          {t('classObservation.observationCompleted.pdf')}
        </Button>
        <Button
          w="full"
          mb={0}
          variant="outlined"
          onPress={() => navigate(PathRoutes.home.main, {replace: true})}>
          {t('classObservation.observationCompleted.buttonBack')}
        </Button>
      </VStack>
    </Page>
  );
};

export default ClassObservationCompleted;
