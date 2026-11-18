import React from 'react';
import {Center, HStack, Text, VStack, useTheme} from 'native-base';
import {useTranslation} from 'react-i18next';
import Icon from '../Icon';

export const PHASES = ['preparation', 'observation', 'evaluation', 'closing'];

// Steps of the session in the mockups: Préparation, Observation, Évaluation, Clôture.
const PhaseStepper: React.FC<{current: string}> = ({current}) => {
  const theme = useTheme();
  const {t} = useTranslation();
  const index = PHASES.indexOf(current);

  return (
    <HStack px="16px" py="8px" space={1} justifyContent="space-between">
      {PHASES.map((phase, i) => {
        const done = i < index;
        const active = i === index;
        return (
          <VStack key={phase} flex={1} alignItems="center" space="4px">
            <Center
              w="22px"
              h="22px"
              borderRadius="11px"
              bg={done ? 'green.200' : active ? 'primary.200' : 'gray.200'}>
              {done ? (
                <Icon name="check" size={12} color={theme.colors.white} />
              ) : (
                <Text
                  fontSize="11px"
                  fontWeight={700}
                  color={active ? 'gray.0' : 'gray.600'}>
                  {i + 1}
                </Text>
              )}
            </Center>
            <Text
              fontSize="11px"
              fontWeight={active ? 600 : 400}
              color={active ? 'primary.200' : 'gray.600'}>
              {t(`classObservation.phases.${phase}`)}
            </Text>
          </VStack>
        );
      })}
    </HStack>
  );
};

export default PhaseStepper;
