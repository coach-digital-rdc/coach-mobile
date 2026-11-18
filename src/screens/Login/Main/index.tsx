import {useState} from 'react';
import {
  Text,
  VStack,
  Center,
  HStack,
  useTheme,
  KeyboardAvoidingView,
} from 'native-base';
import {Platform} from 'react-native';
import Icon from '../../../components/Icon';
import Page from '../../../components/Page';
import {useTranslation} from 'react-i18next';
import Button from '../../../components/Button';
import {useNavigate} from 'react-router-native';
import PathRoutes from '../../../routers/paths';
import InputText from '../../../components/InputText';
import LogoLockup from '../../../components/LogoLockup';
import {CoachService} from '../../../services/coach.service';

const LoginScreen: React.FC = () => {
  const [UserID, setUserID] = useState<{value: string; hasError: boolean}>();
  const navigate = useNavigate();
  const {t} = useTranslation();
  const theme = useTheme();

  const handleSubmitLogin = async () => {
    try {
      if (UserID?.value) {
        await CoachService.sendEmailOTP(UserID?.value.toLowerCase().trim());

        navigate(PathRoutes.login.otp.replace(':id', UserID.value));
      }
    } catch (err) {
      setUserID(user => ({value: user?.value || '', hasError: true}));
    }
  };

  return (
    <Page setting>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <VStack flex={1}>
          <Center pt="24px" pb="32px">
            <LogoLockup size={56} />
          </Center>

          <Text fontSize="24px" fontWeight={600} color="gray.700">
            {t('login.main.welcome')}
          </Text>
          <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
            {t('login.main.subtitle')}
          </Text>

          <Text fontSize="13px" fontWeight={500} color="gray.700">
            {t('login.main.user_id')}
          </Text>
          <InputText
            mt="4px"
            fontSize="14px"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder={t('login.main.user_id_placeholder') || ''}
            onChangeText={value => setUserID({hasError: false, value})}
            isInvalid={UserID?.hasError}
            value={UserID?.value || ''}
          />

          {UserID?.hasError && (
            <HStack mt={2} alignContent={'flex-start'} space={'4px'}>
              <Icon
                name={'exclamation-circle-solid'}
                size={18}
                color={theme.colors.red['200']}
              />
              <Text
                flex={1}
                fontSize={'TXS'}
                color={'red.200'}
                fontWeight={400}>
                {t('login.main.error')}
              </Text>
            </HStack>
          )}

          <Button
            mt="20px"
            w="full"
            onPress={handleSubmitLogin}
            disabled={!UserID?.value}>
            <Text
              fontSize="15px"
              color={!UserID?.value ? 'gray.400' : 'gray.0'}
              fontWeight={600}>
              {t('login.main.button')}
            </Text>
          </Button>

          <Text textAlign="center" fontSize="14px" color="gray.600">
            {t('login.main.create_account')}
            <Text
              fontWeight={600}
              color={'primary.200'}
              onPress={() => navigate(PathRoutes.signup.main)}>
              {t('login.main.create_account_button')}
            </Text>
          </Text>
        </VStack>
      </KeyboardAvoidingView>
    </Page>
  );
};

export default LoginScreen;
