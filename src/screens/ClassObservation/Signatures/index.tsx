import React, {useEffect, useState} from 'react';
import {
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  VStack,
  useTheme,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useLocation, useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import CompetenceService from '../../../services/competence.service';
import {SessionService} from '../../../services/session.service';
import {TeacherService} from '../../../services/teacher.service';
import {ScoreService} from '../../../services/score.service';
import {PdpService} from '../../../services/pdp.service';
import {ChecklistService} from '../../../services/checklist.service';
import {
  SignatureInput,
  SignatureService,
} from '../../../services/signature.service';
import {useCoachContext} from '../../../providers/coach.provider';
import {Session} from '../../../types/session';
import {SignerRole} from '../../../types/session-signature';
import {getSuggestedScore} from '../../../helpers/answer.helper';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PhaseStepper from '../../../components/PhaseStepper';
import SignaturePad from '../../../components/SignaturePad';
import FormField from '../../../components/FormField';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page, {GUTTER} from '../../../components/Page';

const CheckLine: React.FC<{
  label: string;
  checked: boolean;
  onPress: () => void;
}> = ({label, checked, onPress}) => {
  const theme = useTheme();
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{checked}}
      onPress={onPress}>
      <HStack mt="8px" space={2} alignItems="center">
        <Center
          w="20px"
          h="20px"
          borderWidth="1px"
          borderRadius="4px"
          borderColor={checked ? 'primary.200' : 'gray.300'}
          bg={checked ? 'primary.200' : 'white'}>
          {checked && (
            <Icon name="check" size={12} color={theme.colors.white} />
          )}
        </Center>
        <Text fontSize="14px" color="gray.700">
          {label}
        </Text>
      </HStack>
    </TouchableOpacity>
  );
};

