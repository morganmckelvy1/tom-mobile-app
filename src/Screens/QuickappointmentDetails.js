import React, {useEffect, useState} from 'react';
import {
  View,
  StatusBar,
  Text,
  TouchableOpacity,
  Alert,
  BackHandler,
  ScrollView,
  Modal,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {connect} from 'react-redux';

import ContactEdit from '../Components/ContactCreateEdit';
import FieldView from '../Components/FieldView';
import Header from '../Components/Header';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {
  cleareditAppointment,
  deleteAppointment,
} from '../Redux/Actions/appointmentAction';
import {userDetails} from '../Global/userDetails';
import TomLoader from '../Components/tomLoader';
import {TextInputSecond} from '../Utils/TomTextInputSecond';
import SearchBox from '../Utils/SearchBox';
import QuickAppointmentCreateEdit from '../Components/QuickAppointmentCreateEdit';

function QuickAppointmentDetails(props) {
  const {deleteAppointmentStatus} = props;

  const [isLoading, setisLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [appointmentInfos, setAppointmentInfo] = useState('');
  const [editAppointmentStatus, seteditAppointmentStatus] = useState(false);
  const [campaignModal, setcampaignModal] = useState(false);
  const [campaignList, setcampaignList] = useState([]);

  //Back handler.....
  useEffect(() => {
    const backAction = () => {
      pressLeftIcon();
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
    setAppointmentInfo(props.route.params.appointmentInfo);
    setisLoading(false);
  }, []);
  


  useEffect(() => {
    if (deleteAppointmentStatus) {
      Alert.alert(deleteAppointmentStatus);
      props.navigation.goBack();

      //Toggle drawer not working.....
      // props.navigation.navigate('QuickAppointment',{deletedAppointment:true});
    }
  }, [deleteAppointmentStatus]);

  const deleteAppointment = async () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let user_id = data.user_id;
        let id = appointmentInfos.id;
        props.deleteAppointment({token, id});
        setisLoading(true);
      });
    } catch (error) {
      console.log('delete error', error);
    }
  };

  //Header prop....
  const pressLeftIcon = () => {
    props.navigation.goBack();
  };

  const pressRightTextIcon = () => {
    // props.navigation.goBack();
    seteditAppointmentStatus(true);
  };

  //Edit contact property...
  const backPress = () => {
    seteditAppointmentStatus(false);
  };
  const editAppointmentResponse = val => {
    setAppointmentInfo(val);
    seteditAppointmentStatus(false);
    props.cleareditAppointment();
  };

  return (
    <>
      {isLoading ? (
        <TomLoader />
      ) : editAppointmentStatus ? (
        <QuickAppointmentCreateEdit
          type="Edit"
          backPress={backPress}
          appointmentInfo={appointmentInfos}
          editAppointmentResponse={editAppointmentResponse}
        />
      ) : (
        !isLoading && (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: globalColor.BACKGROUND,
              // alignItems: 'center',
            }}>
            <StatusBar
              animated={true}
              backgroundColor={globalColor.CARD}
              hidden={false}
            />
            <Header
              title={'Quick Appointment'}
              leftIcon={'keyboard-backspace'}
              pressLeftIcon={pressLeftIcon}
              leftImageIcon={null}
              pressleftImageIcon={null}
              rightIcon={null}
              pressRightIcon={null}
              rightTextIcon={'Edit'}
              pressRightTextIcon={pressRightTextIcon}
            />
            <ScrollView style={{flex: 1, backgroundColor: globalColor.WHITE}}>
              {appointmentInfos ? (
                <>
                  <FieldView
                    key={uuidv4()}
                    field={'CONTACT NAME'}
                    value={appointmentInfos.contact_name}
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'APPOINTMENT DATE'}
                    value={appointmentInfos.date}
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'APPOINTMENT TIME'}
                    value={appointmentInfos.time}
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'NOTE'}
                    value={appointmentInfos.note}
                    fontSize={3.5}
                    margin={3}
                  />
                </>
              ) : null}
              <View
                style={{alignItems: 'center', marginTop: HeightPercent(20)}}>
                <TouchableOpacity
                  style={{
                    // height: HeightPercent(7),
                    padding:HeightPercent(2),
                    width: WidthPercent(80),
                    borderRadius: 10,
                    marginTop: HeightPercent(3),
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: WidthPercent(0.5),
                    borderColor: globalColor.LIGHTGREY,
                  }}
                  onPress={() => {
                    Alert.alert('Confirm deletion?', '', [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'OK', onPress: () => deleteAppointment()},
                    ]);
                  }}>
                  <Text
                    style={{
                      fontSize: WidthPercent(4),
                      color: globalColor.BLACK,
                    }}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaView>
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  topLeftBox: {
    flex: 1,
    width: WidthPercent(50),
    borderWidth: 1,
    padding: WidthPercent(5),
    borderTopLeftRadius: WidthPercent(1),
    color: globalColor.CARD,
    fontSize: WidthPercent(4),
    fontWeight: 'bold',
  },
  topRightBox: {
    flex: 1,
    width: WidthPercent(50),
    borderWidth: 1,
    borderLeftWidth: 0,
    padding: WidthPercent(5),
    borderTopRightRadius: WidthPercent(1),
    color: globalColor.CARD,
    fontSize: WidthPercent(4),
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  deleteAppointmentStatus: state.appointment.deleteAppointment,
  editappointSuccessStatus: state.appointment.editappointSuccess,
});

export default connect(mapStateToProps, {
  cleareditAppointment,
  deleteAppointment,
})(QuickAppointmentDetails);
