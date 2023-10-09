import React from 'react';
import {View, Text, Platform} from 'react-native';
import {v4 as uuidv4} from 'uuid';

import {HeightPercent, WidthPercent} from '../Global/device';
import * as globalColor from '../Global/color';

function FieldView(props) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: WidthPercent(props.margin ? props.margin : 2),
        // marginVertical: WidthPercent(props.margin ? props.margin : 1),
        paddingVertical:Platform.OS=='android'?HeightPercent(3): HeightPercent(2),
        borderBottomColor: globalColor.LIGHTGREY,
        borderBottomWidth: WidthPercent(0.4),
      }}
      key={uuidv4()}>
      <Text
        style={{
          flex: 1,
          textAlign: 'left',
          alignSelf: 'flex-start',
          paddingLeft:WidthPercent(1),
          fontSize: WidthPercent(props.fontSize ? props.fontSize : 3),
          color: globalColor.LIGHTGREY1,
        }}>
        {props.field}
      </Text>
      <Text
        style={{
          flex: 1,
          textAlign: 'left',
          fontSize: WidthPercent(props.fontSize ? props.fontSize : 3),
          color: globalColor.BLACK,
          // backgroundColor:'cyan'
          // fontWeight:'bold'
        }}>
        {props.value}
      </Text>
    </View>
  );
}

export default FieldView;
