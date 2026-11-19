import React, {useState} from 'react';
import {HStack, ScrollView, Text, VStack, useToast} from 'native-base';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {CoachService} from '../../../services/coach.service';
import {Coach} from '../../../types/coach';
import SegmentedChoice from '../../../components/SegmentedChoice';
import FormField from '../../../components/FormField';
import RadioCard from '../../../components/RadioCard';
import Toast from '../../../components/Toast';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Page from '../../../components/Page';

export const OBSERVER_FUNCTIONS = [
  'INSPECTOR',
  'ADVISOR',
  'SCHOOL_HEAD',
  'PEER',
] as const;

// Inspectors and advisors work on an area; school heads and peers on a school
const isZoneBased = (observerFunction?: string | null) =>
  observerFunction === 'INSPECTOR' || observerFunction === 'ADVISOR';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// "Compte observateur" of the mockups (B21): the profile is shown in the header of each
// observation sheet. The account is then confirmed with the code sent by e-mail.
const SignupScreen: React.FC = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [coach, setCoach] = useState<Partial<Coach>>({
    name: '',
    surname: '',
    sex: '',
    function: 'INSPECTOR',
    duty_station: '',
    postal_box: '',
    phone: '',
    email: '',
  });

  const change = (value: Partial<Coach>) =>
    setCoach(current => ({...current, ...value}));

  const ready =
    !!coach.name?.trim() &&
    !!coach.surname?.trim() &&
    EMAIL.test(coach.email?.trim() || '');

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const email = coach.email!.trim();
      await CoachService.signup({
        ...coach,
        name: coach.name?.trim(),
        surname: coach.surname?.trim(),
        email,
      });
      navigate(PathRoutes.login.otp.replace(':id', email));
    } catch (err) {
      toast.show({
        placement: 'top',
        render: () => (
          <Toast
            type="error"
            icon="exclamation-circle"
            title={t('login.createAccount.error')}
          />
        ),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Page back title={t('login.createAccount.title')} noPadding>
      <ScrollView flex={1} px="16px" keyboardShouldPersistTaps="handled">
        <Text mt="8px" fontSize="24px" fontWeight={600} color="gray.700">
          {t('login.createAccount.heading')}
        </Text>
        <Text mt="8px" fontSize="14px" color="gray.600">
          {t('login.createAccount.subtitle')}
        </Text>

        <HStack space={3}>
          <FormField
            label={t('login.createAccount.name')}
            value={coach.name || ''}
            onChangeText={name => change({name})}
          />
          <FormField
            label={t('login.createAccount.surname')}
            value={coach.surname || ''}
            autoCapitalize="characters"
            onChangeText={surname => change({surname})}
          />
        </HStack>
        <SegmentedChoice
          label={t('login.createAccount.sex')}
          value={coach.sex}
          options={[
            {value: 'F', label: t('teacher.form.female')},
            {value: 'M', label: t('teacher.form.male')},
          ]}
          onChange={sex => change({sex})}
        />

        <Text
          mt="16px"
          mb="6px"
          fontSize="13px"
          fontWeight={500}
          color="gray.700">
          {t('login.createAccount.function')}
        </Text>
        {OBSERVER_FUNCTIONS.map(item => (
          <RadioCard
            key={item}
            title={t(`observer.function.${item}`)}
            description={t(`observer.scope.${item}`)}
            selected={coach.function === item}
            onPress={() => change({function: item})}
          />
        ))}

        <FormField
          label={
            isZoneBased(coach.function)
              ? t('login.createAccount.zone')
              : t('login.createAccount.duty-station')
          }
          placeholder={
            (isZoneBased(coach.function)
              ? t('login.createAccount.zone-placeholder')
              : t('login.createAccount.duty-station-placeholder')) || ''
          }
          value={coach.duty_station || ''}
          onChangeText={duty_station => change({duty_station})}
        />
        <FormField
          optional
          label={t('login.createAccount.postal-box')}
          value={coach.postal_box || ''}
          onChangeText={postal_box => change({postal_box})}
        />
        <HStack mb="16px" space={3}>
          <FormField
            label={t('login.createAccount.phone')}
            keyboardType="phone-pad"
            value={coach.phone || ''}
            onChangeText={phone => change({phone})}
          />
          <FormField
            label={t('login.createAccount.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={coach.email || ''}
            onChangeText={email => change({email})}
          />
        </HStack>
      </ScrollView>
      <VStack px="16px" pb="16px" pt="8px">
        <Button
          w="full"
          mb={0}
          disabled={!ready}
          isLoading={isSaving}
          onPress={handleCreate}>
          {t('login.createAccount.create-account-button')}
        </Button>
      </VStack>
    </Page>
  );
};

export default SignupScreen;
