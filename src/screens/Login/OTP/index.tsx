import {HStack, Text, VStack, useTheme} from 'native-base';
import Page from '../../../components/Page';
import {useNavigate, useParams} from 'react-router-native';
import Button from '../../../components/Button';
import {useState} from 'react';
import PinInput from '../../../components/PinInput';
import PathRoutes from '../../../routers/paths';
import Icon from '../../../components/Icon';
import {useTranslation} from 'react-i18next';
import {CoachService} from '../../../services/coach.service';
import {useCoachContext} from '../../../providers/coach.provider';
import CompetenceService from '../../../services/competence.service';
import {QuestionService} from '../../../services/question.service';
import {StorageService} from '../../../services/storage.service';

const OTPScreen: React.FC = () => {
  const [OTPCode, setOTPCode] = useState<{hasError: boolean; value: string}>();
  const {loginOTP} = useCoachContext();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {t} = useTranslation();
  const theme = useTheme();
  const {id} = useParams();

  const handleVerifyCode = async () => {
    setIsLoading(true);
    try {
      if (id && OTPCode?.value) {
        const {data} = await CoachService.verifyOTP(
          id.toLowerCase().trim(),
          OTPCode.value,
        );

        await loginOTP(data.coach);
        await CompetenceService.sync(data.competencies);
        await QuestionService.sync(data.questions);
        await StorageService.setLastSync(new Date());

        navigate(PathRoutes.selectSchool, {replace: true});
      }
    } catch (err) {
      setOTPCode(otp => ({value: otp?.value || '', hasError: true}));
    }
    setIsLoading(false);
  };

  const handleResendCode = async () => {
    if (id) {
      await CoachService.sendEmailOTP(id.toLowerCase().trim());
    }
  };

  return (
    <Page back title={t('login.otp.header') || ''}>
      <VStack flex={1}>
        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('login.otp.heading')}
        </Text>
        <Text mt="8px" fontSize="14px" color="gray.600">
          {t('login.otp.title')}{' '}
          <Text fontWeight={700} color="gray.700">
            {id}
          </Text>
        </Text>

        <VStack my="16px">
          <PinInput
            length={6}
            isInvalid={OTPCode?.hasError}
            onChangeText={value => setOTPCode({hasError: false, value})}
          />
        </VStack>

        {OTPCode?.hasError && (
          <HStack mb={2} alignContent={'flex-start'} space={'4px'}>
            <Icon
              name={'exclamation-circle-solid'}
              size={18}
              color={theme.colors.red['200']}
            />
            <Text fontSize={'TXS'} color={'red.200'} fontWeight={400}>
              {t('login.otp.error')}
            </Text>
          </HStack>
        )}

        <Button
          mt="4px"
          w="full"
          isLoading={isLoading}
          onPress={handleVerifyCode}
          disabled={!OTPCode?.value}>
          <Text
            fontSize="15px"
            color={!OTPCode?.value ? 'gray.400' : 'gray.0'}
            fontWeight={600}>
            {t('login.otp.button')}
          </Text>
        </Button>

        <Text textAlign="center" fontSize="14px" color="gray.600">
          {t('login.otp.not_receive_code')}{' '}
          <Text fontWeight={600} color="primary.200" onPress={handleResendCode}>
            {t('login.otp.resend_code')}
          </Text>
        </Text>
        <Text
          mt="8px"
          textAlign="center"
          fontSize="14px"
          fontWeight={600}
          color="primary.200"
          onPress={() => navigate(PathRoutes.login.main)}>
          {t('login.otp.change_email')}
        </Text>
      </VStack>
    </Page>
  );
};

export default OTPScreen;
