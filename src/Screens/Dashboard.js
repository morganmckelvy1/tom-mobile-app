import React, {useEffect, useState} from 'react';
import {View, Text, Alert, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
// import PhoneInput from 'react-native-phone-number-input';
import {Button, Menu, Divider, Provider} from 'react-native-paper';

import {HeightPercent, WidthPercent} from '../Global/device';
import {userDetails} from '../Global/userDetails';
import Header from '../Components/Header';

const Dashboard = props => {
  const {userInfo, isAuthenticated, error} = props;
  const [val, setVal] = useState('+1785858');
  // useEffect(() => {
  //   let userSavedData = userDetails();
  //   userSavedData.then(data => {
  //     // setUserInfo(data);
  //     // console.log('user', data);
  //     if (data == null || data.token == null) {
  //       props.navigation.navigate('Login');
  //     }
  //   });
  // }, [isAuthenticated]);
  // useEffect(() => {
  //   if (error.id === 'AUTH_FAIL') {
  //     Alert.alert(error.message);
  //     props.navigation.reset({
  //       index: 0,
  //       routes: [{name: 'Login'}],
  //     });
  //   }
  // }, [ error]);
  const pressleftIcon = () => {
    console.log('press left');
  };
  const pressRightIcon=()=>{
    console.log('Press right');
  }
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Text style={{fontSize: HeightPercent(5), color: 'black'}}>
        Welcome to TomCms
      </Text>
    </View>
  );
};

const mapStateToProps = state => ({
  // show_message: state.error.message,
  error: state.error,
  // loading: state.loader.isLoading,
  isAuthenticated: state.auth.isAuthenticated,
  userInfo: state.auth.user,
});
export default connect(mapStateToProps, {})(Dashboard);
