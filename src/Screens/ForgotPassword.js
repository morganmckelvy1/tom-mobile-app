import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Image
} from 'react-native';
import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {TomTextInput} from '../Utils/TomTextInput';
import {
  forgotpasswordresetlink,
  resetPasswordAction,
  clearcresetLink,
  clearResetpasswordstatus,
} from '../Redux/Actions/authAction';
import Logo from '../Assests/Images/logo.png';


const ForgotPassword = props => {
  const {linksent, resetstatus, error} = props;
  const [sendResetMail, setsendResetMail] = useState(false);
  const [email_txt, setemail_txt] = useState('');
  const [password_txt, setpassword_txt] = useState('');
  const [confirmPassword_txt, setconfirmPassword_txt] = useState('');
  const [emailToken, setemailToken] = useState('');

  useEffect(() => {
    if (props && props?.route?.params?.value1) {
      setemailToken(props.route.params.value1);
      setsendResetMail(true);
    }
  }, [props]);


  useEffect(() => {
    if (linksent && error.id != 'LINKSENT_FAIL') {
      Alert.alert('check your email and click the link to reset your password');
    }
    if (resetstatus) {
      Alert.alert('You have successfully create your password', '', [
        {
          text: 'OK',
          onPress: () => {
            props.clearResetpasswordstatus();
          },
        },
      ]);

      setemailToken('');
      setsendResetMail(false);
      props.navigation.navigate('Login');
    }
    if (error.id == 'LINKSENT_FAIL' && !linksent) {
      Alert.alert(error.message);
    }
    if (error.id == 'RESETPASSWORD_FAIL' && !resetstatus) {
      Alert.alert(error.message);
    }
  }, [linksent, error, resetstatus]);

  const emailvalidation = (a, b) => {
    setemail_txt(b);
  };

  const passwordvalidation = (a, b) => {
    setpassword_txt(b);
  };
  const confirmpasswordvalidation = (a, b) => {
    setconfirmPassword_txt(b);
  };
  const sendResetLink = async () => {
    try {
      if (email_txt.length > 5) {
        props.forgotpasswordresetlink({email_txt});
      } else {
        Alert.alert('email should be at least 6 digit');
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const resetPassword = () => {
    props.clearcresetLink();
    if (password_txt.length > 5 && confirmPassword_txt.length > 5) {
      if (password_txt == confirmPassword_txt) {
        props.resetPasswordAction({
          password_txt,
          confirmPassword_txt,
          emailToken,
        });
      } else {
        Alert.alert('New password and Confirm password should be same');
      }
    } else {
      Alert.alert('password should be minimum 6 digits');
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
            height: HeightPercent(50),
          }}>

          <View style={{ flex: 1, padding: 15 }}>
              <Image source={Logo}
                style={{
                  height: 100,
                  width: 300,
                }}
              />
            </View>

          <View style={{flex: 1}}>
            <Text
              style={{
                color: globalColor.CARD,
                  fontSize: WidthPercent(8),
                  fontWeight: 'bold',
                  marginLeft: 10,
                  textAlign: 'center'
              }}>
              {sendResetMail ? 'Reset Password' : 'Forgot Password'}
            </Text>
            <Text
              style={{
                color: globalColor.PRIMARY,
                  fontSize: WidthPercent(4),
                  paddingLeft: 10,
                  textAlign: 'center'
              }}>
              {sendResetMail
                ? 'The password should have atleast 6 characters'
                : 'Enter your email address to reset your password'}
            </Text>
          </View>
          <KeyboardAvoidingView
            style={{flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingVertical: 5,
                marginTop: HeightPercent(5),
              }}>
              {!sendResetMail ? (
                <TomTextInput
                  name="email"
                  placeholder={'Email'}
                  leftIcon={'alternate-email'}
                  textStatus={false}
                  floatingLabelEnabled={true}
                  isError={null}
                  _onChanssgeText={emailvalidation}
                  maxLength={50}
                  //onSubmit={() => this._callAsync()}
                />
              ) : (
                <>
                  <TomTextInput
                    name="New Password"
                    placeholder={'New Password'}
                    leftIcon={'lock'}
                    rightIcon={'eye-off'}
                    textStatus={true}
                    floatingLabelEnabled={true}
                    isError={null}
                    _onChanssgeText={passwordvalidation}
                    maxLength={20}
                  />
                  <TomTextInput
                    name="Confirm New Password"
                    placeholder={'Confirm New Password'}
                    leftIcon={'lock'}
                    rightIcon={'eye-off'}
                    textStatus={true}
                    floatingLabelEnabled={true}
                    isError={null}
                    _onChanssgeText={confirmpasswordvalidation}
                    maxLength={20}
                  />
                </>
              )}
            </View>
          </KeyboardAvoidingView>
          <View
            style={{
              flex: 1,
              flexDirection: !sendResetMail ? 'row' : null,
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                backgroundColor: globalColor.BTNCOLOR,
                borderRadius: 5,
                width: !sendResetMail ? WidthPercent(35) : WidthPercent(70),
                height:Platform.OS=='android'? HeightPercent(6):HeightPercent(5),

              }}
              onPress={() => {
                sendResetMail ? resetPassword() : sendResetLink();
              }}>
              <Text
                style={{
                  color: globalColor.WHITE,
                  textAlign: 'center',
                  fontSize: WidthPercent(3.5),
                }}>
                Reset Password
              </Text>
            </TouchableOpacity>
            {!sendResetMail && (
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#2c3334',
                  borderRadius: 5,
                  width: WidthPercent(35),
                  height:Platform.OS=='android'? HeightPercent(6):HeightPercent(5),
                }}
                onPress={() => {
                  props.navigation.navigate('Login');
                }}>
                <Text
                  style={{
                    color: globalColor.BLACK,
                    textAlign: 'center',
                    fontSize: WidthPercent(3.5),
                  }}>
                  Back to login
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
    </LinearGradient>
  );
};

const mapStateToProps = state => ({
  linksent: state.auth.linksent,
  resetstatus: state.auth.resetstatus,
  error: state.error,
});
export default connect(mapStateToProps, {
  forgotpasswordresetlink,
  resetPasswordAction,
  clearcresetLink,
  clearResetpasswordstatus,
})(ForgotPassword);
