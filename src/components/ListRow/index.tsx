import React from 'react';
import {Center, HStack, Text, VStack, useTheme} from 'native-base';
import {TouchableOpacity} from 'react-native';
import Icon from '../Icon';

type Props = {
  title: string;
  subtitle?: string;
  icon?: string;
  // Replaces the square icon, e.g. a round avatar
  leading?: React.ReactNode;
  // Draws the separator above the row (every row but the first one)
  divider?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
};

// List row of the mockups: icon, title, subtitle and arrow.
const ListRow: React.FC<Props> = ({
  title,
  subtitle,
  icon,
  leading,
  divider,
  children,
  onPress,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <HStack
        py="12px"
        space={3}
        alignItems="center"
        borderTopWidth={divider ? '1px' : 0}
        borderTopColor="gray.100">
        {leading ||
          (icon && (
            <Center w="36px" h="36px" borderRadius="10px" bg="primary.0">
              <Icon
                name={icon as any}
                size={20}
                color={theme.colors.primary['200']}
              />
            </Center>
          ))}

        <VStack flex={1} space="2px">
          <Text fontSize="15px" fontWeight={600} color="gray.700">
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="12px" color="gray.600">
              {subtitle}
            </Text>
          )}
          {children}
        </VStack>

        {onPress && (
          <Icon name="angle-right" size={20} color={theme.colors.gray['500']} />
        )}
      </HStack>
    </TouchableOpacity>
  );
};

export default ListRow;
