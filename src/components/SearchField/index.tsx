import React from 'react';
import {HStack, Input, useTheme} from 'native-base';
import Icon from '../Icon';

type Props = {
  value: string;
  placeholder?: string;
  onChangeText: (value: string) => void;
};

// Search field of the mockups: magnifier and borderless input.
const SearchField: React.FC<Props> = ({value, placeholder, onChangeText}) => {
  const theme = useTheme();

  return (
    <HStack
      my="12px"
      px="10px"
      space={2}
      alignItems="center"
      borderWidth="1px"
      borderRadius="10px"
      borderColor="gray.300">
      <Icon name="search" size={18} color={theme.colors.gray['500']} />
      <Input
        flex={1}
        py="10px"
        px={0}
        fontSize="14px"
        variant="unstyled"
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </HStack>
  );
};

export default SearchField;
