import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import axios from 'axios';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {HeightPercent, WidthPercent} from '../Global/device';
import * as globalColor from '../Global/color';
import {userDetails} from '../Global/userDetails';
import {clearAuth, logoutAction} from '../Redux/Actions/authAction';
import {AuthContext} from '../Components/context';
import {BASEURL} from '../Global/common';

const DrawerItem = props => {
  // const {signOut} = useContext(AuthContext);

  const navigationTo = () => {
    if (props.name == 'Logout') {
      logOut();
    } else if (props.name != 'Logout') {
      props.navigation.navigate(props.name);
    }
  };

  const logOut = async () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let user_id = data.user_id;
        props.logoutAction({user_id});
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: HeightPercent(4),
        }}
        onPress={() => {
          navigationTo();
        }}>
        <Image
          style={{
            height:Platform.OS=='android'? HeightPercent(3):HeightPercent(2),
            width: Platform.OS=='android'? HeightPercent(3):HeightPercent(2),
            marginLeft: WidthPercent(5),
          }}
          source={props.src}
        />
        <Text
          style={{
            fontSize:Platform.OS=='android'? HeightPercent(3):HeightPercent(2),
            marginLeft: WidthPercent(5),
            color: 'grey',
          }}>
          {props.name}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: 2,
          backgroundColor: globalColor.LIGHTGREY,
          width: WidthPercent(70),
          alignSelf: 'center',
        }}
      />
    </View>
  );
};
const mapStateToProps = state => ({});
export default connect(mapStateToProps, {clearAuth, logoutAction})(DrawerItem);
