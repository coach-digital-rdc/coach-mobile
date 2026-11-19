import React, {useEffect, useState} from 'react';
import {Center, HStack, ScrollView, Text, VStack, useTheme} from 'native-base';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {useCoachContext} from '../../providers/coach.provider';
import {TLCService} from '../../services/tlc.service';
import BottomNavigator from '../Home/BottomNavigator';
import {TLC_UNITS} from '../../data/tlc';
import PathRoutes from '../../routers/paths';
import ListRow from '../../components/ListRow';
import Icon from '../../components/Icon';
import Page, {GUTTER} from '../../components/Page';

// "Cercles d'apprentissage" of the mockups (B22): units of about one hour led with the teachers
// of the school, ranked by the behaviours most often scored Faible in the school.
const TlcScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {currentSchool} = useCoachContext();
  const [results, setResults] =
    useState<Awaited<ReturnType<typeof TLCService.getSchoolResults>>>();

  useEffect(() => {
    if (currentSchool?.id) {
      TLCService.getSchoolResults(currentSchool.id).then(setResults);
    }
  }, [currentSchool]);

  const weak = (code: string) => results?.weak[code] ?? 0;
  const ranked = [...TLC_UNITS].sort(
    (a, b) => weak(b.behaviour) - weak(a.behaviour),
  );

  return (
    <Page title={t('tlc.title')} noPadding>
      <ScrollView flex={1} px={GUTTER}>
        <Text mt="8px" fontSize="24px" fontWeight={600} color="gray.700">
          {t('tlc.heading')}
        </Text>
        <Text mt="8px" mb="12px" fontSize="14px" color="gray.600">
          {t('tlc.subtitle')}
        </Text>

        <VStack
          mb="8px"
          p="12px"
          borderWidth="1px"
          borderRadius="12px"
          borderColor="gray.200">
          <Text fontSize="16px" fontWeight={700} color="gray.700">
            {t('tlc.results')}
          </Text>
          <Text mt="4px" fontSize="12px" color="gray.500">
            {t('tlc.results-detail', {
              school: currentSchool?.name,
              observations: results?.observations ?? 0,
              teachers: results?.teachers ?? 0,
            })}
          </Text>
        </VStack>

        {ranked.map((unit, index) => (
          <ListRow
            key={unit.id}
            divider={index > 0}
            title={`${unit.title} · ${unit.topic}`}
            subtitle={t('tlc.weak', {
              code: unit.behaviour,
              count: weak(unit.behaviour),
              total: results?.observations ?? 0,
            })}
            leading={
              <Center w="36px" h="36px" borderRadius="10px" bg="primary.0">
                <Icon
                  name="users-alt"
                  size={20}
                  color={theme.colors.primary['200']}
                />
              </Center>
            }
            onPress={() =>
              navigate(
                PathRoutes.teacherLearningCircles.unit.replace(
                  ':unitId',
                  String(unit.id),
                ),
              )
            }>
            {index === 0 && weak(unit.behaviour) > 0 && (
              <HStack>
                <Text
                  px="8px"
                  borderRadius="999px"
                  overflow="hidden"
                  fontSize="11px"
                  fontWeight={600}
                  bg="green.0"
                  color="green.300">
                  {t('tlc.recommended')}
                </Text>
              </HStack>
            )}
          </ListRow>
        ))}
      </ScrollView>
      <BottomNavigator active="circles" />
    </Page>
  );
};

export default TlcScreen;
