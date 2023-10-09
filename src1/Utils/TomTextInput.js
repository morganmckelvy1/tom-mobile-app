import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as globalColor from '../Global/color';

import {HeightPercent, WidthPercent} from '../Global/device';

const TomTextInput = props => {
  const [secureTextEntryStatus, setsecureTextEntryStatus] = useState(
    props.textStatus,
  );
  return (
    <View style={styles.container}>
      <View style={styles.textInputLeftImg}>
        <MaterialIcons name={props.leftIcon} size={WidthPercent(6.6)} />
      </View>
      <TextInput
        placeholder={props.placeholder}
        placeholderTextColor={globalColor.LIGHTGREY}
        style={styles.input}
        autoCapitalize={props.autoCapitalize}
        secureTextEntry={secureTextEntryStatus}
        autoCorrect={false}
        onChangeText={text => {
          props._onChanssgeText(props.name, text);
        }}
        maxLength={props.maxLength}
        // value={props.value && props.value}
        //onSubmitEditing={(event) => props.onSubmit(event)}
      />
      {props.rightIcon && (
        <TouchableOpacity
          style={{margin: 10}}
          onPress={() => {
            setsecureTextEntryStatus(!secureTextEntryStatus);
          }}>
          <Ionicons
            name={secureTextEntryStatus ? 'eye-off' : 'eye'}
            size={WidthPercent(5.5)}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    borderWidth: 1,
    borderColor: '#2c3334',
    borderRadius: 5,
  },
  input: {
    flex: 1,
    padding: 5,
  },
  textInputLeftImg: {
    borderRightWidth: 1,
    borderColor: '#2C3334',
    padding: WidthPercent(3.8),
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    backgroundColor: '#e5e5e5',
  },
});

export {TomTextInput};
