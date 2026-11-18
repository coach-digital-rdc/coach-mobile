import React, {useState} from 'react';
import {Props} from './types';
import {Center, HStack, Input, Text} from 'native-base';

const PinInput: React.FC<Props> = ({
  length,
  isInvalid,
  ...otherProps
}): JSX.Element => {
  const [inputText, handleChange] = useState('');
  const [hasFocus, handleFocus] = useState(false);
  const len = Array.from({length}, (_, i) => i + 1);

  const handleTextChange = ({
    nativeEvent: {text},
  }: {
    nativeEvent: {text: string};
  }): void => {
    handleChange(text);
  };

  return (
    <HStack position="relative" alignItems={'center'} justifyContent={'center'}>
      <HStack justifyContent={'space-between'} alignSelf={'center'} space={3}>
        {len.map((_, index) => (
          <Center
            key={index}
            width={'48px'}
            height={'56px'}
            flexDir={'row'}
            borderWidth={1}
            bg={'gray.0'}
            borderRadius={'8px'}
            borderColor={
              isInvalid
                ? 'red.200'
                : hasFocus && inputText.trim().length === index
                ? 'primary.200'
                : 'gray.300'
            }>
            <Text
              textAlign={'center'}
              fontSize={'24px'}
              fontWeight={700}
              color={'gray.700'}>
              {inputText.substring(index, index + 1)}
            </Text>
          </Center>
        ))}
      </HStack>

      <Input
        {...otherProps}
        maxLength={length}
        caretHidden={true}
        keyboardType="number-pad"
        onChange={handleTextChange}
        onFocus={(): void => handleFocus(true)}
        onBlur={(): void => handleFocus(false)}
        underlineColorAndroid="transparent"
        width="100%"
        height="56px"
        position="absolute"
        top="0"
        left="0"
        opacity={0}
      />
    </HStack>
  );
};

export default PinInput;