// "Signatures et clôture" of the mockups (B17): the teacher, the school head and the observer
// sign with the finger; the teacher may refuse and only the school head may be absent,
// with the reason. The session is closed once the scoring, the PDP and the signatures are done.
const ClassObservationSignatures: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {state} = useLocation();
  const {currentCoach} = useCoachContext();
  const sessionId: string = state?.session?.id;
  const [session, setSession] = useState<Session>();
  const [signatures, setSignatures] = useState<{
    [role: string]: SignatureInput;
  }>({});
  const [scoring, setScoring] = useState({complete: false, label: ''});
  const [pdpValidated, setPdpValidated] = useState(false);
  const [uncheckedDocuments, setUncheckedDocuments] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [current, grid, answers, scores, saved, pdp, left] =
        await Promise.all([
          SessionService.getSessionById(sessionId),
          CompetenceService.listCompetenciesWithQuestions(),
          SessionService.getAnswersMap(sessionId),
          ScoreService.getScores(sessionId),
          SignatureService.getSignatures(sessionId),
          PdpService.getPdp(sessionId),
          ChecklistService.countUnchecked(sessionId),
        ]);
      const teacher = current?.teacher_id
        ? await TeacherService.getTeacherDetails(current.teacher_id)
        : undefined;
      const questions = grid.flatMap(competence => competence.questions);
      const answered = questions.filter(
        question => answers[question.id] !== undefined,
      ).length;
      const withScore = grid.filter(competence => competence.has_global_score);
      const scored = withScore.filter(
        competence =>
          (scores[competence.id]?.value ??
            getSuggestedScore(competence.questions, answers)) !== undefined,
      ).length;
      setScoring({
        complete: answered === questions.length && scored === withScore.length,
        label: t('classObservation.signatures.condition-scoring', {
          answered,
          total: questions.length,
          scored,
          scoreTotal: withScore.length,
        }),
      });
      setPdpValidated(pdp?.pdp.status === 'VALIDATED');
      setUncheckedDocuments(left);
      setSession(current);
      setSignatures({
        TEACHER: {
          signer_name: teacher?.name,
          svg: saved.TEACHER?.svg,
          refusal_reason: saved.TEACHER?.refusal_reason,
        },
        SCHOOL_HEAD: {
          signer_name: saved.SCHOOL_HEAD?.signer_name || '',
          svg: saved.SCHOOL_HEAD?.svg,
          absence_reason: saved.SCHOOL_HEAD?.absence_reason,
        },
        OBSERVER: {
          signer_name: currentCoach?.name,
          svg: saved.OBSERVER?.svg,
        },
      });
    };
    load();
  }, [sessionId, currentCoach, t]);

  // When the observer is the school head, the observer signs once for both
  const observerIsHead = session?.observer_function === 'SCHOOL_HEAD';
  const roles: SignerRole[] = observerIsHead
    ? ['TEACHER', 'OBSERVER']
    : ['TEACHER', 'SCHOOL_HEAD', 'OBSERVER'];

  // Each change is saved at once; the update reads the current state, since the
  // signature pad keeps the first version of this function
  const change = (role: SignerRole, value: Partial<SignatureInput>) =>
    setSignatures(current => {
      const next = {...current[role], ...value};
      SignatureService.saveSignature(sessionId, role, next);
      return {...current, [role]: next};
    });

  const signed = (role: SignerRole) => {
    const signature = signatures[role] || {};
    if (role === 'TEACHER') {
      return !!signature.svg || !!signature.refusal_reason?.trim();
    }
    if (role === 'SCHOOL_HEAD') {
      return (
        (!!signature.svg && !!signature.signer_name?.trim()) ||
        !!signature.absence_reason?.trim()
      );
    }
    return !!signature.svg;
  };

  const conditions = [
    {label: scoring.label, ok: scoring.complete, path: 'form'},
    {
      label: t('classObservation.signatures.condition-pdp'),
      ok: pdpValidated,
      path: 'pdp',
    },
    {
      label: t('classObservation.signatures.condition-signatures'),
      ok: roles.every(signed),
      path: '',
    },
  ];
  const ready = conditions.every(condition => condition.ok);

  const go = (path: string) =>
    navigate((PathRoutes.classObservation as any)[path], {
      replace: true,
      state: {
        session: {id: sessionId, teacher_id: session?.teacher_id},
        ...(path === 'checklist' && {
          returnTo: {
            path: PathRoutes.classObservation.signatures,
            state: {session: {id: sessionId}},
          },
        }),
      },
    });

  const close = async () => {
    setIsSaving(true);
    await SessionService.closeSession(sessionId);
    navigate(
      PathRoutes.classObservation.completed.replace(':sessionId', sessionId),
      {replace: true},
    );
  };

  const goBack = () => go('advice');

  if (!session) {
    return (
      <Center bg="white" w="full" h="full">
        <Spinner size="lg" />
      </Center>
    );
  }

  const card = (role: SignerRole, children: React.ReactNode) => (
    <VStack
      key={role}
      mb="16px"
      p="12px"
      borderWidth="1px"
      borderRadius="12px"
      borderColor="gray.200">
      <HStack alignItems="center" justifyContent="space-between">
        <Text fontSize="16px" fontWeight={700} color="gray.700">
          {t(`classObservation.signatures.role.${role}`)}
        </Text>
        {signed(role) && (
          <Icon
            name="check-circle-solid"
            size={20}
            color={theme.colors.green['200']}
          />
        )}
      </HStack>
      {children}
    </VStack>
  );

  const teacher = signatures.TEACHER || {};
  const head = signatures.SCHOOL_HEAD || {};
  const observer = signatures.OBSERVER || {};
  const refusing =
    teacher.refusal_reason !== null && teacher.refusal_reason !== undefined;
  const absent =
    head.absence_reason !== null && head.absence_reason !== undefined;

  return (
    <Page back title={t('classObservation.title')} onBack={goBack} noPadding>
      <PhaseStepper current="evaluation" />
      <ScrollView flex={1} px={GUTTER} showsVerticalScrollIndicator={false}>
        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.signatures.title')}
        </Text>
        <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
          {t('classObservation.signatures.subtitle')}
        </Text>

        {card(
          'TEACHER',
          <>
            <FormField
              readOnly
              label={t('classObservation.signatures.name')}
              value={teacher.signer_name || ''}
            />
            {refusing ? (
              <FormField
                label={t('classObservation.signatures.refusal')}
                placeholder={
                  t('classObservation.signatures.refusal-placeholder') || ''
                }
                value={teacher.refusal_reason || ''}
                onChangeText={refusal_reason =>
                  change('TEACHER', {refusal_reason})
                }
              />
            ) : (
              <SignaturePad
                title={t('classObservation.signatures.role.TEACHER')}
                value={teacher.svg}
                onChange={svg => change('TEACHER', {svg})}
              />
            )}
            <CheckLine
              label={t('classObservation.signatures.refuses')}
              checked={refusing}
              onPress={() =>
                change('TEACHER', {
                  refusal_reason: refusing ? null : '',
                  svg: null,
                })
              }
            />
          </>,
        )}

        {observerIsHead ? (
          <Text mb="16px" fontSize="13px" color="gray.600">
            {t('classObservation.signatures.observer-is-head')}
          </Text>
        ) : (
          card(
            'SCHOOL_HEAD',
            <>
              <FormField
                label={t('classObservation.signatures.name')}
                value={head.signer_name || ''}
                onChangeText={signer_name =>
                  change('SCHOOL_HEAD', {signer_name})
                }
              />
              {absent ? (
                <FormField
                  label={t('classObservation.signatures.absence')}
                  placeholder={
                    t('classObservation.signatures.absence-placeholder') || ''
                  }
                  value={head.absence_reason || ''}
                  onChangeText={absence_reason =>
                    change('SCHOOL_HEAD', {absence_reason})
                  }
                />
              ) : (
                <SignaturePad
                  title={t('classObservation.signatures.role.SCHOOL_HEAD')}
                  value={head.svg}
                  onChange={svg => change('SCHOOL_HEAD', {svg})}
                />
              )}
              <CheckLine
                label={t('classObservation.signatures.absent')}
                checked={absent}
                onPress={() =>
                  change('SCHOOL_HEAD', {
                    absence_reason: absent ? null : '',
                    svg: null,
                  })
                }
              />
            </>,
          )
        )}

        {card(
          'OBSERVER',
          <>
            <FormField
              readOnly
              label={t('classObservation.signatures.name')}
              value={observer.signer_name || ''}
            />
            <SignaturePad
              title={t('classObservation.signatures.role.OBSERVER')}
              value={observer.svg}
              onChange={svg => change('OBSERVER', {svg})}
            />
          </>,
        )}

        <Text mb="8px" fontSize="18px" fontWeight={700} color="gray.700">
          {t('classObservation.signatures.before-closing')}
        </Text>
        <VStack mb="16px" space={2}>
          {conditions.map(condition => (
            <HStack key={condition.label} space={2} alignItems="center">
              <Icon
                name={
                  condition.ok ? 'check-circle-solid' : 'exclamation-circle'
                }
                size={18}
                color={
                  condition.ok
                    ? theme.colors.green['200']
                    : theme.colors.yellow['200']
                }
              />
              <Text flex={1} fontSize="14px" color="gray.700">
                {condition.label}
              </Text>
              {!condition.ok && !!condition.path && (
                <Text
                  fontSize="13px"
                  fontWeight={600}
                  color="primary.200"
                  onPress={() => go(condition.path)}>
                  {t('classObservation.checklist.complete')}
                </Text>
              )}
            </HStack>
          ))}
          {uncheckedDocuments > 0 && (
            <HStack space={2} alignItems="center">
              <Icon
                name="info-circle"
                size={18}
                color={theme.colors.primary['200']}
              />
              <Text flex={1} fontSize="14px" color="gray.700">
                {t('classObservation.checklist.reminder_interval', {
                  postProcess: 'interval',
                  count: uncheckedDocuments,
                })}
              </Text>
              <Text
                fontSize="13px"
                fontWeight={600}
                color="primary.200"
                onPress={() => go('checklist')}>
                {t('classObservation.checklist.complete')}
              </Text>
            </HStack>
          )}
        </VStack>
      </ScrollView>

      <VStack px={GUTTER} pb="16px" pt="8px">
        <Button
          w="full"
          mb={0}
          disabled={!ready}
          onPress={() => setConfirm(true)}>
          {t('classObservation.signatures.close')}
        </Button>
      </VStack>

      <ConfirmDialog
        isOpen={confirm}
        title={t('classObservation.signatures.close-title')}
        message={t('classObservation.signatures.close-message')}
        confirmLabel={t('classObservation.signatures.close-confirm')}
        isLoading={isSaving}
        onConfirm={close}
        onCancel={() => setConfirm(false)}
      />
    </Page>
  );
};

export default ClassObservationSignatures;
