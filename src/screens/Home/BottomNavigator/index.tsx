import {HStack, VStack, Text, useTheme} from 'native-base';
import React from 'react';
import Icon from '../../../components/Icon';
import {TouchableOpacity} from 'react-native';
import PathRoutes from '../../../routers/paths';
import {useNavigate} from 'react-router-native';
import {useTranslation} from 'react-i18next';

type Props = {
  active?: 'home' | 'pending' | 'circles' | 'settings';
};

// Bottom bar of the mockups: home, sessions in progress, learning circles and settings.
const BottomNavigator: React.FC<Props> = ({active}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const {t} = useTranslation();

  const items = [
    {
      id: 'home',
      label: t('bottom_navigator.home'),
      icon: 'apps',
      route: PathRoutes.home.main,
    },
    {
      id: 'pending',
      label: t('bottom_navigator.pending'),
      icon: 'history',
      route: PathRoutes.home.pendingSessions,
    },
    {
      id: 'circles',
      label: t('bottom_navigator.tlc'),
      icon: 'users-alt',
      route: PathRoutes.teacherLearningCircles.main,
    },
    {
      id: 'settings',
      label: t('bottom_navigator.settings'),
      icon: 'setting',
      route: PathRoutes.settings.main,
    },
  ];

  return (
    <HStack
      pt="6px"
      pb="10px"
      bg="gray.0"
      borderTopWidth="1px"
      borderTopColor="gray.200">
      {items.map(item => {
        const isActive = item.id === active;
        return (
          <TouchableOpacity
            key={item.id}
            style={{flex: 1}}
            onPress={() => !isActive && navigate(item.route)}>
            <VStack alignItems="center" space="2px">
              <Icon
                name={item.icon as any}
                size={22}
                color={
                  isActive
                    ? theme.colors.primary['200']
                    : theme.colors.gray['500']
                }
              />
              <Text
                fontSize="11px"
                fontWeight={isActive ? 600 : 400}
                color={isActive ? 'primary.200' : 'gray.500'}>
                {item.label}
              </Text>
            </VStack>
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};

export default BottomNavigator;
