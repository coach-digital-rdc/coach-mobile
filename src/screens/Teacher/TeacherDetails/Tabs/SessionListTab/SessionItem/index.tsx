import React from 'react';
import {Center, Text, useTheme} from 'native-base';
import {useTranslation} from 'react-i18next';
import moment from 'moment';
import {Session} from '../../../../../../types/session';
import ListRow from '../../../../../../components/ListRow';
import Icon from '../../../../../../components/Icon';

type Props = {
  index: number;
  session: Session;
  onPress: () => void;
};

const OPEN_STATUSES = ['PREPARATION', 'OBSERVATION', 'EVALUATION'];

// Observation row of the teacher profile in the mockups: date and status.
const SessionItem: React.FC<Props> = ({onPress, session, index}) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const isOpen = OPEN_STATUSES.includes(session.session_status || '');

  return (
    <ListRow
      divider={index > 0}
      title={t('teacher.tabs.session.observation-of', {
        date: moment(session.created_at).format('L'),
      })}
      onPress={onPress}
      leading={
        <Center
          w="36px"
          h="36px"
          borderRadius="10px"
          bg={isOpen ? 'primary.0' : 'green.0'}>
          <Icon
            name={isOpen ? 'clipboard-notes' : 'file-check'}
            size={20}
            color={
              isOpen ? theme.colors.primary['200'] : theme.colors.green['300']
            }
          />
        </Center>
      }>
      <Text
        alignSelf="flex-start"
        px="8px"
        borderRadius="999px"
        overflow="hidden"
        fontSize="11px"
        fontWeight={600}
        bg={isOpen ? 'yellow.0' : 'green.0'}
        color={isOpen ? 'yellow.300' : 'green.300'}>
        {isOpen
          ? t('teacher.tabs.session.in-progress')
          : t('teacher.tabs.session.closed')}
      </Text>
    </ListRow>
  );
};

export default SessionItem;
