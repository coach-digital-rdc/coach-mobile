import React, {useEffect, useState} from 'react';
import {HStack, ScrollView, Text, VStack, useTheme} from 'native-base';
import {useLocation, useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {useCoachContext} from '../../../providers/coach.provider';
import {TeacherService} from '../../../services/teacher.service';
import {SessionService} from '../../../services/session.service';
import {TeacherDetailsType} from '../../../types/teacher';
import {SessionActivity} from '../../../types/session-activity';
import SegmentedChoice from '../../../components/SegmentedChoice';
import PhaseStepper from '../../../components/PhaseStepper';
import FormField from '../../../components/FormField';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page from '../../../components/Page';

// School year starting in September: "2026-2027" from September 2026 to August 2027
const currentSchoolYear = () => {
  const now = new Date();
  const start = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
  return `${start}-${start + 1}`;
};

const InfoRow: React.FC<{label: string; value?: string | null}> = ({
  label,
  value,
}) => (
  <HStack py="4px" space={2}>
    <Text w="120px" fontSize="12px" fontWeight={600} color="gray.500">
      {label}
    </Text>
    <Text flex={1} fontSize="14px" color="gray.700">
      {value || '—'}
    </Text>
  </HStack>
);

// "En-tête de la fiche" of the mockups (B11): the known information is filled in,
// the observer completes the session and the observed activity, then the observation starts (B10).
const ClassObservationSetup: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {state} = useLocation();
  const {currentCoach, currentSchool} = useCoachContext();
  const teacherId: string = state?.session?.teacher_id;
  const [teacher, setTeacher] = useState<TeacherDetailsType>();
  const [isSaving, setIsSaving] = useState(false);
  const [header, setHeader] = useState({
    subject: '',
    teacher_weekly_load: '',
    school_year: currentSchoolYear(),
  });
  const [activity, setActivity] = useState<Partial<SessionActivity>>({
    p_i: '',
    time: moment().format('HH:mm'),
  });

  useEffect(() => {
    if (teacherId) {
      TeacherService.getTeacherDetails(teacherId).then(data => {
        setTeacher(data);
        setHeader(current => ({
          ...current,
          subject: data?.subject || '',
          teacher_weekly_load: data?.weekly_load
            ? String(data.weekly_load)
            : '',
        }));
        setActivity(current => ({...current, discipline: data?.subject}));
      });
    }
  }, [teacherId]);

  const changeActivity = (change: Partial<SessionActivity>) =>
    setActivity(current => ({...current, ...change}));

  const ready = !!header.subject.trim() && !!activity.discipline?.trim();

  const handleSave = async () => {
    setIsSaving(true);
    const sessionId = await SessionService.startLocalSession(
      {
        teacher_id: teacherId,
        coach_id: currentCoach?.id,
        school_id: currentSchool?.id,
        subject: header.subject.trim(),
        level: 'S',
        school_year: header.school_year.trim(),
        teacher_weekly_load: header.teacher_weekly_load
          ? parseInt(header.teacher_weekly_load, 10)
          : null,
        last_observation_date: teacher?.last_session_date || null,
      },
      activity,
    );
    navigate(PathRoutes.classObservation.checklist, {
      replace: true,
      state: {session: {id: sessionId, teacher_id: teacherId}},
    });
  };

  return (
    <Page back title={t('classObservation.title')} noPadding>
      <PhaseStepper current="preparation" />
      <ScrollView flex={1} px="16px" showsVerticalScrollIndicator={false}>
        <Text mt="8px" fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.setup.title')}
        </Text>
        <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
          {t('classObservation.setup.subtitle')}
        </Text>

        <VStack
          p="12px"
          borderWidth="1px"
          borderRadius="12px"
          borderColor="gray.200">
          <HStack mb="8px" justifyContent="space-between" alignItems="center">
            <Text fontSize="16px" fontWeight={700} color="gray.700">
              {t('classObservation.setup.observer')}
            </Text>
            <HStack
              px="8px"
              space={1}
              alignItems="center"
              borderRadius="999px"
              bg="gray.100">
              <Icon name="lock" size={12} color={theme.colors.gray['600']} />
              <Text fontSize="11px" fontWeight={600} color="gray.600">
                {t('classObservation.setup.profile')}
              </Text>
            </HStack>
          </HStack>
          <InfoRow
            label={t('classObservation.setup.name')}
            value={currentCoach?.name}
          />
          <InfoRow
            label={t('classObservation.setup.contact')}
            value={[currentCoach?.phone, currentCoach?.email]
              .filter(Boolean)
              .join(' · ')}
          />
        </VStack>

        <Text
          mt="24px"
          mb="8px"
          fontSize="18px"
          fontWeight={700}
          color="gray.700">
          {t('classObservation.setup.session')}
        </Text>
        <InfoRow
          label={t('classObservation.setup.school')}
          value={currentSchool?.name}
        />
        <InfoRow
          label={t('classObservation.setup.teacher')}
          value={teacher?.name}
        />
        <InfoRow
          label={t('classObservation.setup.last-observation')}
          value={
            teacher?.last_session_date
              ? moment(teacher.last_session_date).format('L')
              : t('classObservation.setup.none')
          }
        />

        <FormField
          readOnly
          label={t('classObservation.setup.level')}
          value={t('classObservation.setup.secondary') || ''}
        />
        <FormField
          label={t('classObservation.setup.disciplines')}
          value={header.subject}
          onChangeText={subject =>
            setHeader(current => ({...current, subject}))
          }
        />
        <HStack space={3}>
          <FormField
            label={t('classObservation.setup.weekly-load')}
            keyboardType="number-pad"
            value={header.teacher_weekly_load}
            onChangeText={value =>
              setHeader(current => ({
                ...current,
                teacher_weekly_load: value.replace(/\D/g, ''),
              }))
            }
          />
          <FormField
            label={t('classObservation.setup.school-year')}
            value={header.school_year}
            onChangeText={school_year =>
              setHeader(current => ({...current, school_year}))
            }
          />
        </HStack>

        <Text
          mt="24px"
          mb="4px"
          fontSize="18px"
          fontWeight={700}
          color="gray.700">
          {t('classObservation.setup.activity')}
        </Text>
        <VStack
          mb="16px"
          p="12px"
          borderWidth="1px"
          borderRadius="12px"
          borderColor="gray.200">
          <HStack space={3}>
            <FormField
              label={t('classObservation.setup.sub-domain')}
              placeholder={
                t('classObservation.setup.sub-domain-placeholder') || ''
              }
              value={activity.sub_domain || ''}
              onChangeText={sub_domain => changeActivity({sub_domain})}
            />
            <FormField
              label={t('classObservation.setup.discipline')}
              value={activity.discipline || ''}
              onChangeText={discipline => changeActivity({discipline})}
            />
          </HStack>
          <HStack space={3}>
            <FormField
              label={t('classObservation.setup.sheet-code')}
              value={activity.sheet_code || ''}
              onChangeText={sheet_code => changeActivity({sheet_code})}
            />
            <FormField
              label={t('classObservation.setup.class-name')}
              value={activity.class_name || ''}
              onChangeText={class_name => changeActivity({class_name})}
            />
          </HStack>
          <HStack space={3} alignItems="flex-end">
            <VStack flex={1}>
              <SegmentedChoice
                label={t('classObservation.setup.p-i')}
                value={activity.p_i}
                options={[
                  {value: '', label: '—'},
                  {value: 'P', label: 'P'},
                  {value: 'I', label: 'I'},
                ]}
                onChange={p_i => changeActivity({p_i})}
              />
            </VStack>
            <FormField
              label={t('classObservation.setup.time')}
              value={activity.time || ''}
              placeholder="08:00"
              onChangeText={time => changeActivity({time})}
            />
          </HStack>
          <FormField
            label={t('classObservation.setup.essential-knowledge')}
            value={activity.essential_knowledge || ''}
            onChangeText={essential_knowledge =>
              changeActivity({essential_knowledge})
            }
          />
        </VStack>
      </ScrollView>

      <VStack
        px="16px"
        pb="16px"
        pt="8px"
        borderTopWidth="1px"
        borderTopColor="gray.200">
        {!ready && (
          <HStack mb="8px" p="8px" space={2} borderRadius="10px" bg="yellow.0">
            <Icon
              name="info-circle"
              size={18}
              color={theme.colors.yellow['300']}
            />
            <Text flex={1} fontSize="13px" color="yellow.300">
              {t('classObservation.setup.missing')}
            </Text>
          </HStack>
        )}
        <Button
          w="full"
          mb={0}
          disabled={!ready}
          isLoading={isSaving}
          onPress={handleSave}>
          {t('classObservation.setup.button')}
        </Button>
      </VStack>
    </Page>
  );
};

export default ClassObservationSetup;
