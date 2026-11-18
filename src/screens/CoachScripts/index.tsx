import React, {useEffect, useState} from 'react';
import Page from '../../components/Page';
import Pdf from 'react-native-pdf';
import {Spinner, View} from 'native-base';
import {Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';

const CoachScriptsScreen: React.FC = () => {
  const {t} = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Page title={t('home.menu-items.coachScript')} back noPadding>
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
