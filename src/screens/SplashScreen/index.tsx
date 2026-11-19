import React, {useCallback, useEffect, useState} from 'react';
import {Center, Image, Spinner, Text} from 'native-base';
import {getVersion} from 'react-native-device-info';
import {useTranslation} from 'react-i18next';
import {LoginLogo} from '../../assets/images/logos';
import {runMigrations} from '../../database/migrations';
import SyncService from '../../services/sync.service';
import {useNetInfo} from '@react-native-community/netinfo';
import {useNavigate} from 'react-router-native';
import PathRoutes from '../../routers/paths';
import {StorageService} from '../../services/storage.service';
import {useCoachContext} from '../../providers/coach.provider';
import {LOGIN_MODE} from '@env';
import {useCameraPermission} from 'react-native-vision-camera';
import {runSeeds} from '../../database/seeds';
import moment from 'moment';
import i18n from '../../i18n';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {isConnected} = useNetInfo();
  const [isLoading, setIsLoading] = useState(false);
  const {selectCoach, selectSchool} = useCoachContext();
  const {hasPermission, requestPermission} = useCameraPermission();

  const setupApp = useCallback(async () => {
    setIsLoading(true);

    try {
      if (!isLoading) {
        await runMigrations();
        await runSeeds();
        await requestAllPermission();

        const currentCoach = await StorageService.getCurrentCoach();
        const currentSchool = await StorageService.getCurrentSchool();
        const language = await StorageService.getLanguage();
        if (language) {
          await i18n.changeLanguage(language);
          moment.locale(language);
        }

        if (isConnected && currentSchool) {
          await SyncService.trySyncData();
        }

        // Wait for both to be set: the home screen goes back to the school
        // selection while no school is selected.
        await selectCoach(currentCoach);
        await selectSchool(currentSchool);

        if (!language) {
          // First start: the user chooses the language
          navigate(PathRoutes.language, {replace: true});
        } else if (LOGIN_MODE === 'OTP') {
          if (!currentCoach) {
            navigate(PathRoutes.login.main, {replace: true});
          } else if (!currentSchool) {
            navigate(PathRoutes.selectSchool, {replace: true});
          } else {
            navigate(PathRoutes.home.main, {replace: true});
          }
        } else {
          if (!currentSchool) {
            navigate(PathRoutes.selectSchool, {replace: true});
          } else if (!currentCoach) {
            navigate(PathRoutes.selectAccount, {replace: true});
          } else {
            navigate(PathRoutes.home.main, {replace: true});
          }
        }
      }
    } catch {}
  }, []);

  const requestAllPermission = async () => {
    try {
      if (!hasPermission) {
        await requestPermission();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setupApp();
  }, [setupApp]);

  return (
    <Center flex={1} bg="gray.0">
      <Image source={LoginLogo} alt={'Logo'} w="112px" h="112px" />
      <Text mt="24px" fontSize="28px" fontWeight={700} color="primary.300">
        Coach Digital
      </Text>
      <Text mt="8px" fontSize="14px" color="gray.600">
        {t('splash.tagline')}
      </Text>
      <Spinner size="lg" mt="32px" />
      <Text position="absolute" bottom="32px" fontSize="12px" color="gray.500">
        {t('splash.version', {value: getVersion()})}
      </Text>
    </Center>
  );
};

export default SplashScreen;
