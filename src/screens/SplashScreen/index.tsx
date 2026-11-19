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
import {Linking} from 'react-native';
import {AppService} from '../../services/app.service';
import {compareVersions} from '../../helpers/version.helper';
import ConfirmDialog from '../../components/ConfirmDialog';
import moment from 'moment';
import i18n from '../../i18n';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const {isConnected} = useNetInfo();
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState<{
    latest: string;
    url: string | null;
    mandatory: boolean;
    route: string;
  }>();
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

        let route: string;
        if (!language) {
          // First start: the user chooses the language
          route = PathRoutes.language;
        } else if (LOGIN_MODE === 'OTP') {
          if (!currentCoach) {
            route = PathRoutes.login.main;
          } else if (!currentSchool) {
            route = PathRoutes.selectSchool;
          } else {
            route = PathRoutes.home.main;
          }
        } else {
          if (!currentSchool) {
            route = PathRoutes.selectSchool;
          } else if (!currentCoach) {
            route = PathRoutes.selectAccount;
          } else {
            route = PathRoutes.home.main;
          }
        }

        // A newer version is offered, and required below the minimum version (B28)
        // The network state may not be known yet: the request has a short timeout
        const versions =
          isConnected !== false ? await AppService.getVersions() : undefined;
        const installed = getVersion();
        if (
          versions?.latest_version &&
          compareVersions(installed, versions.latest_version) < 0
        ) {
          setUpdate({
            latest: versions.latest_version,
            url: versions.download_url,
            mandatory:
              !!versions.min_version &&
              compareVersions(installed, versions.min_version) < 0,
            route,
          });
        } else {
          navigate(route, {replace: true});
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
      <ConfirmDialog
        isOpen={!!update}
        title={t('splash.update-title')}
        message={t(
          update?.mandatory
            ? 'splash.update-required'
            : 'splash.update-message',
          {value: update?.latest},
        )}
        confirmLabel={t('splash.update')}
        cancelLabel={t('splash.later') || ''}
        hideCancel={update?.mandatory}
        onConfirm={() => update?.url && Linking.openURL(update.url)}
        onCancel={() => update && navigate(update.route, {replace: true})}
      />
    </Center>
  );
};

export default SplashScreen;
