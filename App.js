
import React from 'react';
import { LogBox} from 'react-native';
import {Provider} from 'react-redux';

import Navigation from './src/Navigation';
import store from './src/Redux/Store';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
const App = () => {

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
