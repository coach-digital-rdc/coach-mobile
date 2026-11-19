import React, {useEffect, useState} from 'react';
import {Center, HStack, ScrollView, Text, VStack} from 'native-base';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {PdpService} from '../../../../../services/pdp.service';

// "PDP" of the mockups: objectives of the plans validated with the teacher, the latest first.
const PdpTab: React.FC<{teacherId: string}> = ({teacherId}) => {
  const {t} = useTranslation();
  const [plans, setPlans] = useState<
    Awaited<ReturnType<typeof PdpService.listTeacherPdps>>
  >([]);

  useEffect(() => {
    PdpService.listTeacherPdps(teacherId).then(setPlans);
  }, [teacherId]);

  if (plans.length === 0) {
    return (
      <Text mt="16px" textAlign="center" fontSize="14px" color="gray.500">
        {t('teacher.pdp.empty')}
      </Text>
    );
  }

  return (
    <ScrollView flex={1}>
      {plans.map(({pdp, objectives}) => (
        <VStack key={pdp.id}>
          <Text
            mt="16px"
            mb="4px"
            fontSize="13px"
            fontWeight={700}
            color="gray.600">
            {t('teacher.pdp.title', {
              date: moment(pdp.validated_at || pdp.created_at).format('L'),
            })}
          </Text>
          {objectives.map((objective, index) => (
            <HStack
              key={objective.id}
              py="8px"
              space="10px"
              borderTopWidth={index > 0 ? '1px' : 0}
              borderTopColor="gray.100">
              <Center w="24px" h="24px" borderRadius="12px" bg="primary.200">
                <Text fontSize="12px" fontWeight={700} color="white">
                  {index + 1}
                </Text>
              </Center>
              <VStack flex={1}>
                <Text fontSize="14px" fontWeight={600} color="gray.700">
                  {objective.code ? `${objective.code} · ` : ''}
                  {objective.objective}
                </Text>
                <Text mt="2px" fontSize="12px" color="gray.600">
                  {t('teacher.pdp.detail', {
                    indicator: objective.indicator,
                    date: moment(objective.due_date, 'YYYY-MM-DD').format('L'),
                  })}
                </Text>
              </VStack>
            </HStack>
          ))}
        </VStack>
      ))}
      <Text mt="12px" fontSize="12px" color="gray.500">
        {t('teacher.pdp.hint')}
      </Text>
    </ScrollView>
  );
};

export default PdpTab;
