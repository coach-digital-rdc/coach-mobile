import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Center,
  HStack,
  Image,
  ScrollView,
  Spinner,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {isTablet as Tablet} from 'react-native-device-info';
import {COUNTRY} from '@env';
import moment from 'moment';
import {TeacherItemType} from '../../types/teacher';
import PathRoutes from '../../routers/paths';
import {StorageService} from '../../services/storage.service';
import {SessionService} from '../../services/session.service';
import SyncService from '../../services/sync.service';
import {TeacherService} from '../../services/teacher.service';
import {useCoachContext} from '../../providers/coach.provider';
import {TabletLogo} from '../../assets/images/logos';
import useDebounce from '../../hooks/debounce';
import Icon from '../../components/Icon';
import Tile from '../../components/Tile';
import Button from '../../components/Button';
import SearchField from '../../components/SearchField';
import BottomNavigator from './BottomNavigator';
import EmptyStateComponent from './EmptyState';
import TeacherItem from './TeacherItem';

const ITEMS_PER_PAGE = 20;

// Home screen laid out as in the mockups: banner, sync status, shortcut tiles and teachers.
const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const isTablet = Tablet();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {currentCoach, currentSchool} = useCoachContext();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [unsynced, setUnsynced] = useState(0);
  const [pending, setPending] = useState(0);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isTheEnd, setIsTheEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teachers, setTeachers] = useState<TeacherItemType[]>([]);
  const padding = isTablet ? '32px' : '16px';

  useEffect(() => {
    if (!currentCoach) {
      navigate(PathRoutes.login.main, {replace: true});
    } else if (!currentSchool) {
      navigate(PathRoutes.selectSchool, {replace: true});
    }
  }, [currentCoach, currentSchool, navigate]);

  const loadStatus = useCallback(async () => {
    const counts = await SyncService.getUnsyncedItemsCount();
    setUnsynced(
      counts.pendingTeachers + counts.pendingSessions + counts.pendingFeedbacks,
    );
    setLastSync(await StorageService.getLastSync());
    // Sessions started and not closed, as in the "Séances en cours" screen
    const openSessions = await SessionService.listOpenSessions(
      currentSchool?.id || '',
    );
    setPending(openSessions.length);
  }, [currentSchool]);

  useEffect(() => {
    const syncIfNeeded = async () => {
      const date = await StorageService.getLastSync();
      const ONE_HOUR = 60 * 60 * 1000;

      if (!date || new Date().getTime() - new Date(date).getTime() > ONE_HOUR) {
        setIsSyncing(true);
        await SyncService.trySyncData();
        setIsSyncing(false);
      }
      loadStatus();
    };

    syncIfNeeded();
  }, [loadStatus]);

  const loadFirstPage = useCallback(
    (value: string) => {
      setIsLoading(true);
      setIsTheEnd(false);
      setPage(1);
      TeacherService.findTeachersItemBySchoolId(
        value,
        currentSchool?.id || '',
        ITEMS_PER_PAGE,
        1,
      ).then(data => {
        setIsTheEnd(data.length < ITEMS_PER_PAGE);
        setTeachers(data);
        setIsLoading(false);
      });
    },
    [currentSchool],
  );

  useDebounce(filter, 300, loadFirstPage);

  const loadNextPage = async () => {
    const data = await TeacherService.findTeachersItemBySchoolId(
      filter,
      currentSchool?.id || '',
      ITEMS_PER_PAGE,
      page + 1,
    );
    setPage(page + 1);
    setIsTheEnd(data.length < ITEMS_PER_PAGE);
    setTeachers(current => [...current, ...data]);
  };

  const tiles = [
    {
      icon: 'plus-circle',
      label: t('home.tiles.new-observation'),
      primary: true,
      onPress: () => navigate(PathRoutes.home.newSession),
    },
    {
      icon: 'history',
      label: t('home.tiles.in-progress'),
      badge: pending,
      onPress: () => navigate(PathRoutes.home.pendingSessions),
    },
    {
      icon: 'books',
      label: t('home.tiles.manual'),
      onPress: () => navigate(PathRoutes.coachScripts),
    },
    COUNTRY === 'np'
      ? {
          icon: 'users-alt',
          label: t('home.tiles.cop'),
          onPress: () => navigate(PathRoutes.communityOfPractice.onboarding),
        }
      : {
          icon: 'users-alt',
          label: t('home.tiles.tlc'),
          onPress: () => navigate(PathRoutes.teacherLearningCircles.onboarding),
        },
    {
      icon: 'sync',
      label: t('home.tiles.sync'),
      onPress: () => navigate(PathRoutes.settings.main),
    },
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.colors.white}}>
      <ScrollView flex={1}>
        <VStack bg="primary.200" px={padding} pt="16px" pb="20px">
          <HStack justifyContent="space-between" alignItems="center">
            <Center p="3px" borderRadius="10px" bg="gray.0">
              <Image source={TabletLogo} alt="Logo" w="32px" h="32px" />
            </Center>
            <TouchableOpacity
              onPress={() => navigate(PathRoutes.settings.main)}
              accessibilityLabel={t('settings.title') || ''}>
              <Icon name="setting" size={22} color={theme.colors.white} />
            </TouchableOpacity>
          </HStack>

          <Text mt="12px" fontSize="22px" fontWeight={700} color="gray.0">
            {t('home.salutation')}, {currentCoach?.name}
          </Text>

          <TouchableOpacity onPress={() => navigate(PathRoutes.selectSchool)}>
            <HStack mt="6px" space={1} alignItems="center">
              <Text fontSize="13px" color="gray.0">
                {currentSchool?.name}
              </Text>
              <Icon name="angle-right" size={14} color={theme.colors.white} />
            </HStack>
          </TouchableOpacity>
        </VStack>

        <VStack px={padding} pt="16px" pb="24px">
          <TouchableOpacity onPress={() => navigate(PathRoutes.settings.main)}>
            <HStack
              px="12px"
              py="8px"
              space={2}
              alignItems="center"
              borderRadius="10px"
              bg={unsynced ? 'yellow.0' : 'green.0'}>
              {isSyncing ? (
                <Spinner size="sm" />
              ) : (
                <Icon
                  name="sync"
                  size={16}
                  color={
                    unsynced
                      ? theme.colors.yellow['300']
                      : theme.colors.green['300']
                  }
                />
              )}
              <Text
                flex={1}
                fontSize="13px"
                color={unsynced ? 'yellow.300' : 'green.300'}>
                {unsynced
                  ? t('home.sync.pending_interval', {
                      postProcess: 'interval',
                      count: unsynced,
                    })
                  : lastSync
                  ? t('home.sync.done', {date: moment(lastSync).calendar()})
                  : t('home.sync.never')}
              </Text>
              <Icon
                name="angle-right"
                size={14}
                color={
                  unsynced
                    ? theme.colors.yellow['300']
                    : theme.colors.green['300']
                }
              />
            </HStack>
          </TouchableOpacity>

          <HStack mt="16px" flexWrap="wrap" justifyContent="space-between">
            {tiles.map(tile => (
              <Box
                key={tile.label}
                mb="10px"
                display="flex"
                w={isTablet ? '24%' : '48.5%'}>
                <Tile {...tile} />
              </Box>
            ))}
          </HStack>

          <HStack mt="14px" alignItems="center" justifyContent="space-between">
            <Text fontSize="18px" fontWeight={700} color="gray.700">
              {t('home.teachers.section', {count: teachers.length})}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigate(PathRoutes.teacher.form.replace(':id', 'new'))
              }>
              <HStack px="12px" py="6px" space={1} alignItems="center">
                <Icon
                  name="plus"
                  size={16}
                  color={theme.colors.primary['200']}
                />
                <Text fontSize="13px" fontWeight={600} color="primary.200">
                  {t('home.teachers.add')}
                </Text>
              </HStack>
            </TouchableOpacity>
          </HStack>

          <SearchField
            value={filter}
            onChangeText={setFilter}
            placeholder={t('home.teachers.search') || ''}
          />

          {isLoading ? (
            <Spinner size="lg" mt="24px" />
          ) : teachers.length === 0 ? (
            <EmptyStateComponent
              handleCreate={() =>
                navigate(PathRoutes.teacher.form.replace(':id', 'new'))
              }
            />
          ) : (
            <>
              {teachers.map((teacher, index) => (
                <TeacherItem
                  key={teacher.id}
                  divider={index > 0}
                  teacher={teacher}
                  onPress={() =>
                    navigate(
                      PathRoutes.teacher.details.replace(':id', teacher.id),
                    )
                  }
                />
              ))}
              {!isTheEnd && (
                <Button mt="8px" variant="outlined" onPress={loadNextPage}>
                  {t('common.load-more')}
                </Button>
              )}
            </>
          )}
        </VStack>
      </ScrollView>

      <BottomNavigator active="home" />
    </SafeAreaView>
  );
};

export default HomeScreen;
