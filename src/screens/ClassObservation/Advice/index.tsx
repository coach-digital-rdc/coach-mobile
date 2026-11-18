import React, {useEffect, useState} from 'react';
import {
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  TextArea,
  VStack,
} from 'native-base';
import {useLocation, useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {SessionService} from '../../../services/session.service';
import {TeacherService} from '../../../services/teacher.service';
import {Session} from '../../../types/session';
import PhaseStepper from '../../../components/PhaseStepper';
import SessionStrip from '../../../components/SessionStrip';
import FormField from '../../../components/FormField';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Page from '../../../components/Page';

// "Conseils et horaires" of the mockups (B16): times of the didactic sequence, taken from
// the observation, advice to the teacher and place of the signature.
const ClassObservationAdvice: React.FC = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {state} = useLocation();
  const sessionId: string = state?.session?.id;
  const [session, setSession] = useState<Session>();
  const [teacherName, setTeacherName] = useState('');
  const [form, setForm] = useState({
    start_time: '',
    end_time: '',
    advice: '',
    signed_place: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    SessionService.getSessionById(sessionId).then(current => {
      setSession(current);
      setForm({
        start_time: current?.start_time || '',
        end_time: current?.end_time || '',
        advice: current?.advice || '',
        signed_place: current?.signed_place || '',
      });
      if (current?.teacher_id) {
        TeacherService.getTeacherDetails(current.teacher_id).then(teacher =>
          setTeacherName(teacher?.name || ''),
        );
      }
    });
  }, [sessionId]);

  const change = (value: Partial<typeof form>) =>
    setForm(current => ({...current, ...value}));

  const save = () =>
    SessionService.saveAdvice(sessionId, {
      start_time: form.start_time.trim(),
      end_time: form.end_time.trim(),
      advice: form.advice.trim(),
      signed_place: form.signed_place.trim(),
    });

  const handleContinue = async () => {
    setIsSaving(true);
    await save();
    navigate(PathRoutes.classObservation.signatures, {
      replace: true,
      state: {session: {id: sessionId}},
    });
  };

  // The session stays open: it can be resumed from the teacher profile
  const goBack = async () => {
    await save();
    navigate(PathRoutes.classObservation.pdp, {
      replace: true,
      state: {session: {id: sessionId}},
    });
  };

  if (!session) {
    return (
      <Center bg="white" w="full" h="full">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Page back title={t('classObservation.title')} onBack={goBack} noPadding>
      <PhaseStepper current="evaluation" />
      <ScrollView flex={1} px="16px" showsVerticalScrollIndicator={false}>
        <SessionStrip teacher={teacherName} detail={session.subject} />
        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.advice.title')}
        </Text>
        <Text mt="8px" mb="8px" fontSize="14px" color="gray.600">
          {t('classObservation.advice.subtitle')}
        </Text>
        <HStack space={3}>
          <FormField
            label={t('classObservation.advice.start-time')}
            placeholder="08:00"
            value={form.start_time}
            onChangeText={start_time => change({start_time})}
          />
          <FormField
            label={t('classObservation.advice.end-time')}
            placeholder="08:50"
            value={form.end_time}
            onChangeText={end_time => change({end_time})}
          />
        </HStack>
        <VStack mt="10px" space="4px">
          <Text fontSize="13px" fontWeight={500} color="gray.700">
            {t('classObservation.advice.advice')}
          </Text>
          <TextArea
            h="120px"
            autoCompleteType="off"
            value={form.advice}
            placeholder={t('classObservation.advice.advice-placeholder') || ''}
            onChangeText={advice => change({advice})}
          />
        </VStack>
        <HStack mb="16px" space={3}>
          <FormField
            label={t('classObservation.advice.place')}
            placeholder={t('classObservation.advice.place-placeholder') || ''}
            value={form.signed_place}
            onChangeText={signed_place => change({signed_place})}
          />
          <FormField
            readOnly
            label={t('classObservation.advice.date')}
            value={moment().format('L')}
          />
        </HStack>
      </ScrollView>
      <VStack px="16px" pb="16px" pt="8px">
        <Button w="full" mb={0} isLoading={isSaving} onPress={handleContinue}>
          {t('classObservation.advice.button')}
        </Button>
      </VStack>
    </Page>
  );
};

export default ClassObservationAdvice;
