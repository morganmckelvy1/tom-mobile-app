import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {changePasswordAction} from '../Redux/Actions/profileAction';
import Header from '../Components/Header';

const ChangePassword = props => {
  const {changepasswordStatus, error} = props;
  const [currentPassShow, setcurrentPassShow] = useState(false);
  const [newPassShow, setnewPassShow] = useState(false);
  const [confirmNewPassShow, setconfirmNewPassShow] = useState(false);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  const [currentPassword, setcurrentPassword] = useState('');
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  useEffect(() => {
    setUserId(props.route.params.userInfo.user_id);
    setToken(props.route.params.userInfo.token);
  }, []);

  useEffect(() => {
    if (changepasswordStatus == true) {
      Alert.alert('Password changed successfully.');
      props.navigation.goBack();
    }
    if (error.id === 'CHANGE_PASSWORD' && !changepasswordStatus) {
      Alert.alert(error.message);
    }
  }, [changepasswordStatus, error]);

  const passwordValidation = () => {
    if (
      currentPassword.length > 5 &&
      newPassword.length > 5 &&
      confirmPassword.length > 5
    ) {
      if (newPassword == confirmPassword) {
        changePasswordApi();
      } else {
        Alert.alert('New password and Confirm password should be same');
      }
    } else {
      Alert.alert('password should be minimum 6 digits');
    }
  };

  const pressleftIcon = () => {
    props.navigation.goBack();
  };

  const changePasswordApi = () => {
    props.changePasswordAction({token, userId, currentPassword, newPassword});
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: globalColor.WHITE}}>
      <Header
        title="Change Password"
        leftIcon="keyboard-backspace"
        pressLeftIcon={pressleftIcon}
        rightIcon={null}
        pressRightIcon={null}
      />
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.container}>
          <TextInput
            style={{flex: 1}}
            onChangeText={text => {
              setcurrentPassword(text);
            }}
            value={currentPassword}
            placeholder="Current Password"
            secureTextEntry={currentPassShow ? false : true}
          />
          <Ionicons
            name={currentPassShow ? 'eye' : 'eye-off'}
            size={WidthPercent(5.5)}
            onPress={() => {
              setcurrentPassShow(!currentPassShow);
            }}
          />
        </View>
        <View style={styles.container}>
          <TextInput
            style={{flex: 1}}
            onChangeText={text => {
              setnewPassword(text);
            }}
            value={newPassword}
            placeholder="New Password"
            secureTextEntry={newPassShow ? false : true}
          />
          <Ionicons
            name={newPassShow ? 'eye' : 'eye-off'}
            size={WidthPercent(5.5)}
            onPress={() => {
              setnewPassShow(!newPassShow);
            }}
          />
        </View>
        <View style={styles.container}>
          <TextInput
            style={{flex: 1}}
            onChangeText={text => {
              setconfirmPassword(text);
            }}
            value={confirmPassword}
            placeholder="Confirm New Password"
            secureTextEntry={confirmNewPassShow ? false : true}
          />
          <Ionicons
            name={confirmNewPassShow ? 'eye' : 'eye-off'}
            size={WidthPercent(5.5)}
            onPress={() => {
              setconfirmNewPassShow(!confirmNewPassShow);
            }}
          />
        </View>
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
            passwordValidation();
          }}>
          <Text style={{fontSize: WidthPercent(4), color: globalColor.BLACK}}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: globalColor.LIGHTGREY,
    borderRadius: 5,
    padding: Platform.OS == 'android' ? WidthPercent(0) : WidthPercent(3),
  },
});

const mapStateToProps = state => ({
  // userInfo: state.auth.user,
  error: state.error,
  changepasswordStatus: state.profile.changepasswordStatus,
});
export default connect(mapStateToProps, {changePasswordAction})(ChangePassword);
