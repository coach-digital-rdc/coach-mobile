import React from 'react';
import {Box, Text, VStack, useTheme} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Icon from '../Icon';

type Props = {
  icon: string;
  label: string;
  primary?: boolean;
  badge?: number;
  onPress: () => void;
};

// Shortcut tile of the home screen in the mockups.
const Tile: React.FC<Props> = ({icon, label, primary, badge, onPress}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={{width: '100%', flex: 1}}>
      <VStack
        flex={1}
        p="14px"
        space={2}
        minH="84px"
        borderWidth="1px"
        borderRadius="12px"
        bg={primary ? 'primary.200' : 'gray.0'}
        borderColor={primary ? 'primary.200' : 'gray.200'}>
        <Icon
          name={icon as any}
          size={26}
          color={primary ? theme.colors.white : theme.colors.primary['200']}
        />
        <Text
          fontSize="14px"
          fontWeight={600}
          color={primary ? 'gray.0' : 'gray.700'}>
          {label}
        </Text>

        {!!badge && (
          <Box
            position="absolute"
            top="10px"
            right="10px"
            minW="20px"
            px="6px"
            borderRadius="999px"
            bg="red.200">
            <Text fontSize="12px" color="gray.0" textAlign="center">
              {badge}
            </Text>
          </Box>
        )}
      </VStack>
    </TouchableOpacity>
  );
};

export default Tile;
