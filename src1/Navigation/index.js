import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
// import {createStackNavigator} from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen';

import {checkAuth} from '../Redux/Actions/authAction';
import CustomDrawer from './CustomDrawer';
import Login from '../Screens/Login';
import Profile from '../Screens/Profile';
import ChangePassword from '../Screens/ChangePassword';
import ForgotPassword from '../Screens/ForgotPassword';
import ProfileEdit from '../Components/ProfileEdit';
import Contact from '../Screens/Contact';
import ContactDetails from '../Screens/ContactDetails';
import {WidthPercent} from '../Global/device';
import {userDetails} from '../Global/userDetails';
import {AuthContext} from '../Components/context';
import ContactCreateEdit from '../Components/ContactCreateEdit';
import QuickAppointment from '../Screens/QuickAppointment';
import QuickappointmentDetails from '../Screens/QuickappointmentDetails';
import QuickAppointmentCreateEdit from '../Components/QuickAppointmentCreateEdit';

const navigation = props => {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();

  const {isAuthenticated} = props;

  useEffect(() => {
    props.checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      SplashScreen.hide();
    } else if (isAuthenticated == null || isAuthenticated == false) {
      SplashScreen.hide();
    }
  }, [isAuthenticated]);

  const MyDrawer = props => {
    return (
      <Drawer.Navigator
        initialRouteName="Profile"
        screenOptions={{drawerStyle: {width: WidthPercent(75)}}}
        defaultStatus="closed"
        drawerContent={props => <CustomDrawer {...props} />}>
        <Drawer.Screen
          name="Profile"
          options={{headerShown: false}}
          component={Profile}
          {...props}
        />
        <Drawer.Screen
          name="Contacts"
          options={{headerShown: false}}
          component={Contact}
        />
        <Drawer.Screen
          name="QuickAppointment"
          options={{headerShown: false}}
          component={QuickAppointment}
        />
      </Drawer.Navigator>
    );
  };
  const AppStack = props => {
    return (
      <Stack.Navigator
        initialRouteName="Drawer"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Drawer" component={MyDrawer} />

        <Stack.Screen
          options={{headerShown: false}}
          name="Profile"
          component={Profile}
          {...props}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ChangePassword"
          component={ChangePassword}
        />

        <Stack.Screen
          options={{headerShown: false}}
          name="ProfileEdit"
          component={ProfileEdit}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="Contacts"
          component={Contact}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ContactsEdit"
          component={ContactCreateEdit}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ContactDetails"
          component={ContactDetails}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="QuickAppointment"
          component={QuickAppointment}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="QuickappointmentDetails"
          component={QuickappointmentDetails}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="QuickAppointmentCreateEdit"
          component={QuickAppointmentCreateEdit}
        />
      </Stack.Navigator>
    );
  };
  const AuthStack = props => {
    return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="ForgotPassword"
          component={ForgotPassword}
        />
      </Stack.Navigator>
    );
  };
  const link = {
    prefixes: ['tomcms://'],
    config: {
      screens: {
        ForgotPassword: {
          path: 'create-new-password-reset/:value1',
        },
      },
    },
  };
  return (
    <NavigationContainer linking={link}>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const mapStateToProps = state => ({
  // error: state.error,
  isAuthenticated: state.auth.isAuthenticated,
  userInfo: state.auth.user,
});

export default connect(mapStateToProps, {
  checkAuth,
})(navigation);
