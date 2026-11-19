import React, {useEffect, useState} from 'react';
import Page, {GUTTER} from '../../components/Page';
import Pdf from 'react-native-pdf';
import {HStack, Spinner, Text, View, useTheme} from 'native-base';
import Icon from '../../components/Icon';
import {Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

const CoachScriptsScreen: React.FC = () => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Page title={t('settings.manual')} back noPadding>
      <HStack px={GUTTER} py="8px">
        <HStack
          px="8px"
          py="2px"
          space={1}
          alignItems="center"
          borderRadius="999px"
          bg="green.0">
          <Icon name="check" size={12} color={theme.colors.green['300']} />
          <Text fontSize="12px" fontWeight={600} color="green.300">
            {t('settings.manual-offline')}
          </Text>
        </HStack>
      </HStack>
      <View flex={1}>
        {show ? (
          <Pdf
            trustAllCerts={true}
            source={{
              uri: 'bundle-assets://Manuel_utilisation_RDC.pdf',
              cache: true,
            }}
            style={{
              flex: 1,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}
          />
        ) : (
          <Spinner />
        )}
      </View>
    </Page>
  );
};

export default CoachScriptsScreen;
