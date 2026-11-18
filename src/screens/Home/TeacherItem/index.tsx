import React from 'react';
import {Center, Image, useTheme} from 'native-base';
import {TeacherItemType} from '../../../types/teacher';
import {useTranslation} from 'react-i18next';
import Icon from '../../../components/Icon';
import ListRow from '../../../components/ListRow';
import moment from 'moment';

type Props = {
  customSubLabel?: string;
  teacher: TeacherItemType;
  divider?: boolean;
  onPress: () => void;
};

// Teacher row of the mockups: avatar, name, number of observations and date of the last one.
const TeacherItem: React.FC<Props> = ({
  onPress,
  teacher,
  customSubLabel,
  divider,
}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const subtitle =
    customSubLabel !== undefined
      ? customSubLabel
      : teacher.sessionsCount >= 1
      ? [
          t('home.teachers.session_interval', {
            postProcess: 'interval',
            count: teacher.sessionsCount,
          }),
          teacher.last_session_date &&
            t('home.teachers.last-observation', {
              date: moment(teacher.last_session_date).format('L'),
            }),
        ]
          .filter(Boolean)
          .join(', ')
      : t('home.teachers.no-observation');

  return (
    <ListRow
      divider={divider}
      title={teacher.name}
      subtitle={subtitle || undefined}
      onPress={onPress}
      leading={
        <Center w="36px" h="36px" borderRadius="18px" bg="primary.0">
          {teacher?.image ? (
            <Image
              w="100%"
              h="100%"
              alt="Teacher"
              borderRadius="18px"
              source={{uri: teacher.image}}
            />
          ) : (
            <Icon name="user" size={18} color={theme.colors.primary['200']} />
          )}
        </Center>
      }
    />
  );
};

export default TeacherItem;
