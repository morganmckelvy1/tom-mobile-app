import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  Provider as PaperProvider,
  TextInput,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PhoneInput from 'react-native-phone-input';

import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';




const TextInputSecond = props => {

  const [pickerData, setpickerData] = useState(null);

  const [cca2, setcca2] = useState('US'); 
 
  const phone = useRef();
  
  const countryPicker = useRef();

  const checkDigits = ph => {
    ph.length > 14 ? alert('Enter valid Phone number') : null;
  };


  useEffect(() => {
    // setpickerData(phone.getPickerData())

      // phone.getPickerData()

    // console.log('picker data-----', getPickerData());

  }, []);

  const getPickerData =()=> {

    console.log('get picker data called-----');
    // countryPicker.openModal();
  }

    const onPressFlag =()=> {
      countryPicker.openModal();
    }


const selectCountry =(country)=>{
  console.log('country-----',country);

  phone.selectCountry(country.iso2);
}


  return (
    <View>
      {props.countrycode ? (
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            padding: HeightPercent(1),
            zIndex: 1,
            // backgroundColor:'red'
          }}>
          <Text style={{fontSize: WidthPercent(3)}}>{props.label}</Text>

          <PhoneInput
            ref={phone}
            key={props.key}
            style={styles.field}
            initialCountry={'us'}
            // onPressFlag={onPressFlag}
            initialValue={props.val}
            onChangePhoneNumber={text => {
              console.log("text-----", text);
              checkDigits(text);
              props._onChangeText(props.name, text);
            }}
            textProps={{
              placeholder: props.label,
            }}
            maxLength={3}
          />


        </View>
      ) : (
        <TextInput
          style={{
            fontSize: WidthPercent(3),
            marginVertical: WidthPercent(1),
            backgroundColor: globalColor.WHITE,
            // backgroundColor:'green',

          }}
          activeUnderlineColor={globalColor.PRIMARY}
          label={props.label}
          onChangeText={text => {
            props._onChangeText(props.name, text);
          }}
          value={props.val}
          multiline={props.multiline}
          numberOfLines={props.numberOfLines}
          editable={props.active}
        />
      )}

      {/* {console.log('props.val-------', props.val)} */}
      
      {props.right && (
        <View
          style={{
            width: WidthPercent(25),
            flexDirection: 'row',
            position: 'absolute',
            zIndex: 1,
            right: 5,
            top: HeightPercent(6),
            // marginBottom: HeightPercent(-4),
            justifyContent: 'flex-end',
            alignItems: 'center',
            // backgroundColor:'pink'
          }}>

          <TouchableOpacity
            onPress={() => {
              props.addField();
            }}>
            <Text
              style={{
                color: globalColor.PRIMARY,
                fontSize: HeightPercent(2),
                fontWeight: 'bold',
              }}>
              + ADD NEW
            </Text>
          </TouchableOpacity>

          <MaterialCommunityIcons
            name="delete"
            color={'red'}
            style={{marginLeft: WidthPercent(2)}}
            size={HeightPercent(3)}
            onPress={() => {
              props.deleteField();
            }}
          />
        </View>
      )}
      {props.countrycode && (
        <View
          style={{
            height: HeightPercent(0.1),
            backgroundColor: globalColor.LIGHTGREY,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    fontSize: WidthPercent(3),
    // marginVertical: WidthPercent(1),
    // backgroundColor: globalColor.WHITE,
    // backgroundColor:'yellow',
    height: HeightPercent(8),
    alignItems:'center',
    // marginHorizontal:-10,
    // width:'100%',
    // flex:1,
    // marginVertical: HeightPercent(0.5),
  },
});

export {TextInputSecond};
