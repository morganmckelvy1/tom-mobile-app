import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';

const Header = props => {
  return (
    <SafeAreaView
      style={{
        height:
          Platform.OS == 'android' ? HeightPercent(10) : HeightPercent(10),
        width: WidthPercent(100),
        backgroundColor: globalColor.CARD,
        paddingHorizontal: WidthPercent(2),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      {props.leftIcon && (
        <MaterialCommunityIcons
          onPress={() => {
            props.pressLeftIcon();
          }}
          name={props.leftIcon}
          size={WidthPercent(7)}
          style={{color: globalColor.WHITE}}
        />
      )}
      {props.leftImageIcon && (
        <TouchableOpacity
          onPress={() => {
            props.pressleftImageIcon();
          }}>
          <Image
            style={{tintColor: globalColor.WHITE}}
            source={props.leftImageIcon}
            height={
              Platform.OS == 'android' ? HeightPercent(5) : HeightPercent(4)
            }
            width={
              Platform.OS == 'android' ? HeightPercent(5) : HeightPercent(3)
            }
          />
        </TouchableOpacity>
      )}
      {props.title && (
        <Text
          style={{
            // backgroundColor:'cyan',
            // width:WidthPercent(100),
            color: globalColor.WHITE,
            fontSize:
              Platform.OS == 'android' ? HeightPercent(2.5) : HeightPercent(2),
            textAlign: 'center',
            flex: 1,
          }}>
          {props.title}
        </Text>
      )}
      {props.rightIcon ? (
        <MaterialCommunityIcons
          onPress={() => {
            props.pressRightIcon();
          }}
          name={props.rightIcon}
          size={WidthPercent(6)}
          style={{color: globalColor.WHITE}}
        />
      ) : (
        <View />
      )}
      {props.rightTextIcon && (
        <TouchableOpacity
          onPress={() => {
            props.pressRightTextIcon();
          }}>
          <Text style={{color: globalColor.WHITE, fontSize: WidthPercent(4)}}>
            {props.rightTextIcon}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Header;
