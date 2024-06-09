import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  BackHandler,
  SafeAreaView,
   Platform
} from 'react-native';
import { USER } from '../Constants/user';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary} from 'react-native-image-picker';
import {v4 as uuidv4} from 'uuid';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {TextInputSecond} from '../Utils/TomTextInputSecond';
import {TomTextInputThird} from '../Utils/TomTextInputThird';
import {updateProfileField} from '../Redux/Actions/profileAction';
import TomLoader from './tomLoader';
import Spinner from 'react-native-loading-spinner-overlay';
import { LoaderStyle } from '../Global/loader';
const timeZoneList = [
  'America/Adak',
  'America/Anchorage',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/New_York',
  'America/Phoenix',
  'Pacific/Honolulu',
];
const ProfileEdit = props => {
  const {profileupdatestatus, profile_update_failed} = props;
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [spinner, setSpinner] = useState(false);
  const [userAllDetails, setuserAllDetails] = useState(USER);
  const [contactNumber, setcontactNumber] = useState([]);
  const [profileImageUri, setprofileImageUri] = useState('');
  const [singleFile, setSingleFile] = useState(null);
  const [timezoneVisible, settimezoneVisible] = useState(false);
  const [profileLoading, setprofileLoading] = useState(true);

  useEffect(() => {
    const backAction = () => {
      props.profileUpdate();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setuserAllDetails({
      firstName: props.profileDetails?.firstName,
      lastName: props.profileDetails?.lastName,
      email: props.profileDetails?.email,
      oncall1: props.profileDetails?.oncall1,
      dop_phone: props.profileDetails?.dop_phone,
      mobileNumber: props.profileDetails?.mobileNumber,
      alternatePhone: props.profileDetails?.alternatePhone,
      timeZone: props.profileDetails?.timeZone,
      street: props.profileDetails?.street,
      suite: props.profileDetails?.suite,
      state: props.profileDetails?.state,
      city: props.profileDetails?.city,
      pin: props.profileDetails?.pin,
      industry: props.profileDetails?.industry,
      companyName: props.profileDetails?.companyName,
      rrpLink: props.profileDetails?.rrpLink,
    });
    setcontactNumber(props.profileDetails?.dop_phone);
    setprofileImageUri(props.profileDetails?.picture);
    setUserId(props.userInfo?.user_id);
    setToken(props.userInfo?.token);
    setprofileLoading(false);
  }, []);


  useEffect(() => {
    if (profileupdatestatus) {
      setprofileLoading(false);
      props.profileUpdate();
    }
  }, [profileupdatestatus]);

  useEffect(() => {
    if (profile_update_failed) {
      setSpinner(false);
    }
  }, [profile_update_failed]);

  const togglTimezone = () => settimezoneVisible(!timezoneVisible);

  const changeText = (field, value) => {
     setuserAllDetails({...userAllDetails, [field]: value});
  };

  const changeNumber = (field, value) => {
    let dupContact = [...contactNumber];
    dupContact[field] = {...dupContact[field], on_call_phone_number: value};
    setcontactNumber(dupContact);
    setuserAllDetails({...userAllDetails,
      dop_phone:dupContact
    })
  };

  const changeCountryCode = (field, value) => {};

  const fieldAdd = () => {
    let token = uuidv4();

    setcontactNumber([
      ...contactNumber,
      {
        id: token,
        on_call_phone_number: '',
      },
    ]);
  };

  const deleteField = () => {
    setcontactNumber(obj => obj.filter((_, i) => i !== obj.length - 1));
  };

  const updateProfileDetails = async () => {
    var on_call_phone_number_array = [];
    on_call_phone_number_array.push(userAllDetails.oncall1);

    for (let i = 0; i < contactNumber.length; i++) {
      if (contactNumber[i].on_call_phone_number) {
        on_call_phone_number_array.push(contactNumber[i].on_call_phone_number);
      }
    }
    var validation = true;
    on_call_phone_number_array.map(item => {
      if (item == null) validation = false;
    });
    Object.values(userAllDetails).forEach(val => {
      if (val == null || val == '') {
        validation = false;
      } 
      else if (val) {
        if (val.length == 0) {
          validation = false;
        }
      }
    });
    validation = true
    if (validation) {
      const sendData = {
        user_id: userId,
        first_name: userAllDetails.firstName,
        last_name: userAllDetails.lastName,
        on_call_phone_number: on_call_phone_number_array,
        email: userAllDetails.email,
        mobile_phone: userAllDetails.mobileNumber,
        alt_phone: userAllDetails.alternatePhone,
        street_address: userAllDetails.street,
        suite: userAllDetails.suite,
        state: userAllDetails.state,
        city: userAllDetails.city,
        postal_code: userAllDetails.pin,
        industry: userAllDetails.industry,
        company_name: userAllDetails.companyName,
        rrp_link: userAllDetails.rrpLink,
        timezone: userAllDetails.timeZone,
      };
      props.updateProfileField({token, sendData, singleFile});
      setSpinner(true);
    } else {
      Alert.alert('Please fill all the fields.');
    }
  };

  const selectFile = () => {
    const options = {
      maxHeight: 300,
      maxWidth: 300,
      storageOptions: {
        path: 'images',
        mediatype: 'photo',
      },
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        //Toast.show("Cancelled");
      } else if (response.error) {
        //Toast.show("Error while uploading");
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setSingleFile(response);
        setprofileImageUri(response.assets[0].uri);
      }
    });
  };


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: globalColor.WHITE}}>
      {profileLoading ? (
        <TomLoader />
      ) : (
        <>
        <Spinner
          visible={spinner}
          textContent={'Updating profile info Data'}
          textStyle={LoaderStyle.spinnerTextStyle}
        />

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                // flex: 1,
                height:
                  Platform.OS == 'android'
                    ? HeightPercent(25)
                    : HeightPercent(20),
                backgroundColor: globalColor.NEWTHEME,
                paddingVertical: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: HeightPercent(1),
                }}>
                <MaterialCommunityIcons
                  onPress={() => {
                    props.profileUpdate();
                  }}
                  name="keyboard-backspace"
                  size={WidthPercent(8)}
                  style={{color: globalColor.WHITE}}
                />
                <TouchableOpacity
                  onPress={() => {
                    updateProfileDetails();
                  }}>
                  <Text
                    style={{
                      color: globalColor.WHITE,
                      fontSize: WidthPercent(5),
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                }}>
                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() => {
                    selectFile();
                  }}>
                  <Image
                    style={{
                      height:
                        Platform.OS == 'android'
                          ? HeightPercent(4)
                          : HeightPercent(3),
                      width:
                        Platform.OS == 'android'
                          ? HeightPercent(4)
                          : HeightPercent(3),
                      position: 'absolute',
                      zIndex: 1,
                      // top: HeightPercent(-5),
                      right: WidthPercent(2),
                    }}
                    source={require('../Assests/Images/edit.png')}
                  />
                  <Image
                    style={{
                      height:
                        Platform.OS == 'android'
                          ? HeightPercent(14)
                          : HeightPercent(10),
                      width:
                        Platform.OS == 'android'
                          ? HeightPercent(14)
                          : HeightPercent(10),
                      borderRadius:
                        Platform.OS == 'android'
                          ? HeightPercent(7)
                          : HeightPercent(5),
                      backgroundColor: globalColor.LIGHTGREY,
                    }}
                    source={
                      profileImageUri
                        ? {uri: profileImageUri}
                        : require('../Assests/Images/profile.png')
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <KeyboardAvoidingView
            keyboardVerticalOffset={10}
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{
                flex: 1,
                // height:HeightPercent(75),
                width: WidthPercent(90),
                alignSelf: 'center',
                backgroundColor: globalColor.WHITE,
              }}>

              <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1, margin: 10,}}>
                
                <TextInputSecond
                  label="ON CALL PHONE NUMBER"
                  countrycode={true}
                  val={userAllDetails.oncall1}
                  name="oncall1"
                  _onChangeText={changeText}
                  right={
                    userAllDetails.dop_phone?.length == 0 &&
                    contactNumber.length < 1
                      ? true
                      : false
                  }
                  addField={
                    userAllDetails.dop_phone?.length == 0 &&
                    contactNumber.length < 1
                      ? fieldAdd
                      : null
                  }
                />

                {contactNumber?.length > 0 &&
                  contactNumber.map((item, index) => {
                    return (
                      <View key={item.id}>
                        <TextInputSecond
                          label={'ON CALL PHONE NUMBER ' + parseInt(index + 2)}
                          countrycode={true}
                          val={item.on_call_phone_number}
                          name={index}
                          _onChangeText={changeNumber}
                          _onChangeFormattedText={changeCountryCode}
                          right={
                            index == contactNumber.length - 1 ? true : false
                          }
                          addField={fieldAdd}
                          deleteField={deleteField}
                        />
                      </View>
                    );
                  })}
                <TomTextInputThird
                  name="firstName"
                  label="FIRST NAME"
                  val={userAllDetails?.firstName}
                  _onChangeText={changeText}
                />
                <TomTextInputThird
                  name="lastName"
                  label="LAST NAME"
                  val={userAllDetails?.lastName}
                  _onChangeText={changeText}
                />

                <TextInputSecond
                  name="mobileNumber"
                  countrycode={true}
                  label="MOBILE NUMBER"
                  val={userAllDetails?.mobileNumber}
                  _onChangeText={changeText}
                />
                <TextInputSecond
                  name="email"
                  label="EMAIL"
                  val={userAllDetails?.email}
                  _onChangeText={changeText}
                />
                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: globalColor.LIGHTGREY,
                    // padding: HeightPercent(1),
                    zIndex: 1,
                  }}
                  onPress={() => {
                    settimezoneVisible(!timezoneVisible);
                  }}>
                  <Text style={{fontSize: WidthPercent(3)}}>TIME ZONE</Text>

                  <Picker
                    selectedValue={userAllDetails.timeZone}
                    onValueChange={(itemValue, itemIndex) => {
                      changeText('timeZone', itemValue), togglTimezone();
                    }}>
                    {timeZoneList.map(item => {
                      return (
                        <Picker.Item
                          key={item.toString()}
                          value={item}
                          label={item}
                        />
                      );
                    })}
                  </Picker>
                </TouchableOpacity>

                <TextInputSecond
                  name="alternatePhone"
                  countrycode={true}
                  label="ALTERNATIVE PHONE NUMBER"
                  val={userAllDetails?.alternatePhone}
                  _onChangeText={changeText}
                />
                <TextInputSecond
                  name="street"
                  label="STREET ADDRESS"
                  val={userAllDetails?.street}
                  _onChangeText={changeText}
                />
                <TextInputSecond
                  name="suite"
                  label="SUITE"
                  val={userAllDetails?.suite}
                  _onChangeText={changeText}
                />
                <TextInputSecond
                  name="state"
                  label="STATE"
                  val={userAllDetails?.state}
                  _onChangeText={changeText}
                />
                <TextInputSecond
                  name="city"
                  label="CITY"
                  val={userAllDetails?.city}
                  _onChangeText={changeText}
                />

               <TomTextInputThird
                  name="pin"
                  label="POSTAL CODE"
                  val={userAllDetails?.pin}
                  _onChangeText={changeText}
                />

                <TomTextInputThird
                  name="industry"
                  label="INDUSTRY"
                  val={userAllDetails?.industry}
                  _onChangeText={changeText}
                />
                <TomTextInputThird
                  name="companyName"
                  label="COMPANY NAME"
                  val={userAllDetails?.companyName}
                  _onChangeText={changeText}
                />
                <TextInputSecond
                  name="rrpLink"
                  label="RRP LINK"
                  val={userAllDetails?.rrpLink}
                  _onChangeText={changeText}
                />
              


       <TouchableOpacity
          style={{
            height:
              Platform.OS == 'android' ? HeightPercent(6) : HeightPercent(6),
            width: WidthPercent(80),
            borderRadius: 10,
            marginTop: HeightPercent(5),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: globalColor.BTNCOLOR,
          }}
          onPress={() => {
            updateProfileDetails();
          }}>
          <Text style={{fontSize: WidthPercent(4), color: globalColor.WHITE}}>
            Save Changes
          </Text>
        </TouchableOpacity>

              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
};
const mapStateToProps = state => ({
  // userInfo: state.auth.user,
  profileupdatestatus: state.profile.profileupdatestatus,
  profile_update_failed: state.profile.profile_update_failed,
});
export default connect(mapStateToProps, {updateProfileField})(ProfileEdit);
