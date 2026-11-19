import React, {useEffect, useState} from 'react';
import {Box, Center, HStack, Text, VStack, useTheme} from 'native-base';
import {StyleSheet} from 'react-native';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {useCoachContext} from '../../providers/coach.provider';
import {School} from '../../types/school';
import PathRoutes from '../../routers/paths';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Page, {GUTTER} from '../../components/Page';

const FRAME = 240;

// "Scanner le QR code" of the mockups: the QR code of the school, printed from the
// administration, configures the device for this school.
const QrScanScreen: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {selectSchool} = useCoachContext();
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [school, setSchool] = useState<School>();
  const [invalid, setInvalid] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      const value = codes[0]?.value;
      if (!value || school) {
        return;
      }
      try {
        const scanned: School = JSON.parse(value);
        if (scanned?.id && scanned?.name) {
          setSchool(scanned);
          setInvalid(false);
          return;
        }
      } catch {}
      setInvalid(true);
    },
  });

  const confirm = async () => {
    if (school) {
      await selectSchool(school);
      navigate(PathRoutes.syncDetails, {replace: true});
    }
  };

  return (
    <Page back title={t('qrScan.title')} noPadding>
      <Box flex={1} bg="gray.700">
        {device && hasPermission && !school && (
          <Camera
            device={device}
            isActive={true}
            codeScanner={codeScanner}
            style={StyleSheet.absoluteFill}
            // The school can still be chosen from the list
            onError={() => setCameraError(true)}
          />
        )}
        <Center flex={1}>
          <Box
            w={`${FRAME}px`}
            h={`${FRAME}px`}
            borderWidth="3px"
            borderRadius="20px"
            borderColor={school ? 'green.200' : 'white'}
            alignItems="center"
            justifyContent="center">
            {school && (
              <Icon
                name="check-circle-solid"
                size={64}
                color={theme.colors.green['200']}
              />
            )}
          </Box>
          <Text mt="16px" fontSize="15px" fontWeight={600} color="white">
            {school
              ? t('qrScan.found')
              : cameraError
              ? t('qrScan.camera-error')
              : invalid
              ? t('qrScan.invalid')
              : t('qrScan.hint')}
          </Text>
          {!hasPermission && (
            <Text mt="8px" px="32px" textAlign="center" color="gray.300">
              {t('qrScan.permission')}
            </Text>
          )}
        </Center>
      </Box>

      <VStack px={GUTTER} pb="16px" pt="12px" bg="white">
        {school ? (
          <>
            <HStack
              mb="8px"
              p="8px"
              space={2}
              alignItems="center"
              borderRadius="10px"
              bg="green.0">
              <Icon
                name="check-circle-solid"
                size={18}
                color={theme.colors.green['300']}
              />
              <Text flex={1} fontSize="13px" color="green.300">
                {school.name}
              </Text>
            </HStack>
            <Button w="full" mb={0} onPress={confirm}>
              {t('qrScan.confirm')}
            </Button>
          </>
        ) : (
          <Button
            w="full"
            mb={0}
            variant="outlined"
            onPress={() => navigate(-1)}>
            {t('qrScan.list')}
          </Button>
        )}
      </VStack>
    </Page>
  );
};

export default QrScanScreen;
