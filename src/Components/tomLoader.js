import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import * as globalColor from '../Global/color';

function TomLoader() {
  return (
    <ActivityIndicator
      size="large"
      color={globalColor.PRIMARY}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
    />
  );
}

export default TomLoader;
