import React from 'react';
import {VStack} from 'native-base';
import {isTablet} from 'react-native-device-info';
import Header, {HeaderProps} from '../Header';
import {SafeAreaView} from 'react-native';

// Side margin of the screens: 16 px on a phone, 32 px on a tablet, as in the mockups
export const GUTTER = isTablet() ? '32px' : '16px';

type Props = {
  children: React.ReactNode;
  noPadding?: boolean;
  beforePageEl?: React.ReactNode;
} & HeaderProps;

const Page: React.FC<Props> = ({
  children,
  noPadding,
  beforePageEl,
  ...headerProps
}) => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Header {...headerProps} />

      {beforePageEl}

      <VStack
        w="full"
        flex={1}
        {...(!noPadding && {p: isTablet() ? '24px 32px' : '16px'})}>
        {children}
      </VStack>
    </SafeAreaView>
  );
};

export default Page;
