// import 'react-native-gesture-handler';
// import React from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';

// function HomeScreen({navigation}) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text onPress={()=>{navigation.navigate('Details')}}>Home Screen</Text>
//     </View>
//   );
// }

// function DetailsScreen({navigation}) {
//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <Text onPress={()=>{navigation.navigate('Home')}}>Details Screen</Text>
//     </View>
//   );
// }

// const Stack = createNativeStackNavigator();

// const Drawer = createDrawerNavigator();

// function App() {
//   return (
//     <NavigationContainer>
//        <Drawer.Navigator initialRouteName="Home">
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Details" component={DetailsScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// }



// export default App;
import React from 'react';
import {useColorScheme, LogBox} from 'react-native';
import {Provider} from 'react-redux';

import Navigation from './src/Navigation';
import store from './src/Redux/Store';

LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you're using an old API with gesture components, check out new Gestures system!",
]);
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

export default App;
