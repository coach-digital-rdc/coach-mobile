import React, {useEffect, useState} from 'react';
import {
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {useNetInfo} from '@react-native-community/netinfo';
import {useCoachContext} from '../../providers/coach.provider';
import {getDBConnection} from '../../services/database.service';
import {PdpService} from '../../services/pdp.service';
import SyncService from '../../services/sync.service';
import PathRoutes from '../../routers/paths';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Page from '../../components/Page';

// Data available on the device once it is configured
const countOnDevice = async (schoolId?: string) => {
  const db = await getDBConnection();
  const count = async (sql: string, params: any[] = []) =>
    (await db.executeSql(sql, params))[0].rows.raw()[0].count as number;
  return {
    teachers: await count(
      'SELECT COUNT(*) as count FROM teacher WHERE school_id = ?',
      [schoolId],
    ),
    competencies: await count('SELECT COUNT(*) as count FROM competence'),
    questions: await count('SELECT COUNT(*) as count FROM question'),
    documents: await count('SELECT COUNT(*) as count FROM checklist_item'),
    rules: (await PdpService.getPublishedRuleSet())?.version,
  };
};

// "Préparation de l'appareil" of the mockups: the data of the school are downloaded,
// then the device can be used without connection.
const SyncDetails: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {isConnected} = useNetInfo();
  const {currentSchool, currentCoach} = useCoachContext();
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] =
    useState<Awaited<ReturnType<typeof countOnDevice>>>();

  useEffect(() => {
    if (isConnected === null) {
      return;
    }
    const prepare = async () => {
      setIsLoading(true);
      if (isConnected) {
        await SyncService.trySyncData(true);
      }
      setCounts(await countOnDevice(currentSchool?.id));
      setIsLoading(false);
    };
    prepare();
  }, [isConnected, currentSchool]);

  const goToNextPage = () =>
    navigate(currentCoach ? PathRoutes.home.main : PathRoutes.selectAccount, {
      replace: true,
    });

  const items = counts
    ? [
        t('syncDetails.teachers_interval', {
          postProcess: 'interval',
          count: counts.teachers,
        }),
        t('syncDetails.grid', {
          competencies: counts.competencies,
          questions: counts.questions,
        }),
        t('syncDetails.checklist', {count: counts.documents}),
        counts.rules
          ? t('syncDetails.rules', {version: counts.rules})
          : undefined,
        t('syncDetails.manual'),
      ].filter(Boolean)
    : [];

  return (
    <Page noPadding>
      <ScrollView flex={1} px="16px" contentContainerStyle={{flexGrow: 1}}>
        <Center flex={1} py="32px">
          {isLoading ? (
            <>
              <Center w="80px" h="80px" borderRadius="40px" bg="primary.0">
                <Icon
                  name="sync"
                  size={40}
                  color={theme.colors.primary['200']}
                />
              </Center>
              <Text mt="16px" fontSize="24px" fontWeight={600} color="gray.700">
                {t('syncDetails.preparing')}
              </Text>
              <Text
                mt="8px"
                textAlign="center"
                fontSize="14px"
                color="gray.600">
                {t('syncDetails.downloading', {school: currentSchool?.name})}
              </Text>
              <Spinner mt="24px" size="lg" color="primary.200" />
            </>
          ) : (
            <>
              <Icon
                name="check-circle-solid"
                size={56}
                color={theme.colors.green['200']}
              />
              <Text mt="16px" fontSize="24px" fontWeight={600} color="gray.700">
                {t('syncDetails.title')}
              </Text>
              <Text
                mt="8px"
                textAlign="center"
                fontSize="14px"
                color="gray.600">
                {isConnected
                  ? t('syncDetails.description')
                  : t('syncDetails.offline')}
              </Text>
              <VStack mt="20px" w="full" space={2}>
                {items.map(item => (
                  <HStack key={item} space={2} alignItems="center">
                    <Icon
                      name="check"
                      size={16}
                      color={theme.colors.green['300']}
                    />
                    <Text flex={1} fontSize="14px" color="gray.700">
                      {item}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </>
          )}
        </Center>
      </ScrollView>
      <VStack px="16px" pb="16px" pt="8px">
        <Button w="full" mb={0} disabled={isLoading} onPress={goToNextPage}>
          {t('syncDetails.start')}
        </Button>
      </VStack>
    </Page>
  );
};

export default SyncDetails;
