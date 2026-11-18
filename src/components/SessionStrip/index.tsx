import React from 'react';
import {Center, HStack, Text, VStack, useTheme} from 'native-base';
import Icon from '../Icon';

// Teacher observed during the session, shown at the top of the session screens.
const SessionStrip: React.FC<{teacher: string; detail?: string}> = ({
  teacher,
  detail,
}) => {
  const theme = useTheme();

  return (
    <HStack
      mb="16px"
      p="10px"
      space={3}
      alignItems="center"
      borderRadius="12px"
      bg="gray.100">
      <Center w="36px" h="36px" borderRadius="18px" bg="primary.0">
        <Icon name="user" size={18} color={theme.colors.primary['200']} />
      </Center>
      <VStack flex={1}>
        <Text fontSize="15px" fontWeight={600} color="gray.700">
          {teacher}
        </Text>
        {!!detail && (
          <Text fontSize="12px" color="gray.600">
            {detail}
          </Text>
        )}
      </VStack>
    </HStack>
  );
};

export default SessionStrip;
