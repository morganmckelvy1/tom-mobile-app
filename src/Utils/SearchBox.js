import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import {HeightPercent, WidthPercent} from '../Global/device';
import * as globalColor from '../Global/color';

function SearchBox(props) {
  return (
    <View style={styles.container}>
      <View style={{marginLeft: WidthPercent(4)}}>
        <MaterialIcons name={'search'} size={WidthPercent(5)} />
      </View>
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={globalColor.LIGHTBLACK}
        style={{flex: 1, paddingLeft: 5}}
        onChangeText={text => {
          //   props._onChanssgeText(props.name, text);
          props.onChangeSearchText(text);
        }}
        value={props.value}
      />
      {props.rightIcon && props.value ? (
        <TouchableOpacity
          style={{marginRight: WidthPercent(4)}}
          onPress={() => {
            props.clearSerachText();
          }}>
          <Entypo name={'circle-with-cross'} size={WidthPercent(5)} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderRadius: WidthPercent(10),
    backgroundColor: globalColor.WHITE,
    // padding:HeightPercent(2)
    height: Platform.OS == 'android' ? HeightPercent(7) : HeightPercent(5.5),
  },
});
export default SearchBox;
