import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../Components/Header';
import * as globalColor from '../Global/color';
import { HeightPercent, WidthPercent } from '../Global/device';
import { connect } from 'react-redux';
import { userDetails } from '../Global/userDetails';
import TomLoader from '../Components/tomLoader';

import {
  supportMessage
} from '../Redux/Actions/supportAction';
const Support = props => {
  const {
    supportSuccessStatus
  } = props;

  const [message, setMessage] = useState('')
  const [topic, setTopic] = useState('')



  useEffect(() => {
    if (supportSuccessStatus) {
      Alert.alert(supportSuccessStatus);
      setisLoading(false);
      setTopic('')
      setMessage('')
    }
  }, [supportSuccessStatus]);



  //Header property...
  const pressleftImageIcon = () => {
    props.navigation.toggleDrawer();
  };

  const pressRightTextIcon = () => {
    if (message.length > 0) {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        props.supportMessage(token, topic, message);
        setTimeout(() => {
          setTopic('')
          setMessage('')
          if (supportSuccessStatus) {
            props.backPress();
          }
        }, 1000);
      });
    } else {
      Alert.alert('Please fill all fields.');
    }
  }


  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: globalColor.WHITE }}>
        <Header
          title={'Support'}
          leftIcon={null}
          pressLeftIcon={null}
          leftImageIcon={require('../Assests/Images/menu.png')}
          pressleftImageIcon={pressleftImageIcon}
          rightIcon={null}
          pressRightIcon={null}
          rightTextIcon="SEND"
          pressRightTextIcon={pressRightTextIcon}
        />

        <ScrollView>

          <View style={{ flex: 1, paddingHorizontal: WidthPercent(5), backgroundColor: 'transparent' }}>

            <Text style={{
              marginTop: HeightPercent(4),
              opacity: 1,
              fontSize: 14,
              lineHeight: 18,
            }}>"Welcome to support! Have questions, comments, or concerns? You have been assigned a personal support agent that will be able to help you with whatever you need.</Text>

            <Text style={{
              marginTop: 20,
              fontSize: 14,
            }}> The Tom CMS Team"
            </Text>

            <Text style={{ marginTop: HeightPercent(3), marginLeft: WidthPercent(1), fontSize: 15, fontWeight: 'bold' }}>SUBJECT:</Text>

            <TextInput
              placeholder="Subject"
              placeholderTextColor={globalColor.LIGHTGREY1}
              style={{ fontSize: 14, paddingTop:10, marginTop: HeightPercent(2), height:40, paddingLeft: WidthPercent(3), borderWidth: 1, borderColor: globalColor.LIGHTGREY, borderRadius: WidthPercent(2) }}
              value={topic}
              multiline={true}
              onChangeText={text => {
                setTopic(text);
              }}
            />


            {/* <View style={{
                    width:WidthPercent(80),
                    height:HeightPercent(20),
                    marginLeft:39,
                    marginRight:68,
                    marginTop:20,
                    // backgroundColor:'green'
                    }}>
                     */}
            <TextInput
              placeholder="Please, describe your issue here"
              placeholderTextColor={globalColor.LIGHTGREY1}
              multiline={true}
              style={{ fontSize: 14, height: HeightPercent(22), alignItems: 'flex-start', marginTop: HeightPercent(3), paddingLeft: WidthPercent(3), borderWidth: 1, borderColor: globalColor.LIGHTGREY, borderRadius: WidthPercent(2) }}
              value={message}
              onChangeText={text => {
                setMessage(text);
              }}
            />

            {/* </View> */}

            <View style={{ height: HeightPercent(5) }} />

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  backgroundColor: globalColor.BTNCOLOR,
                  borderRadius: 5,
                  width: WidthPercent(35),
                  padding: Platform.OS == 'android' ? HeightPercent(1.6) : HeightPercent(1.5)
                }}
                onPress={() => {
                  pressRightTextIcon();
                }}>
                <Text
                  style={{
                    color: globalColor.WHITE,
                    textAlign: 'center',
                    fontSize: WidthPercent(5),
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>

      </SafeAreaView>
    </>
  )
}
const mapStateToProps = state => ({
  supportSuccessStatus: state.support?.createsupportSuccess,

});

export default connect(mapStateToProps, {
  supportMessage,

})(Support);
