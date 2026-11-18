import React, {useEffect, useState} from 'react';
import {Center, HStack, ScrollView, Text, VStack} from 'native-base';
import {useNavigate, useParams} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {TeacherService} from '../../../services/teacher.service';
import {TeacherDetailsType} from '../../../types/teacher';
import SessionStrip from '../../../components/SessionStrip';
import {PHASES} from '../../../components/PhaseStepper';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Page from '../../../components/Page';

// "Déroulement de la séance" of the mockups: the four steps of the observation.
const ClassObservationAbout: React.FC = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const param = useParams<{teacherId: string}>();
  const [teacher, setTeacher] = useState<TeacherDetailsType>();

  useEffect(() => {
    if (param.teacherId) {
      TeacherService.getTeacherDetails(param.teacherId).then(setTeacher);
    }
  }, [param.teacherId]);

  return (
    <Page back title={t('classObservation.title')}>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {teacher && (
          <SessionStrip teacher={teacher.name} detail={teacher.subject} />
        )}

        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.about.title')}
        </Text>
        <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
          {t('classObservation.about.subtitle')}
        </Text>

        {PHASES.map((phase, index) => (
          <HStack key={phase} mb="16px" space={3}>
            <Center w="28px" h="28px" borderRadius="14px" bg="primary.0">
              <Text fontSize="13px" fontWeight={700} color="primary.200">
                {index + 1}
              </Text>
            </Center>
            <VStack flex={1}>
              <Text fontSize="15px" fontWeight={600} color="gray.700">
                {t(`classObservation.phases.${phase}`)}
              </Text>
              <Text fontSize="14px" color="gray.600">
                {t(`classObservation.about.steps.${phase}`)}
              </Text>
            </VStack>
          </HStack>
        ))}
      </ScrollView>

      <Button
        mt="16px"
        w="full"
        onPress={() =>
          navigate(PathRoutes.classObservation.setup, {
            replace: true,
            state: {session: {teacher_id: param.teacherId}},
          })
        }>
        {t('classObservation.about.start-button')}
      </Button>
    </Page>
  );
};

export default ClassObservationAbout;
