import React, {useEffect, useState} from 'react';
import {Box, HStack, ScrollView, Text, VStack} from 'native-base';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {ScoreService} from '../../../../../services/score.service';
import CompetenceService from '../../../../../services/competence.service';
import {Competence} from '../../../../../types/competence';

const BAR_HEIGHT = 64;

// "Évolution" of the mockups: global score of each sub-domain, from 1 to 5, observation
// after observation; the last one is highlighted.
const EvolutionTab: React.FC<{teacherId: string}> = ({teacherId}) => {
  const {t} = useTranslation();
  const [competencies, setCompetencies] = useState<Competence[]>([]);
  const [history, setHistory] = useState<
    Awaited<ReturnType<typeof ScoreService.getTeacherHistory>>
  >([]);

  useEffect(() => {
    CompetenceService.listCompetenciesWithQuestions().then(grid =>
      setCompetencies(grid.filter(item => item.has_global_score)),
    );
    ScoreService.getTeacherHistory(teacherId).then(setHistory);
  }, [teacherId]);

  if (history.length === 0) {
    return (
      <Text mt="16px" textAlign="center" fontSize="14px" color="gray.500">
        {t('teacher.evolution.empty')}
      </Text>
    );
  }

  return (
    <ScrollView flex={1}>
      <Text mt="8px" mb="4px" fontSize="14px" color="gray.600">
        {t('teacher.evolution.subtitle')}
      </Text>
      {competencies.map(competence => (
        <HStack
          key={competence.id}
          py="8px"
          space={3}
          alignItems="flex-end"
          borderBottomWidth="1px"
          borderBottomColor="gray.100">
          <Text flex={1} fontSize="13px" color="gray.700">
            <Text fontWeight={700}>{competence.code}</Text> {competence.title}
          </Text>
          <HStack space="6px" h={`${BAR_HEIGHT + 14}px`} alignItems="flex-end">
            {history.map((item, index) => {
              const value = item.scores[competence.id];
              return (
                <VStack key={item.session_id} w="22px" alignItems="center">
                  <Text fontSize="10px" color="gray.600">
                    {value ?? '—'}
                  </Text>
                  <Box
                    w="22px"
                    h={`${((value || 0) * BAR_HEIGHT) / 5}px`}
                    borderTopRadius="4px"
                    bg={
                      index === history.length - 1
                        ? 'primary.200'
                        : 'primary.100'
                    }
                  />
                </VStack>
              );
            })}
          </HStack>
        </HStack>
      ))}
      <HStack mt="6px" space="10px" justifyContent="flex-end">
        {history.map(item => (
          <Text key={item.session_id} fontSize="11px" color="gray.500">
            {moment(item.date).format('DD/MM')}
          </Text>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default EvolutionTab;
