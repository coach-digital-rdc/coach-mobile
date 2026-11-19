import React, {useEffect, useRef, useState} from 'react';
import {
  Box,
  Center,
  HStack,
  ScrollView,
  Spinner,
  Text,
  TextArea,
  VStack,
  useTheme,
} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useLocation, useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {NoteService} from '../../../services/note.service';
import {SessionService} from '../../../services/session.service';
import {TeacherService} from '../../../services/teacher.service';
import {ObservationNote} from '../../../types/observation-note';
import {Session} from '../../../types/session';
import ConfirmDialog from '../../../components/ConfirmDialog';
import PhaseStepper from '../../../components/PhaseStepper';
import SessionStrip from '../../../components/SessionStrip';
import PathRoutes from '../../../routers/paths';
import Button from '../../../components/Button';
import Icon from '../../../components/Icon';
import Page, {GUTTER} from '../../../components/Page';

// Time elapsed since the start of the observation, as mm:ss
export const elapsed = (from: string | Date, to: string | Date) => {
  const seconds = Math.max(0, moment(to).diff(moment(from), 'seconds'));
  const minutes = Math.floor(seconds / 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(
    2,
    '0',
  )}`;
};

// Notes in chronological order, with the time and the time since the start of the observation.
export const NoteTimeline: React.FC<{
  notes: ObservationNote[];
  start: string;
  renderNote?: (note: ObservationNote) => React.ReactNode;
}> = ({notes, start, renderNote}) => (
  <VStack>
    {notes.map((note, index) => (
      <HStack key={note.id} pb="12px">
        {index < notes.length - 1 && (
          <Box
            position="absolute"
            left="60px"
            top="6px"
            bottom="-6px"
            w="2px"
            bg="gray.200"
          />
        )}
        <VStack w="52px" alignItems="flex-end">
          <Text fontSize="14px" fontWeight={700} color="gray.700">
            {moment(note.noted_at).format('HH:mm')}
          </Text>
          <Text fontSize="11px" color="gray.500">
            +{elapsed(start, note.noted_at)}
          </Text>
        </VStack>
        <Box
          position="absolute"
          left="55px"
          top="4px"
          w="12px"
          h="12px"
          borderRadius="6px"
          borderWidth="2px"
          borderColor="white"
          bg="primary.200"
          zIndex={1}
        />
        <Box
          flex={1}
          ml="24px"
          px="12px"
          py="10px"
          borderRadius="12px"
          bg="gray.100">
          {renderNote ? (
            renderNote(note)
          ) : (
            <Text fontSize="14px" color="gray.700">
              {note.content}
            </Text>
          )}
        </Box>
      </HStack>
    ))}
  </VStack>
);

// "Notes chronologiques" of the mockups (B13): the observer writes what happens during the
// didactic sequence; the scoring stays locked until a note is saved (B14).
const ClassObservationNotes: React.FC = () => {
  const theme = useTheme();
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {state} = useLocation();
  const sessionId: string = state?.session?.id;
  const [session, setSession] = useState<Session>();
  const [teacherName, setTeacherName] = useState('');
  const [notes, setNotes] = useState<ObservationNote[]>([]);
  const [draft, setDraft] = useState('');
  // A new field after each note: Android keeps the text being typed otherwise
  const [composerKey, setComposerKey] = useState(0);
  const [editing, setEditing] = useState<{id: string; content: string}>();
  const [now, setNow] = useState(new Date());
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const scroll = useRef<any>(null);

  useEffect(() => {
    SessionService.getSessionById(sessionId).then(current => {
      setSession(current);
      if (current?.teacher_id) {
        TeacherService.getTeacherDetails(current.teacher_id).then(teacher =>
          setTeacherName(teacher?.name || ''),
        );
      }
    });
    NoteService.listNotes(sessionId).then(setNotes);
  }, [sessionId]);

  const readOnly = !!session?.observation_ended_at;

  useEffect(() => {
    if (readOnly) {
      return;
    }
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [readOnly]);

  const addNote = async () => {
    const content = draft.trim();
    if (!content) {
      return;
    }
    const note = await NoteService.addNote(sessionId, content);
    setNotes(current => [...current, note]);
    setDraft('');
    setComposerKey(current => current + 1);
    setTimeout(() => scroll.current?.scrollToEnd({animated: true}), 100);
  };

  const saveEdit = async () => {
    if (!editing) {
      return;
    }
    const content = editing.content.trim();
    if (content) {
      await NoteService.updateNote(editing.id, content);
      setNotes(current =>
        current.map(note =>
          note.id === editing.id ? {...note, content} : note,
        ),
      );
    }
    setEditing(undefined);
  };

  const deleteNote = async (id: string) => {
    await NoteService.deleteNote(id);
    setNotes(current => current.filter(note => note.id !== id));
  };

  const goToScoring = () =>
    navigate(PathRoutes.classObservation.form, {
      replace: true,
      state: {session: {id: sessionId, teacher_id: session?.teacher_id}},
    });

  const endObservation = async () => {
    setIsSaving(true);
    await SessionService.endObservation(sessionId);
    goToScoring();
  };

  // The session stays open: it can be resumed from the teacher profile
  const goBack = () =>
    navigate(
      PathRoutes.teacher.details.replace(':id', session?.teacher_id || ''),
      {replace: true},
    );

  if (!session) {
    return (
      <Center bg="white" w="full" h="full">
        <Spinner size="lg" />
      </Center>
    );
  }

  const start = session.observation_started_at || now.toJSON();
  const end = session.observation_ended_at || now.toJSON();

  return (
    <Page back title={t('classObservation.title')} onBack={goBack} noPadding>
      <PhaseStepper current={readOnly ? 'evaluation' : 'observation'} />
      <ScrollView
        ref={scroll}
        flex={1}
        px={GUTTER}
        showsVerticalScrollIndicator={false}>
        <SessionStrip teacher={teacherName} detail={session.subject} />

        <HStack
          mb="20px"
          px={GUTTER}
          py="14px"
          borderRadius="12px"
          alignItems="center"
          justifyContent="space-between"
          bg={readOnly ? 'green.0' : 'red.0'}>
          <VStack>
            <HStack space="6px" alignItems="center">
              {readOnly ? (
                <Icon
                  name="check-circle-solid"
                  size={14}
                  color={theme.colors.green['300']}
                />
              ) : (
                <Box w="8px" h="8px" borderRadius="4px" bg="red.200" />
              )}
              <Text fontSize="13px" color="gray.600">
                {readOnly
                  ? t('classObservation.notes.ended', {
                      time: moment(end).format('HH:mm'),
                    })
                  : t('classObservation.notes.running', {
                      time: moment(start).format('HH:mm'),
                    })}
              </Text>
            </HStack>
            <Text fontSize="28px" fontWeight={700} color="gray.700">
              {elapsed(start, end)}
            </Text>
          </VStack>
          <VStack alignItems="center">
            <Text fontSize="22px" fontWeight={700} color="gray.700">
              {notes.length}
            </Text>
            <Text fontSize="12px" color="gray.600">
              {t('classObservation.notes.count_interval', {
                postProcess: 'interval',
                count: notes.length,
              })}
            </Text>
          </VStack>
        </HStack>

        <Text fontSize="24px" fontWeight={600} color="gray.700">
          {t('classObservation.notes.title')}
        </Text>
        <Text mt="8px" mb="16px" fontSize="14px" color="gray.600">
          {readOnly
            ? t('classObservation.notes.subtitle-read-only')
            : t('classObservation.notes.subtitle')}
        </Text>

        {notes.length === 0 ? (
          <Center py="32px">
            <Icon name="notes" size={40} color={theme.colors.gray['400']} />
            <Text mt="8px" fontSize="14px" color="gray.500">
              {t('classObservation.notes.empty')}
            </Text>
          </Center>
        ) : (
          <NoteTimeline
            notes={notes}
            start={start}
            renderNote={note =>
              editing?.id === note.id ? (
                <VStack space={2}>
                  <TextArea
                    h="80px"
                    bg="white"
                    autoFocus
                    autoCompleteType="off"
                    value={editing.content}
                    onChangeText={content => setEditing({id: note.id, content})}
                  />
                  <HStack space={2} justifyContent="flex-end">
                    <Text
                      px="8px"
                      py="4px"
                      fontSize="14px"
                      color="gray.600"
                      onPress={() => setEditing(undefined)}>
                      {t('common.cancel')}
                    </Text>
                    <Text
                      px="8px"
                      py="4px"
                      fontSize="14px"
                      fontWeight={600}
                      color="primary.200"
                      onPress={saveEdit}>
                      {t('common.save')}
                    </Text>
                  </HStack>
                </VStack>
              ) : (
                <>
                  <Text fontSize="14px" color="gray.700">
                    {note.content}
                  </Text>
                  {!readOnly && (
                    <HStack mt="2px" space={4} justifyContent="flex-end">
                      <TouchableOpacity
                        accessibilityLabel={t('classObservation.notes.edit')}
                        onPress={() =>
                          setEditing({id: note.id, content: note.content})
                        }>
                        <Icon
                          name="pen"
                          size={16}
                          color={theme.colors.gray['600']}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        accessibilityLabel={t('classObservation.notes.delete')}
                        onPress={() => deleteNote(note.id)}>
                        <Icon
                          name="trash-alt"
                          size={16}
                          color={theme.colors.red['200']}
                        />
                      </TouchableOpacity>
                    </HStack>
                  )}
                </>
              )
            }
          />
        )}
      </ScrollView>

      <VStack
        px={GUTTER}
        pb="16px"
        pt="8px"
        borderTopWidth="1px"
        borderTopColor="gray.200">
        {!readOnly && (
          <HStack mb="8px" space={2} alignItems="flex-end">
            <TextArea
              key={composerKey}
              autoFocus={composerKey > 0}
              flex={1}
              h="64px"
              autoCompleteType="off"
              value={draft}
              placeholder={t('classObservation.notes.placeholder') || ''}
              onChangeText={setDraft}
            />
            <TouchableOpacity
              disabled={!draft.trim()}
              accessibilityLabel={t('classObservation.notes.add')}
              onPress={addNote}>
              <Center
                w="44px"
                h="44px"
                borderRadius="12px"
                bg={draft.trim() ? 'primary.200' : 'gray.300'}>
                <Icon name="plus" size={22} color={theme.colors.white} />
              </Center>
            </TouchableOpacity>
          </HStack>
        )}
        <HStack
          mb="8px"
          p="8px"
          space={2}
          alignItems="center"
          borderRadius="10px"
          bg={notes.length === 0 ? 'gray.100' : 'green.0'}>
          <Icon
            name={notes.length === 0 ? 'lock' : 'unlock'}
            size={18}
            color={
              notes.length === 0
                ? theme.colors.gray['600']
                : theme.colors.green['300']
            }
          />
          <Text
            flex={1}
            fontSize="13px"
            color={notes.length === 0 ? 'gray.600' : 'green.300'}>
            {readOnly
              ? t('classObservation.notes.unlocked')
              : notes.length === 0
              ? t('classObservation.notes.locked')
              : t('classObservation.notes.unlock-at-end')}
          </Text>
        </HStack>
        {readOnly ? (
          <Button w="full" mb={0} onPress={goToScoring}>
            {t('classObservation.notes.go-to-scoring')}
          </Button>
        ) : (
          <Button
            w="full"
            mb={0}
            variant="outlined"
            disabled={notes.length === 0}
            onPress={() => setConfirmEnd(true)}>
            {t('classObservation.notes.end')}
          </Button>
        )}
      </VStack>

      <ConfirmDialog
        isOpen={confirmEnd}
        title={t('classObservation.notes.end-title')}
        message={t('classObservation.notes.end-message_interval', {
          postProcess: 'interval',
          count: notes.length,
        })}
        confirmLabel={t('classObservation.notes.end-confirm')}
        isLoading={isSaving}
        onConfirm={endObservation}
        onCancel={() => setConfirmEnd(false)}
      />
    </Page>
  );
};

export default ClassObservationNotes;
