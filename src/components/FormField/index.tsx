import React from 'react';
import {HStack, IInputProps, Input, Text, VStack} from 'native-base';
import {useTranslation} from 'react-i18next';

type Props = {
  label: string;
  optional?: boolean;
  readOnly?: boolean;
} & IInputProps;

// Labelled text field of the mockups (label 13 px, field with a 8 px radius).
const FormField: React.FC<Props> = ({label, optional, readOnly, ...props}) => {
  const {t} = useTranslation();

  return (
    <VStack mt="10px" space="4px" flex={1}>
      <HStack>
        <Text fontSize="13px" fontWeight={500} color="gray.700">
          {label}
        </Text>
        {optional && (
          <Text fontSize="13px" color="gray.500">
            {` (${t('common.optional').toLowerCase()})`}
          </Text>
        )}
      </HStack>
      <Input
        py="8px"
        px="10px"
        fontSize="14px"
        isReadOnly={readOnly}
        bg={readOnly ? 'gray.100' : 'gray.0'}
        {...props}
      />
    </VStack>
  );
};

export default FormField;
