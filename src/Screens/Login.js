import React, {useState, useEffect, useContext} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {HeightPercent, WidthPercent} from '../Global/device';
import * as globalColor from '../Global/color';
import {TomTextInput} from '../Utils/TomTextInput';
import {userDetails} from '../Global/userDetails';
import {connect} from 'react-redux';
import {LoginApi, clearAuth} from '../Redux/Actions/authAction';
import { AuthContext } from '../Components/context';

const Login = props => {
  // const {signIn} = useContext(AuthContext);
  const [generatedToken, setgeneratedToken] = useState(null);
  const [email_phone_txt, setemail_phone_txt] = useState('');
  const [password_txt, setpassword_txt] = useState('');
  const [changeicon, setchangeicon] = useState(false);

  const {userInfo, isAuthenticated, error, show_message} = props;
  useEffect(() => {
    if (error.id === 'LOGIN_FAIL' && !isAuthenticated) {
      Alert.alert(error.message);
    }
  }, [ error]);
  useEffect(() => {
    getData();
  }, []);

  const emailValidation = (a, b) => {
    setemail_phone_txt(b);
  };
  const passwordValidation = (a, b) => {
    setpassword_txt(b);
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        // value previously stored
        setgeneratedToken(value);
      } else {
        let token = uuidv4();
        setgeneratedToken(token);
        storeData('token', token);
      }
    } catch (e) {
      console.log('getToken error', e);
    }
  };
  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
      console.log('token store error', e);
    }
  };
  const logInFunc = async () => {
    try {
      if (email_phone_txt.length > 5 && password_txt.length > 5) {
        const sendData = {
          email: email_phone_txt,
          password: password_txt,
          device_type: Platform.OS,
          device_token: generatedToken,
          time_zone: '',
        };

        let OS = Platform.OS;
        let timeZone = '';
        props.LoginApi({
          email_phone_txt,
          password_txt,
          OS,
          generatedToken,
          timeZone,
        });


        // console.log('send',sendData);
        // const res = await axios.post(
        //   'https://dev.nodejsdapldevelopments.com/api/v1/login',
        //   sendData,
        // );
        // if (res.data.status == 200) {
        //   const jsonuserData = JSON.stringify(res.data.data);
        //   storeData('userData', jsonuserData);
        //   props.navigation.navigate('Dashboard');
        // }
      } else {
        Alert.alert('email and password should be at least 6 digit');
      }
    } catch (error) {
      console.error('error', error);
      Alert.alert('Wrong email or password.');
    }
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: globalColor.BACKGROUND,
        justifyContent: 'center',
      }}>
      <StatusBar backgroundColor={globalColor.PRIMARY} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            backgroundColor: globalColor.WHITE,
            margin: 30,
            borderRadius: 10,
            height: HeightPercent(60),
          }}>
          <View style={{flex: 1}}>
            <Text
              style={{
                color: globalColor.CARD,
                fontSize: WidthPercent(15),
                fontWeight: 'bold',
                marginLeft: 10,
                paddingTop: HeightPercent(5),
              }}>
              Login
            </Text>
            <Text
              style={{
                color: globalColor.PRIMARY,
                fontSize: WidthPercent(5),
                paddingLeft: 10,
              }}>
              Sign in to your account
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: HeightPercent(8),
              }}>
              <TomTextInput
                name="email"
                placeholder={'Email'}
                leftIcon={'alternate-email'}
                textStatus={false}
                floatingLabelEnabled={true}
                isError={null}
                _onChanssgeText={emailValidation}
                maxLength={40}
                //onSubmit={() => this._callAsync()}
              />

              <TomTextInput
                placeholder={'Password'}
                leftIcon={'lock'}
                rightIcon={'eye-off'}
                textStatus={true}
                floatingLabelEnabled={true}
                isError={null}
                _onChanssgeText={passwordValidation}
                name="phone_number"
                maxLength={20}
                //onSubmit={() => this._callAsync()}
              />
            </View>
          </KeyboardAvoidingView>
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
                backgroundColor: globalColor.PRIMARY,
                borderRadius: 5,
                width: WidthPercent(35),
                padding:Platform.OS=='android'? HeightPercent(2):HeightPercent(1.5)
                // height:Platform.OS=='android'? HeightPercent(7):HeightPercent(5),
              }}
              onPress={() => {
                logInFunc();
              }}>
              <Text
                style={{
                  color: globalColor.WHITE,
                  textAlign: 'center',
                  fontSize: WidthPercent(5),
                }}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ForgotPassword');
              }}>
              <Text
                style={{
                  color: globalColor.PRIMARY,
                  fontSize: WidthPercent(4),
                  fontWeight: 'bold',
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
const mapStateToProps = state => ({
  show_message: state.error.message,
  error: state.error,
  // loading: state.loader.isLoading,
  isAuthenticated: state.auth.isAuthenticated,
  userInfo: state.auth.user,
});
export default connect(mapStateToProps, {LoginApi, clearAuth})(Login);
