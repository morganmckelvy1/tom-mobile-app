import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Image, ScrollView, Platform } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { HeightPercent, WidthPercent } from '../Global/device';
import * as globalColor from '../Global/color';
import DrawerItem from '../Utils/NavigationDrawerItem';
import profileIcon from '../Assests/Images/profileIcon.png';
import ContactIcon from '../Assests/Images/contact.png';
import appointmentIcon from '../Assests/Images/appointment.png';
import reminderIcon from '../Assests/Images/reminder.png';
import supportIcon from '../Assests/Images/support.png';
import logoutIcon from '../Assests/Images/logout.png';
import { userDetails } from '../Global/userDetails';

const CustomDrawer = props => {
  const { UserprofileDetails } = props;
  const [userInfo, setUserInfo] = useState({
    name: null,
    email: null,
    profilePic: null,
  });

  useEffect(() => {
    if (UserprofileDetails) {
      setUserInfo({
        name:
          UserprofileDetails.users_data.first_name +
          ' ' +
          UserprofileDetails.users_data.last_name,
        email: UserprofileDetails.users_data.email,
        profilePic: UserprofileDetails.users_data.picture,
      });
    }
  }, [UserprofileDetails]);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.5 }}>
        <LinearGradient
          colors={['#192f6a', '#02373B', '#02373B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              style={{
                height: Platform.OS == 'android' ? HeightPercent(12) : HeightPercent(10),
                width: Platform.OS == 'android' ? HeightPercent(12) : HeightPercent(10),
                borderRadius: Platform.OS == 'android' ? HeightPercent(6) : HeightPercent(5),
                backgroundColor: globalColor.LIGHTGREY,
              }}
              source={
                userInfo.profilePic
                  ? { uri: userInfo.profilePic }
                  : require('../Assests/Images/profile.png')
              }
            />
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: HeightPercent(2),
              }}>
              <Text numberOfLines={1} style={{ width: WidthPercent(50), fontSize: WidthPercent(5), color: globalColor.WHITE }}>
                {userInfo.name}
              </Text>
              <Text
                style={{
                  fontSize: WidthPercent(4),
                  color: globalColor.WHITE,
                  maxHeight: HeightPercent(7),
                }}>
                {userInfo.email}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <ScrollView style={{ flex: 2, backgroundColor: '#FFFFFF' }}>
        <DrawerItem src={profileIcon} name="Profile" {...props} />
        <DrawerItem src={ContactIcon} name="Contacts" {...props} />
        <DrawerItem src={appointmentIcon} name="QuickAppointment" {...props} />
        {/* <DrawerItem src={reminderIcon} name="Quick Reminder" {...props}/> */}
        <DrawerItem src={supportIcon} name="Support" {...props} />
        <DrawerItem src={logoutIcon} name="Logout" {...props} />
      </ScrollView>
    </View>
  );
};
const mapStateToProps = state => ({
  // userInfo: state.auth.user,
  error: state.error,
  UserprofileDetails: state.profile.profileDetails,
});
export default connect(mapStateToProps, {})(CustomDrawer);
