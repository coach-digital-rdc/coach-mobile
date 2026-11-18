import React from 'react';
import {HStack, Image, Text, VStack} from 'native-base';
import {useTranslation} from 'react-i18next';
import {COUNTRY} from '@env';
import {LoginLogo} from '../../assets/images/logos';

// Logo and name of the application, as on the login screen of the mockups.
const LogoLockup: React.FC<{size?: number}> = ({size = 56}) => {
  const {t} = useTranslation();

  return (
    <HStack space={3} alignItems="center">
      <Image
        source={LoginLogo}
        alt="Coach Digital"
        w={`${size}px`}
        h={`${size}px`}
      />
      <VStack>
        <Text fontSize="19px" fontWeight={700} color="gray.700">
          Coach Digital
        </Text>
        <Text
          fontSize="10px"
          fontWeight={600}
          letterSpacing="0.5px"
          color="gray.500">
          {`${t('login.main.tagline')}${
            COUNTRY === 'cd' ? ' · RDC' : ''
          }`.toUpperCase()}
        </Text>
      </VStack>
    </HStack>
  );
};

export default LogoLockup;
