import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  Text,
  Image,
  View,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { HeightPercent, WidthPercent } from '../Global/device';
import * as globalColor from '../Global/color';
import { TomTextInput } from '../Utils/TomTextInput';
import { connect } from 'react-redux';
import { LoginApi, clearAuth } from '../Redux/Actions/authAction';
import Logo from '../Assests/Images/logo.png';

const Login = props => {
  const [generatedToken, setgeneratedToken] = useState(null);
  const [email_phone_txt, setemail_phone_txt] = useState('');
  const [password_txt, setpassword_txt] = useState('');

  const { isAuthenticated, error } = props;

  useEffect(() => {
    if (error.id === 'LOGIN_FAIL' && !isAuthenticated) {
      Alert.alert(error.message);
    }
  }, [error]);

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
        const OS = Platform.OS;
        const timeZone = '';
        props.LoginApi({
          email_phone_txt,
          password_txt,
          OS,
          generatedToken,
          timeZone,
        });
      } else {
        Alert.alert('Email and password should be at least 6 digit');
      }
    } catch (error) {
      Alert.alert('Wrong email or password.');
    }
  };


  return (
    <LinearGradient
     colors={['#02373B', '#02373B', '#192f6a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        style={{
          flex: 1,
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
            <View style={{ flex: 1, padding: 15 }}>
              <Image source={Logo}
                style={{
                  height: 100,
                  width: 300,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: globalColor.CARD,
                  fontSize: WidthPercent(8),
                  fontWeight: 'bold',
                  marginLeft: 10,
                  textAlign: 'center'
                }}>
                Login
              </Text>
              <Text
                style={{
                  color: globalColor.PRIMARY,
                  fontSize: WidthPercent(4),
                  paddingLeft: 10,
                  textAlign: 'center'
                }}>
                Sign in with your credentials below
              </Text>
            </View>
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center'
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
                  backgroundColor: globalColor.BTNCOLOR,
                  borderRadius: 5,
                  width: WidthPercent(35),
                  padding: Platform.OS == 'android' ? HeightPercent(1.6) : HeightPercent(1.5)
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
    </LinearGradient>
  );
};
const mapStateToProps = state => ({
  show_message: state.error.message,
  error: state.error,
  // loading: state.loader.isLoading,
  isAuthenticated: state.auth.isAuthenticated,
  userInfo: state.auth.user,
});
export default connect(mapStateToProps, { LoginApi, clearAuth })(Login);
