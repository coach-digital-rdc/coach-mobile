import React from 'react';
import {HStack, Text, VStack} from 'native-base';
import {TouchableOpacity} from 'react-native';

type Props = {
  label: string;
  value?: string | null;
  options: {value: string; label: string}[];
  onChange: (value: string) => void;
};

// Segmented control of the mockups, for a short choice (e.g. Féminin / Masculin).
const SegmentedChoice: React.FC<Props> = ({
  label,
  value,
  options,
  onChange,
}) => (
  <VStack mt="10px" space="4px">
    <Text fontSize="13px" fontWeight={500} color="gray.700">
      {label}
    </Text>
    <HStack p="4px" borderRadius="12px" bg="gray.100">
      {options.map(option => {
        const active = option.value === value;
        return (
          <TouchableOpacity
            key={option.value}
            style={{flex: 1}}
            accessibilityRole="radio"
            accessibilityState={{checked: active}}
            onPress={() => onChange(option.value)}>
            <Text
              py="8px"
              textAlign="center"
              fontSize="14px"
              borderRadius="9px"
              overflow="hidden"
              bg={active ? 'gray.0' : 'transparent'}
              color={active ? 'primary.200' : 'gray.600'}
              fontWeight={active ? 600 : 400}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </HStack>
  </VStack>
);

export default SegmentedChoice;
