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
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { Colors } from 'react-native-paper';

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
    <View style={{flex:1}}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: HeightPercent(4),
          width:WidthPercent(65),
          alignSelf:'center',
          borderBottomWidth:WidthPercent(0.1),
          borderBottomColor:globalColor.LIGHTGREY,
          // backgroundColor:'red',
          justifyContent:'space-between'
        }}
        onPress={() => {
          navigationTo();
        }}>

        <View style={{flexDirection:'row', alignItems:'center'}}>

            <Image
              style={{
                height:Platform.OS=='android'? HeightPercent(2.8):HeightPercent(2),
                width: Platform.OS=='android'? HeightPercent(2.8):HeightPercent(2),               
                tintColor:globalColor.CARD
              }}
              source={props.src}
            />
            <Text
              style={{
                fontSize:Platform.OS=='android'? HeightPercent(2.4):HeightPercent(1.7),
                marginLeft: WidthPercent(4),
                color:globalColor.BLACK,
              }}>
              {props.name}
            </Text>          
          
        </View>  
       

         <Image
          style={{
            height:Platform.OS=='android'? HeightPercent(2.6):HeightPercent(2),
            width: Platform.OS=='android'? HeightPercent(2.6):HeightPercent(2),
            marginLeft: WidthPercent(4),
            tintColor:Colors.BLACK
          }}
          source={require('../Assests/Images/next.png')}
        />
      </TouchableOpacity>
      {/* <View
        style={{
          height: WidthPercent(0.1),
          backgroundColor: globalColor.LIGHTGREY,
          width: WidthPercent(60),
          alignSelf: 'center',
        }}
      /> */}
    </View>
  );
};
const mapStateToProps = state => ({});
export default connect(mapStateToProps, {clearAuth, logoutAction})(DrawerItem);
