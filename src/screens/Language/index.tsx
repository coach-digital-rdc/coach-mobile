import React, {useState} from 'react';
import {Center, Image, ScrollView, Text, VStack} from 'native-base';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import i18n from '../../i18n';
import {StorageService} from '../../services/storage.service';
import {LoginLogo} from '../../assets/images/logos';
import RadioCard from '../../components/RadioCard';
import PathRoutes from '../../routers/paths';
import Button from '../../components/Button';
import Page from '../../components/Page';

const LANGUAGES = [
  {value: 'fr', title: 'Français', description: 'Langue par défaut en RDC'},
  {
    value: 'en',
    title: 'English',
    description: 'Available for international users',
  },
];

// "Choix de la langue" of the mockups, shown on the first start (B01).
const LanguageScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(i18n.language || 'fr');

  const choose = (value: string) => {
    setLanguage(value);
    // The screen is shown at once in the chosen language
    i18n.changeLanguage(value);
    moment.locale(value);
  };

  const handleContinue = async () => {
    await StorageService.setLanguage(language);
    navigate(PathRoutes.login.main, {replace: true});
  };

  return (
    <Page noPadding>
      <ScrollView flex={1} px="16px">
        <Center pt="48px">
          <Image source={LoginLogo} alt="Coach Digital" w="72px" h="72px" />
          <Text mt="16px" fontSize="24px" fontWeight={600} color="gray.700">
            Choisissez la langue
          </Text>
          <Text mt="4px" mb="24px" fontSize="14px" color="gray.600">
            Choose your language
          </Text>
        </Center>
        {LANGUAGES.map(item => (
          <RadioCard
            key={item.value}
            title={item.title}
            description={item.description}
            selected={language === item.value}
            onPress={() => choose(item.value)}
          />
        ))}
        <Text mt="8px" textAlign="center" fontSize="13px" color="gray.500">
          {t('language.hint')}
        </Text>
      </ScrollView>
      <VStack px="16px" pb="16px" pt="8px">
        <Button w="full" mb={0} onPress={handleContinue}>
          {t('language.continue')}
        </Button>
      </VStack>
    </Page>
  );
};

export default LanguageScreen;
