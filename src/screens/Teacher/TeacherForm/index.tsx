import React, {useEffect, useState} from 'react';
import {
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
  useToast,
} from 'native-base';
import {useNavigate, useParams} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import {useFormik} from 'formik';
import {teacherFormValidate} from '../../../helpers/validate.helper';
import {getSubjectOptions} from '../../../helpers/subjects.helper';
import {useCoachContext} from '../../../providers/coach.provider';
import {TeacherService} from '../../../services/teacher.service';
import SegmentedChoice from '../../../components/SegmentedChoice';
import SelectModal from '../../../components/SelectModal';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import Page from '../../../components/Page';

export type FormValuesType = {
  name?: string;
  surname?: string;
  subject?: string;
  sex?: string;
  weekly_load?: string;
  nin: string;
  email?: string;
};

// Teacher form of the mockups: name, sex, main subject, weekly load and registration number.
const TeacherFormScreen: React.FC = () => {
  const toast = useToast();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {currentSchool} = useCoachContext();
  const params = useParams<{id: string}>();
  const isNew = params.id === 'new';
  const [loading, setLoading] = useState(!isNew);

  const onSubmit = async (values: FormValuesType) => {
    const teacher = {
      name: values.name?.trim(),
      surname: values.surname?.trim(),
      subject: values.subject,
      sex: values.sex,
      weekly_load: values.weekly_load ? parseInt(values.weekly_load, 10) : null,
      nin: values.nin?.trim(),
    };

    if (isNew) {
      await TeacherService.create({...teacher, school_id: currentSchool?.id});
    } else {
      const current = await TeacherService.getTeacherToEdit(params.id || '');
      await TeacherService.update(params.id || '', {
        ...teacher,
        pin: current.pin,
        image_id: current.image_id,
        emis_number: current.emis_number,
      });
    }

    toast.show({
      placement: 'top',
      render: () => (
        <Toast
          title={
            isNew ? t('teacher.form.success') : t('teacher.form.success_update')
          }
          icon="check-circle-solid"
        />
      ),
    });
    navigate(-1);
  };

  const {values, errors, handleSubmit, setFieldValue, setValues} =
    useFormik<FormValuesType>({
      initialValues: {
        name: '',
        surname: '',
        subject: '',
        sex: 'F',
        weekly_load: '',
        nin: '',
      },
      validate: teacherFormValidate,
      validateOnChange: false,
      onSubmit,
    });

  useEffect(() => {
    if (!isNew && params.id) {
      TeacherService.getTeacherToEdit(params.id).then(teacher => {
        setValues({
          name: teacher.name,
          surname: teacher.surname,
          subject: teacher.subject || '',
          sex: teacher.sex || 'F',
          weekly_load: teacher.weekly_load ? String(teacher.weekly_load) : '',
          nin: teacher.nin || '',
        });
        setLoading(false);
      });
    }
  }, [isNew, params.id, setValues]);

  if (loading) {
    return (
      <Center flex={1}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Page
      back
      title={
        isNew ? t('teacher.form.title-new') : t('teacher.form.title-edit')
      }>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {isNew ? t('teacher.form.heading-new') : t('teacher.form.title-edit')}
        </Text>
        <Text mt="8px" mb="8px" fontSize="14px" color="gray.600">
          {t('teacher.form.subtitle')}
        </Text>

        <HStack space={3}>
          <FormField
            label={t('teacher.form.surname')}
            value={values.surname}
            isInvalid={!!errors.surname}
            placeholder={t('teacher.form.surname-placeholder') || ''}
            onChangeText={value => setFieldValue('surname', value)}
          />
          <FormField
            label={t('teacher.form.name')}
            value={values.name}
            isInvalid={!!errors.name}
            placeholder={t('teacher.form.name-placeholder') || ''}
            onChangeText={value => setFieldValue('name', value)}
          />
        </HStack>

        <SegmentedChoice
          label={t('teacher.form.sex')}
          value={values.sex}
          options={[
            {value: 'F', label: t('teacher.form.female')},
            {value: 'M', label: t('teacher.form.male')},
          ]}
          onChange={value => setFieldValue('sex', value)}
        />

        <VStack mt="10px" space="4px">
          <Text fontSize="13px" fontWeight={500} color="gray.700">
            {t('teacher.form.subject')}
          </Text>
          <SelectModal
            value={values.subject}
            bottomTitle={t('teacher.form.subject')}
            placeholder={t('teacher.form.subject') || ''}
            options={getSubjectOptions(t).map(subject => ({
              value: subject,
              label: subject,
            }))}
            handleSelectValue={value => setFieldValue('subject', value)}
          />
        </VStack>

        <HStack space={3}>
          <FormField
            label={t('teacher.form.weekly-load')}
            keyboardType="number-pad"
            value={values.weekly_load}
            placeholder="24"
            onChangeText={value =>
              setFieldValue('weekly_load', value.replace(/\D/g, ''))
            }
          />
          <FormField
            optional
            label={t('teacher.form.matricule')}
            value={values.nin}
            onChangeText={value => setFieldValue('nin', value)}
          />
        </HStack>
      </ScrollView>

      <Button
        mt="16px"
        w="full"
        disabled={!values.name?.trim() || !values.surname?.trim()}
        onPress={() => handleSubmit()}>
        {isNew
          ? t('teacher.form.new-teacher-button')
          : t('teacher.form.update-teacher-button')}
      </Button>
    </Page>
  );
};

export default TeacherFormScreen;
