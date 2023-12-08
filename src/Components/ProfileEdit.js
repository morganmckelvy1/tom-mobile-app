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
  Platform,
} from 'react-native';
import {Button, Menu, Divider, Provider} from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {v4 as uuidv4} from 'uuid';
import {connect} from 'react-redux';
import {Picker} from '@react-native-picker/picker';

import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {userDetails} from '../Global/userDetails';
import {TextInputSecond} from '../Utils/TomTextInputSecond';
import {TomTextInputThird} from '../Utils/TomTextInputThird';
import {BASEURL} from '../Global/common';
import {updateProfileField} from '../Redux/Actions/profileAction';
import TomLoader from './tomLoader';
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
  const {profileupdatestatus} = props;
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const [userAllDetails, setuserAllDetails] = useState({
    firstName: null,
    lastName: null,
    userName: null,
    email: null,
    picture: null,
    oncall1: null,
    dop_phone: null,
    mobileNumber: null,
    alternatePhone: null,
    timeZone: null,
    street: null,
    suite: null,
    state: null,
    city: null,
    pin: null,
    birthDate: null,
    industry: null,
    companyName: null,
    rrpLink: null,
  });
  const [contactNumber, setcontactNumber] = useState([]);
  const [profileImageObj, setprofileImageObj] = useState('');
  const [profileImageUri, setprofileImageUri] = useState('');
  const [singleFile, setSingleFile] = useState(null);
  const [timezoneVisible, settimezoneVisible] = useState(false);
  const [profileLoading, setprofileLoading] = useState(true);

  //Back Handle...
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
      userName: props.profileDetails?.userName,
      email: props.profileDetails?.email,
      // picture: props.profileDetails?.picture,
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
      birthDate: props.profileDetails?.birthDate,
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
      Alert.alert('Profile updated successfully.');
    }
  }, [profileupdatestatus]);

  const togglTimezone = () => settimezoneVisible(!timezoneVisible);

  // const changeText = async (field, value) => {
  //     console.log('value----', value);
  //    let checkVal=''
  //   if(value){
  //    checkVal= await removeEmojis(value)
  //   }
  //   // if(checkVal!== ''){
  //     setuserAllDetails({...userAllDetails, [field]: checkVal});
  //   // }

   
  // };

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
console.log("\nedit pofile",userAllDetails,"\n")
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
        birthday_mounth: userAllDetails.birthDate,
        username: userAllDetails.userName,
        industry: userAllDetails.industry,
        company_name: userAllDetails.companyName,
        rrp_link: userAllDetails.rrpLink,
        timezone: userAllDetails.timeZone,
      };
      var config = {
        method: 'post',
        url: BASEURL + '/update-profile',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        data: sendData,
      };
      props.updateProfileField({token, sendData, singleFile});
      //setprofileLoading(true);
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
        // console.log('response',response);
        setSingleFile(response);
        setprofileImageUri(response.assets[0].uri);
      }
    });
  };

  const removeEmojis = (string) => {
    // emoji regex from the emoji-regex library
    //console.log('removeEmoji called------', string);
    const regex = /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g
    //console.log('removeEmoji called1111111111------', string.replace(regex, ''));    
    return string.replace(regex, '')
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: globalColor.WHITE}}>
      {profileLoading ? (
        <TomLoader />
      ) : (
        <>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                // flex: 1,
                height:
                  Platform.OS == 'android'
                    ? HeightPercent(25)
                    : HeightPercent(20),
                backgroundColor: globalColor.CARD,
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
                    // console.log('asas', userAllDetails);
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

                {/* <TextInputSecond
                  name="pin"
                  label="POSTAL CODE"
                  // val={removeEmojis(userAllDetails?.pin)}
                  val={userAllDetails?.pin}
                  _onChangeText={changeText}
                /> */}

               <TomTextInputThird
                  name="pin"
                  label="POSTAL CODE"
                  val={userAllDetails?.pin}
                  _onChangeText={changeText}
                />

                <TouchableOpacity
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: globalColor.LIGHTGREY,
                    padding: HeightPercent(1),
                  }}
                  onPress={() => {
                    setOpen(true);
                  }}>
                  <Text style={{fontSize: WidthPercent(3)}}>DATE OF BIRTH</Text>
                  <Text
                    style={{
                      fontSize: WidthPercent(3),
                      color: globalColor.BLACK,
                      paddingVertical: HeightPercent(1),
                    }}>
                    {userAllDetails?.birthDate}
                  </Text>

                  <DatePicker
                    modal
                    open={open}
                    mode="date"
                    maximumDate={new Date()}
                    date={new Date()}
                    onConfirm={date => {
                      setOpen(false);
                      var selectedDate = `${date.getFullYear()}/${
                        date.getMonth() + 1
                      }/${date.getDate()}`;
                      changeText('birthDate', selectedDate);
                      // setDate(date);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                </TouchableOpacity>
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
                <TextInputSecond
                  name="userName"
                  label="USERNAME"
                  val={userAllDetails?.userName}
                  _onChangeText={changeText}
                />
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
});
export default connect(mapStateToProps, {updateProfileField})(ProfileEdit);
