import React from 'react';
import {View, KeyboardAvoidingView, Platform} from 'react-native';

type KeyboardAvoidingViewComponentProps = {
  children: React.ReactNode;
};

const KeyboardAvoidingViewComponent: React.FC<
  KeyboardAvoidingViewComponentProps
> = ({children}) => {
  if (Platform.OS !== 'android') {
    return <View>{children}</View>;
  }
  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      keyboardVerticalOffset={250}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingViewComponent;
