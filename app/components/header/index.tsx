import React from 'react';

import LeftHeader from './left-header';
import RightHeader from './right-header';

type Options = {
  navigation: any;
  route?: {name: string};
  swipeEnabled?: boolean;
  headerShown?: boolean;
};

type HeaderTitleStyleProps = {
  fontWeight:
    | 'bold'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900'
    | undefined;
};

export const defaultOptions = ({
  navigation,
  route = {name: ''},
  swipeEnabled = false,
  headerShown = true,
}: Options) => {
  return {
    headerShown,
    headerStyle: {
      backgroundColor: '#000',
      height: 110,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    } as HeaderTitleStyleProps,
    headerLeft: () => <LeftHeader navigation={navigation} />,
    headerRight: () => <RightHeader />,
    gestureEnabled: swipeEnabled,
    swipeEnabled: swipeEnabled,
  };
};
