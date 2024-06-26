import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  BackHandler,
  SafeAreaView,
  Platform,
  StyleSheet
} from 'react-native';
import {connect} from 'react-redux';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {userDetails} from '../Global/userDetails';
import ProfileEdit from '../Components/ProfileEdit';
import axios from 'axios';
import {
  getProfileData,
  clearUpdateProfileStatus,
  clearchangePasswordStatus,
} from '../Redux/Actions/profileAction';
import Header from '../Components/Header';
import FieldView from '../Components/FieldView';
import TomLoader from '../Components/tomLoader';


const Profile = props => {
  const {UserprofileDetails, profileupdatestatus, error} = props;
  const [userInfo, setUserInfo] = useState('');
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
    video_tutorial: null,
  });
  const [playingVideo, setplayingVideo] = useState({status: false, id: null});
  const [profileLoading, setprofileLoading] = useState(true);
  const [profileEditStatus, setprofileEditStatus] = useState(false);
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => {
      backHandler.remove();
    };
  }, []);
  useEffect(() => {
    getProfileDetails();
  }, [profileupdatestatus]);
  useEffect(() => {
    if (error.id === 'AUTH_FAIL') {
      Alert.alert(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (UserprofileDetails) {
      setuserAllDetails({
        firstName: UserprofileDetails.users_data.first_name,
        lastName: UserprofileDetails.users_data.last_name,
        email: UserprofileDetails.users_data.email,
        picture: UserprofileDetails.users_data.picture,
        oncall1: UserprofileDetails.users_data.on_call_phone_number,
        dop_phone: UserprofileDetails.dop_phone,
        mobileNumber: UserprofileDetails.users_data.mobile_phone,
        alternatePhone: UserprofileDetails.users_data.alt_phone,
        timeZone: UserprofileDetails.users_data.timezone,
        street: UserprofileDetails.users_data.street_address,
        suite: UserprofileDetails.users_data.suite,
        state: UserprofileDetails.users_data.state,
        city: UserprofileDetails.users_data.city,
        pin: UserprofileDetails.users_data.postal_code,
        birthDate: UserprofileDetails.users_data.birthday_mounth,
        userName: UserprofileDetails.users_data.username,
        industry: UserprofileDetails.users_data.industry,
        companyName: UserprofileDetails.users_data.company_name,
        rrpLink: UserprofileDetails.users_data.rrp_link,
        video_tutorial: UserprofileDetails.video_tutorial[0].link,
      });
      setprofileLoading(false);
    }
  }, [UserprofileDetails]);



  const getotp=async()=>{
    const createAppointment = await axios.post(
      "https://foure.nodejsdapldevelopments.com/perpetuitycapital/public/api/v1/Auth/send-otp",{
        "country_code": '+91',
        "mobile": 7548016279,
        "device_token": "7dab7d20e69e3489",
        "type": 1
      }
    );
    if(createAppointment){
      console.log('createAppointment',createAppointment.data);
    }
  }

  const getProfileDetails = async () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        setUserInfo(data);
        let token = data.token;
        let user_id = data.user_id;
        props.getProfileData({token, user_id});
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const profileUpdateComplete = () => {
    props.clearUpdateProfileStatus();
    setprofileEditStatus(false);
  };

  const pressleftImageIcon = () => {
    props.navigation.toggleDrawer();
  };
  const pressRightTextIcon = () => {
    setprofileEditStatus(true);
    setplayingVideo({
      status: false,
      id: null,
    });
  };

  const [playing, setPlaying] = useState(false);

  const togglePlaying = useCallback(() => {
         setPlaying((prev) => !prev);
    }, []);


  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        animated={true}
        backgroundColor={globalColor.CARD}
        hidden={false}
      />
      {profileLoading ? (
        <TomLoader />
      ) : !profileEditStatus ? (
        <>

          <View
            style={{
              flex: 1,
              backgroundColor: globalColor.NEWTHEME,
              paddingBottom: Platform.OS == 'android' ? HeightPercent(15) : HeightPercent(10),
            }}>
              
            <Header
              title={null}
              leftIcon={null}
              pressLeftIcon={null}
              leftImageIcon={require('../Assests/Images/menu.png')}
              pressleftImageIcon={pressleftImageIcon}
              rightIcon={null}
              pressRightIcon={null}
              rightTextIcon="EDIT"
              pressRightTextIcon={pressRightTextIcon}
            />
            <View
              style={{
                // flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                marginBottom:15
                // padding: 10,
                // marginLeft:WidthPercent(5)
                // backgroundColor:'red',
                // height:HeightPercent(15)
              }}>
              <Image
                style={{
                  height:
                    Platform.OS == 'android'
                      ? HeightPercent(12)
                      : HeightPercent(10),
                  width:
                    Platform.OS == 'android'
                      ? HeightPercent(12)
                      : HeightPercent(10),
                  borderRadius:
                    Platform.OS == 'android'
                      ? HeightPercent(6)
                      : HeightPercent(5),
                  backgroundColor: globalColor.LIGHTGREY,
                }}
                source={
                  userAllDetails.picture
                    ? {uri: userAllDetails.picture}
                    : require('../Assests/Images/profile.png')
                }
              />
              <View style={{marginLeft: WidthPercent(1), width:WidthPercent(55)}}>
                <Text numberOfLines={1} style={{textAlign:'left', fontSize: WidthPercent(5), color: globalColor.WHITE}}>
                  {`${userAllDetails.firstName}${
                    ' ' + userAllDetails.lastName
                  }`}
                </Text>
                <Text
                  style={{
                    fontSize: WidthPercent(4),
                    color: globalColor.WHITE,
                    marginRight: 1,
                    maxHeight: HeightPercent(7),
                    marginBottom:HeightPercent(1.5)
                  }}>
                  {userAllDetails.email}
                </Text>
              </View>
            </View>
          </View>

          
          <View style={{flex: 3, backgroundColor:'#ccc', padding: HeightPercent(2) }}>
            <View  style={{height:HeightPercent(71), width:WidthPercent(95), alignSelf:'center',top:HeightPercent(-7), position:'absolute'}}>
              <ScrollView showsVerticalScrollIndicator={false} style={{backgroundColor:globalColor.WHITE}}>
                <FieldView
                  field={'ON CALL PHONE NUMBER'}
                  value={userAllDetails.oncall1}
                />

                {userAllDetails.dop_phone?.length > 0 &&
                  userAllDetails.dop_phone.map((item, index) => {
                    return (
                      <View key={item.id}>
                        <FieldView
                          field={'ON CALL PHONE NUMBER ' + parseInt(index + 2)}
                          value={item.on_call_phone_number}
                        />
                      </View>
                    );
                  })}

                <FieldView
                  field={'FIRST NAME'}
                  value={userAllDetails.firstName}
                />
                <FieldView
                  field={'LAST NAME'}
                  value={userAllDetails.lastName}
                />
                <FieldView field={'EMAIL'} value={userAllDetails.email} />
                <FieldView
                  field={'MOBILE NUMBER'}
                  value={userAllDetails.mobileNumber}
                />
                <FieldView
                  field={'TIME ZONE'}
                  value={userAllDetails.timeZone}
                />
                <FieldView
                  field={'ALTERNATIVE PHONE NUMBER'}
                  value={userAllDetails.alternatePhone}
                />
                <FieldView
                  field={'STREET ADDRESS'}
                  value={userAllDetails.street}
                />
                <FieldView field={'SUITE'} value={userAllDetails.suite} />
                <FieldView field={'STATE'} value={userAllDetails.state} />
                <FieldView field={'CITY'} value={userAllDetails.city} />
                <FieldView field={'POSTAL CODE'} value={userAllDetails.pin} />
                <FieldView
                  field={'BIRTH DAY'}
                  value={userAllDetails.birthDate}
                />
                <FieldView field={'INDUSTRY'} value={userAllDetails.industry} />
                <FieldView
                  field={'COMPANY NAME'}
                  value={userAllDetails.companyName}
                />
                <FieldView field={'RRP LINK'} value={userAllDetails.rrpLink} />
                <FieldView field={'USERNAME'} value={userAllDetails.userName} />



                <TouchableOpacity
                  style={{
                    height:
                      Platform.OS == 'android' ? HeightPercent(6) : HeightPercent(4),
                    width: WidthPercent(80),
                    borderRadius: 10,
                    marginTop: HeightPercent(3),
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf:'center',
                    marginBottom:HeightPercent(4),
                    backgroundColor: globalColor.BTNCOLOR,
                  }}
                  onPress={() => {
                    props.navigation.navigate('ChangePassword', {
                      userInfo: userInfo,
                    });
                    props.clearchangePasswordStatus();
                  }}
                  
                  >
                  <Text
                    style={{color: globalColor.WHITE, fontWeight:'700', fontSize: WidthPercent(3.5)}}>
                    CHANGE PASSWORD
                  </Text>
                </TouchableOpacity>

                </ScrollView>

            </View>

           

            {/* )} */}
           
          </View>
        </>
      ) : (
        <ProfileEdit
          userInfo={userInfo}
          profileDetails={userAllDetails}
          profileUpdate={() => {
            profileUpdateComplete();
          }}
          {...props}
        />
      )}
    </SafeAreaView>
  );
};
const mapStateToProps = state => ({
  // userInfo: state.auth.user,
  error: state.error,
  UserprofileDetails: state.profile.profileDetails,
  profileupdatestatus: state.profile.profileupdatestatus,
});
export default connect(mapStateToProps, {
  getProfileData,
  clearUpdateProfileStatus,
  clearchangePasswordStatus,
})(Profile);