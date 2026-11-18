import React from 'react';
import {HStack, Text} from 'native-base';
import {TouchableOpacity} from 'react-native';
import {useTranslation} from 'react-i18next';
import {Question} from '../../types/question';
import {getAnswerChoices} from '../../helpers/answer.helper';

type Props = {
  question: Question;
  value?: number;
  onPress: (value: number) => void;
};

// Answer buttons of the DRC grid: Oui/Non or Faible/Moyen/Élevé, with "N/A" when allowed.
const AnswerChoice: React.FC<Props> = ({question, value, onPress}) => {
  const {t} = useTranslation();

  return (
    <HStack space={2} flexWrap="wrap">
      {getAnswerChoices(question).map(choice => {
        const selected = value === choice.value;
        return (
          <TouchableOpacity
            key={choice.value}
            style={{flexGrow: 1}}
            onPress={() => !selected && onPress(choice.value)}>
            <Text
              py={2}
              px={3}
              textAlign="center"
              borderWidth="1px"
              borderRadius="8px"
              borderColor={selected ? 'primary.200' : 'gray.300'}
              bg={selected ? 'primary.200' : 'white'}
              color={selected ? 'white' : 'gray.700'}
              fontSize={'LMD'}
              fontWeight={500}>
              {t(choice.label)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </HStack>
  );
};

export default AnswerChoice;
