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
import {connect} from 'react-redux';

import Header from '../Components/Header';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {
  searchAppointmentcontact,
  clearSearchedAppointment,
  createAppointment,
  clearCreateAppointment,
  editAppointment,
  cleareditAppointment,
} from '../Redux/Actions/appointmentAction';
import {getContactData} from '../Redux/Actions/contactAction';
import {userDetails} from '../Global/userDetails';
import TomLoader from '../Components/tomLoader';
import {TextInputSecond} from '../Utils/TomTextInputSecond';
import SearchBox from '../Utils/SearchBox';
import DatePicker from 'react-native-date-picker';

function QuickAppointmentCreateEdit(props) {
  const {
    searchedContacts,
    createappointSuccessStatus,
    editappointSuccessStatus,
    contactData,
    navigation,
  } = props;

  const [isLoading, setisLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [appointmentInfos, setAppointmentInfo] = useState('');
  const [editContactStatus, seteditContactStatus] = useState(false);
  const [newAppointmentInfo, setnewAppointmentInfo] = useState({
    id: null,
    contact_name: null,
    date: null,
    time: null,
    note: null,
  });
  const [dateOpen, setdateOpen] = useState(false);
  const [timeOpen, settimeOpen] = useState(false);
  const [searchedContactState, setsearchedContactState] = useState([]);

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
    if (props.type == 'Edit') {
      setAppointmentInfo(props.appointmentInfo);
      console.log('props.appointmentInfo', props.appointmentInfo);
      setnewAppointmentInfo({
        id: props.appointmentInfo.id,
        date: props.appointmentInfo.date,
        contact_name: props.appointmentInfo.contact_name,
        note: props.appointmentInfo.note,
        time: props.appointmentInfo.time,
      });
      setisLoading(false);
    } else {
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchedContacts) {
      console.log('searched', searchedContacts);
      setsearchedContactState(
        searchedContacts == 'No data found' ? [] : searchedContacts,
      );
    }
  }, [searchedContacts]);

  useEffect(() => {
    if (createappointSuccessStatus) {
      Alert.alert(createappointSuccessStatus);
      setisLoading(false);
      setnewAppointmentInfo({
        date: null,
        time: null,
        name: null,
        note: null,
      }),
        props.clearCreateAppointment();
    }
  }, [createappointSuccessStatus]);

  useEffect(() => {
    if (editappointSuccessStatus) {
      Alert.alert(editappointSuccessStatus);
      setisLoading(false);
      props.backPress();
      props.editAppointmentResponse(newAppointmentInfo);
    }
  }, [editappointSuccessStatus]);

  //Header prop....
  const pressLeftIcon = () => {
    props.backPress();
  };

  //Edit contact property...
  const backPress = () => {
    // seteditContactStatus(false);
  };

  //SearchBox property...
  const onChangeSearchText = text => {
    setSearchText(text);
    searchContact(text);
    if (text.length == 0) {
      //setcontactListState(duplicateContactArray);
    }
  };
  const clearSerachText = () => {
    setSearchText('');
    setsearchedContactState('');
    setSearchText('');
  };

  const changeText = (field, value) => {
    setnewAppointmentInfo({...newAppointmentInfo, [field]: value});
  };

  const searchContact = async text => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        props.searchAppointmentcontact({token, text});
        // setisLoading(true);
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const searchedContactUI = () => {
    return (
      <>
        {searchedContactState.map(item => {
          return (
            <View style={{flex: 1, padding: WidthPercent(3)}} key={item.id}>
              <TouchableOpacity
                onPress={() => {
                  setnewAppointmentInfo({
                    id: item.id,
                    contact_name: item.value,
                  });
                  setsearchedContactState('');
                  setSearchText('');
                  props.clearSearchedAppointment();
                }}>
                <Text
                  style={{color: globalColor.BLACK, fontSize: WidthPercent(3)}}>
                  {item.value}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </>
    );
  };

  const fieldValidation = async () => {
    var validationStatus = true;
    if(newAppointmentInfo.contact_name == null || newAppointmentInfo.date == null || newAppointmentInfo.time == null || newAppointmentInfo.note == null){
      validationStatus = false;
    }
    return validationStatus ;
    
  };

  const createAppointmentfunc = async () => {
    try {
      let status = await fieldValidation();
      if (status) {
        let userSavedData = userDetails();
        userSavedData.then(data => {
          let token = data.token;
          let user_id = data.user_id;
          const sendData = {
            users_id: user_id,
            contacts_id: newAppointmentInfo?.id,
            note: newAppointmentInfo?.note,
            date: newAppointmentInfo?.date,
            time: newAppointmentInfo?.time,
          };
          props.createAppointment({token, user_id, sendData});
          setTimeout(() => {
            props.backPress();
            setnewAppointmentInfo();
          }, 2500);
        });
      } else {
        Alert.alert('Please fill all fields.');
      }
    } catch (error) {
      console.log('create appointment error',error);
    }
  };

  const editAppointment = async () => {
    try {
      let status = await fieldValidation();
      if (status) {
        let userSavedData = userDetails();
        userSavedData.then(data => {
          let token = data.token;
          let user_id = data.user_id;
          const sendData = {
            users_id: user_id,
            contacts_id: newAppointmentInfo?.id,
            note: newAppointmentInfo?.note,
            date: newAppointmentInfo?.date,
            time: newAppointmentInfo?.time,
            appo_id: newAppointmentInfo?.id,
          };
          props.editAppointment({token, user_id, sendData});
          setisLoading(true);
        });
      } else {
        Alert.alert('Please fill all fields.');
      }
    } catch (error) {
      console.log('edit appointment error', error);
    }
  };

  return (
    <>
      {isLoading ? (
        <TomLoader />
      ) : (
        !isLoading && (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor:'#ddd',
              // alignItems: 'center',
            }}>
            <StatusBar
              animated={true}
              backgroundColor={globalColor.CARD}
              hidden={false}
            />
            <Header
              title={
                props.type == 'Edit' ? 'Edit Appointment' : 'Add Appointment'
              }
              leftIcon={'keyboard-backspace'}
              pressLeftIcon={pressLeftIcon}
              leftImageIcon={null}
              pressleftImageIcon={null}
              rightIcon={null}
              pressRightIcon={null}
              rightTextIcon={'\n \n '}
              // pressRightTextIcon={pressRightTextIcon}
            />
            {props.type != 'Edit' && (
              <SearchBox
                placeholder="Select contact"
                rightIcon={true}
                onChangeSearchText={onChangeSearchText}
                clearSerachText={clearSerachText}
                value={searchText}
              />
            )}

            <ScrollView
              style={{
                flex: 1,
                backgroundColor: globalColor.WHITE,
                paddingHorizontal: WidthPercent(2),
              }}>
              {searchedContactState?.length > 0 ? (
                searchedContactUI()
              ) : searchedContactState?.length == 0 ? (
                <>

                 {/* <View style={{backgroundColor:'green', marginVertical:10}}> */}
                
                  <TextInputSecond
                    name="name"
                    label="CONTACT NAME"
                    val={newAppointmentInfo?.contact_name}
                    _onChangeText={changeText}
                    // active={false}
                    active={true}

                  />

                  {/* </View> */}
              

                  <TouchableOpacity
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: globalColor.LIGHTGREY,
                      padding: HeightPercent(1),
                    }}
                    onPress={() => {
                      setdateOpen(true);
                    }}>
                    <Text style={{fontSize: WidthPercent(3)}}>
                      APPOINTMENT DATE
                    </Text>
                    
                    <Text
                      style={{
                        fontSize: WidthPercent(3),
                        color: globalColor.BLACK,
                        paddingVertical: HeightPercent(1),
                      }}>
                      {newAppointmentInfo?.date}
                    </Text>

                    <DatePicker
                      modal
                      open={dateOpen}
                      mode="date"
                      minimumDate={new Date()}
                      date={new Date()}
                      onConfirm={date => {
                        var selectedDate = `${date.getFullYear()}/${
                          date.getMonth() + 1
                        }/${date.getDate()}`;
                        changeText('date', selectedDate);
                        setdateOpen(false);
                      }}
                      onCancel={() => {
                        settimeOpen(false);
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: globalColor.LIGHTGREY,
                      padding: HeightPercent(1),
                    }}
                    onPress={() => {
                      settimeOpen(true);
                    }}>
                    <Text style={{fontSize: WidthPercent(3)}}>
                      APPOINTMENT TIME
                    </Text>
                    <Text
                      style={{
                        fontSize: WidthPercent(3),
                        color: globalColor.BLACK,
                        paddingVertical: HeightPercent(1),
                      }}>
                      {newAppointmentInfo?.time}
                    </Text>
                    <DatePicker
                      modal
                      open={timeOpen}
                      mode="time"
                      date={new Date()}
                      onConfirm={date => {
                        let time = `${date.getHours()}:${date.getMinutes()}`;

                        changeText('time', time);
                        settimeOpen(false);
                      }}
                      onCancel={() => {
                        settimeOpen(false);
                      }}
                    />
                  </TouchableOpacity>

                  <TextInputSecond
                    name="note"
                    label="ADD NOTE"
                    multiline={true}
                    numberOfLines={3}
                    val={newAppointmentInfo?.note}
                    _onChangeText={changeText}
                  />
                </>
              ) : null}
              {searchedContactState.length == 0 && (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: HeightPercent(2),
                  }}>
                  <TouchableOpacity
                    style={{
                      height: HeightPercent(6),
                      width: WidthPercent(80),
                      borderRadius: 10,
                      marginTop: HeightPercent(3),
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: globalColor.BTNCOLOR,
                    }}
                    onPress={() => {
                      props.type == 'Edit'
                        ? editAppointment()
                        : createAppointmentfunc();
                    }}>
                    <Text
                      style={{
                        fontSize: WidthPercent(4),
                        color: globalColor.WHITE,
                      }}>
                      {props.type == 'Edit'
                        ? 'Save Changes'
                        : 'Add Appointment'}
                    </Text>
                  </TouchableOpacity>
                  {props.type != 'Edit' && (
                    <TouchableOpacity
                      style={{
                        height: HeightPercent(6),
                        width: WidthPercent(80),
                        borderRadius: 10,
                        marginTop: HeightPercent(3),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: WidthPercent(0.5),
                        borderColor: globalColor.LIGHTGREY,
                      }}
                      onPress={() => {
                        Alert.alert('Confirm?', '', [
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                          {
                            text: 'OK',
                            onPress: () =>
                              props.type == 'Edit'
                                ? deleteAppointment()
                                : setnewAppointmentInfo({
                                    date: null,
                                    time: null,
                                    contact_name: null,
                                    note: null,
                                  }),
                          },
                        ]);
                      }}>
                      <Text
                        style={{
                          fontSize: WidthPercent(4),
                          color: globalColor.BLACK,
                        }}>
                        Reset
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
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
    color: globalColor.NEWTHEME,
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
    color: globalColor.NEWTHEME,
    fontSize: WidthPercent(4),
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => ({
  searchedContacts: state.appointment.searchedContacts,
  createappointSuccessStatus: state.appointment.createappointSuccess,
  editappointSuccessStatus: state.appointment.editappointSuccess,
  contactData: state.contact.contactData,
});

export default connect(mapStateToProps, {
  getContactData,
  searchAppointmentcontact,
  clearSearchedAppointment,
  createAppointment,
  clearCreateAppointment,
  editAppointment,
  cleareditAppointment,
})(QuickAppointmentCreateEdit);
