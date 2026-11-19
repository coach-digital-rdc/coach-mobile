import React, {useCallback, useEffect, useState} from 'react';
import {Center, HStack, ScrollView, Text, VStack, useTheme} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {getVersion} from 'react-native-device-info';
import i18n from '../../i18n';
import {useCoachContext} from '../../providers/coach.provider';
import {StorageService} from '../../services/storage.service';
import {Coach} from '../../types/coach';
import BottomNavigator from '../Home/BottomNavigator';
import PathRoutes from '../../routers/paths';
import Icon from '../../components/Icon';
import Page from '../../components/Page';

const LANGUAGES = [
  {value: 'fr', label: 'Français'},
  {value: 'en', label: 'English'},
];

const SettingRow: React.FC<{
  icon: string;
  title: string;
  subtitle?: string;
  danger?: boolean;
  divider?: boolean;
  onPress?: () => void;
  right?: React.ReactNode;
}> = ({icon, title, subtitle, danger, divider, onPress, right}) => {
  const theme = useTheme();
  const color = danger ? theme.colors.red['200'] : theme.colors.gray['600'];
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <HStack
        py="14px"
        space={3}
        alignItems="center"
        borderTopWidth={divider ? '1px' : 0}
        borderTopColor="gray.100">
        <Icon name={icon as any} size={20} color={color} />
        <VStack flex={1}>
          <Text
            fontSize="15px"
            fontWeight={600}
            color={danger ? 'red.200' : 'gray.700'}>
            {title}
          </Text>
          {!!subtitle && (
            <Text fontSize="12px" color="gray.600">
              {subtitle}
            </Text>
          )}
        </VStack>
        {right ||
          (onPress && !danger && (
            <Icon
              name="angle-right"
              size={20}
              color={theme.colors.gray['500']}
            />
          ))}
      </HStack>
    </TouchableOpacity>
  );
};

// "Paramètres" of the mockups: profile of the observer, school, language, synchronisation,
// manual, version and logout.
const SettingsScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {logout, currentCoach: loggedCoach, currentSchool} = useCoachContext();
  // The profile is read again: the synchronisation may have updated it
  const [currentCoach, setCurrentCoach] = useState<Coach | null>(loggedCoach);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [language, setLanguage] = useState(i18n.language);

  const load = useCallback(async () => {
    setLastSync(await StorageService.getLastSync());
    setCurrentCoach((await StorageService.getCurrentCoach()) || loggedCoach);
  }, [loggedCoach]);

  useEffect(() => {
    load();
  }, [load]);

  const changeLanguage = async (value: string) => {
    setLanguage(value);
    await i18n.changeLanguage(value);
    moment.locale(value);
    await StorageService.setLanguage(value);
  };

  const profile = [
    currentCoach?.function
      ? t(`observer.function.${currentCoach.function}`)
      : '',
    currentCoach?.duty_station,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Page title={t('settings.title')} noPadding>
      <ScrollView flex={1} px="16px">
        <HStack mt="16px" mb="8px" space={3} alignItems="center">
          <Center w="56px" h="56px" borderRadius="28px" bg="primary.0">
            <Icon name="user" size={28} color={theme.colors.primary['200']} />
          </Center>
          <VStack flex={1}>
            <Text fontSize="20px" fontWeight={600} color="gray.700">
              {[currentCoach?.name, currentCoach?.surname]
                .filter(Boolean)
                .join(' ')}
            </Text>
            {!!profile && (
              <Text fontSize="13px" color="gray.600">
                {profile}
              </Text>
            )}
          </VStack>
        </HStack>

        <SettingRow
          icon="book-alt"
          title={t('settings.school')}
          subtitle={currentSchool?.name}
          onPress={() => navigate(PathRoutes.selectSchool)}
          right={
            <Text fontSize="14px" fontWeight={600} color="primary.200">
              {t('settings.change')}
            </Text>
          }
        />
        <SettingRow
          divider
          icon="comment"
          title={t('settings.language')}
          right={
            <HStack p="3px" borderRadius="10px" bg="gray.100">
              {LANGUAGES.map(item => {
                const active = item.value === language;
                return (
                  <TouchableOpacity
                    key={item.value}
                    accessibilityRole="radio"
                    accessibilityState={{checked: active}}
                    onPress={() => changeLanguage(item.value)}>
                    <Text
                      px="10px"
                      py="5px"
                      fontSize="13px"
                      borderRadius="8px"
                      overflow="hidden"
                      bg={active ? 'white' : 'transparent'}
                      color={active ? 'primary.200' : 'gray.600'}
                      fontWeight={active ? 600 : 400}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </HStack>
          }
        />
        <SettingRow
          divider
          icon="sync"
          title={t('settings.sync')}
          subtitle={
            lastSync
              ? t('settings.last-sync', {value: moment(lastSync).calendar()})
              : t('settings.never-synced')
          }
          onPress={() => navigate(PathRoutes.sync)}
        />
        <SettingRow
          divider
          icon="books"
          title={t('settings.manual')}
          subtitle={t('settings.manual-offline')}
          onPress={() => navigate(PathRoutes.coachScripts)}
        />
        <SettingRow
          divider
          icon="info-circle"
          title={t('settings.appVersion')}
          subtitle={getVersion()}
        />
        {!!currentCoach && (
          <SettingRow
            divider
            danger
            icon="signout"
            title={t('settings.logout')}
            onPress={logout}
          />
        )}
      </ScrollView>
      <BottomNavigator active="settings" />
    </Page>
  );
};

export default SettingsScreen;
