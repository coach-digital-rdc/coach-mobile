import React from 'react';
import {Box, HStack, Text, VStack} from 'native-base';
import {TouchableOpacity} from 'react-native';

type Props = {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
};

// Choice card of the mockups (language, function of the observer): round mark, title and hint.
const RadioCard: React.FC<Props> = ({
  title,
  description,
  selected,
  onPress,
}) => (
  <TouchableOpacity
    accessibilityRole="radio"
    accessibilityState={{checked: selected}}
    onPress={onPress}>
    <HStack
      mb="8px"
      p="12px"
      space={3}
      alignItems="center"
      borderWidth={selected ? '2px' : '1px'}
      borderRadius="12px"
      borderColor={selected ? 'primary.200' : 'gray.200'}
      bg={selected ? 'primary.0' : 'white'}>
      <Box
        w="20px"
        h="20px"
        borderRadius="10px"
        borderWidth={selected ? '6px' : '2px'}
        borderColor={selected ? 'primary.200' : 'gray.300'}
        bg="white"
      />
      <VStack flex={1}>
        <Text fontSize="15px" fontWeight={600} color="gray.700">
          {title}
        </Text>
        {!!description && (
          <Text fontSize="12px" color="gray.600">
            {description}
          </Text>
        )}
      </VStack>
    </HStack>
  </TouchableOpacity>
);

export default RadioCard;
