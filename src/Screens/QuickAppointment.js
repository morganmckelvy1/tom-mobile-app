import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Header from '../Components/Header';
import TomLoader from '../Components/tomLoader';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import SearchBox from '../Utils/SearchBox';
import {
  getAppointmentList,
  clearDeleteAppointment,
} from '../Redux/Actions/appointmentAction';
import {userDetails} from '../Global/userDetails';
import {searchItem} from '../Components/Search';
import QuickAppointmentCreateEdit from '../Components/QuickAppointmentCreateEdit';

var duplicateAppointmentArray = [];
const QuickAppointment = props => {
  const {fetchedappointmentList,
    deleteAppointmentStatus,
    editappointSuccessStatus,
    createappointSuccessStatus} = props;
  const [isLoading, setisLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [appointmentListState, setappointmentListState] = useState('');
  const [addAppointmentStatus, setaddAppointmentStatus] = useState(false);

  useEffect(() => {
    getAppointmentList();

    if (deleteAppointmentStatus) {
      props.clearDeleteAppointment();
    }
  }, [deleteAppointmentStatus,editappointSuccessStatus,createappointSuccessStatus]);

  useEffect(() => {
    if (fetchedappointmentList) {
      setappointmentListState(
        fetchedappointmentList.appointments_from_mobile.sort(compare),
      );
      duplicateAppointmentArray =
        fetchedappointmentList.appointments_from_mobile;
      setisLoading(false);
    }
  }, [fetchedappointmentList]);

  //For sorting appointment list by contact_name
  function compare(a, b) {
    if (a.contact_name.toUpperCase() < b.contact_name.toUpperCase()) {
      return -1;
    }
    if (a.contact_name.toUpperCase() > b.contact_name.toUpperCase()) {
      return 1;
    }
    return 0;
  }

  const getAppointmentList = async () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let user_id = data.user_id;
        props.getAppointmentList({token, user_id});
        setisLoading(true);
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  //Header property...
  const pressleftImageIcon = () => {
    props.navigation.toggleDrawer();
  };

  const pressRightTextIcon = () => {
    setaddAppointmentStatus(true);
  };

  //SearchBox property...
  const onChangeSearchText = text => {
    setSearchText(text);
    let searchedAppointment = searchItem(
      duplicateAppointmentArray,
      text,
      'Appointment',
    );
    setappointmentListState(searchedAppointment);
    if (text.length == 0) {
      setappointmentListState(duplicateAppointmentArray);
    }
  };
  const clearSerachText = () => {
    setSearchText('');
    setappointmentListState(duplicateAppointmentArray);
  };

  //Create appointment property...
  const backPress = () => {
    setaddAppointmentStatus(false);
  };
  const createAppointmentResponse = () => {
    setaddAppointmentStatus(false);
    // props.clearcreatecontactStatus();
    // getContactList();
  };

  var key = 'null';
  var storedKey = null;

  const renderappontmentList = ({item}) => {
    if (storedKey == null || storedKey != item.contact_name.slice(0, 1)) {
      key = item.contact_name.slice(0, 1).toUpperCase();
      storedKey = item.contact_name?.slice(0, 1);
    } else {
      key = null;
    }
    return (
      <View style={{flex: 1, alignSelf: 'center'}}>
        {key && <Text style={styles.titleText}>{key}</Text>}
        <View
          style={{
            width: WidthPercent(90),
            borderRadius: WidthPercent(1),
            backgroundColor: globalColor.WHITE,
            flexDirection: 'row',
          }}>
          <View>
            <Text style={styles.titleText}>
              {item.contact_name.charAt(0).toUpperCase() +
                item.contact_name.slice(1)}
            </Text>
            <Text style={styles.emailText}>{item.contact_email}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(
                'QuickappointmentDetails',
                {appointmentInfo: item},
                {...props},
              );
            }}
            style={{
              flex: 1,
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingHorizontal: WidthPercent(2),
            }}>
            <AntDesign name="right" size={20} color={globalColor.BLACK} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <>
      {addAppointmentStatus && !isLoading ? (
        <QuickAppointmentCreateEdit
          type={'Add'}
          title={'Create New Appointment'}
          backPress={backPress}
          // appointmentInfo={appointmentListState}
          createAppointmentResponse={createAppointmentResponse}
        />
      ) : isLoading ? (
        <TomLoader />
      ) : (
        <SafeAreaView
          style={{flex: 1, backgroundColor: globalColor.GREY}}>
          <Header
            title={'Quick Appointment'}
            leftIcon={null}
            pressLeftIcon={null}
            leftImageIcon={require('../Assests/Images/menu.png')}
            pressleftImageIcon={pressleftImageIcon}
            rightIcon={null}
            pressRightIcon={null}
            rightTextIcon="+ ADD"
            pressRightTextIcon={pressRightTextIcon}
          />
          <View style={{flex: 1}}>
            <View style={{marginVertical: HeightPercent(2)}}>
              <SearchBox
                placeholder="Search by name"
                rightIcon={true}
                onChangeSearchText={onChangeSearchText}
                clearSerachText={clearSerachText}
                value={searchText}
              />
            </View>
            {console.log('appointmentListState0', appointmentListState.length)}
            {appointmentListState?.length > 0 ? (
              <FlatList
                style={{marginBottom: HeightPercent(2)}}
                data={appointmentListState}
                renderItem={item => renderappontmentList(item)}
                keyExtractor={item => {
                  // item.id;
                  return item.id;
                }}
                // extraData={selectedId}
              />
            ) : (
              <View style={{alignItems: 'center'}}>
                <Text
                  style={{
                    fontSize: WidthPercent(5),
                    fontWeight: 'bold',
                    color: globalColor.BLACK,
                  }}>
                  Empty Appointment list
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={{
                position: 'absolute',
                zIndex: 1,
                left: WidthPercent(80),
                bottom: HeightPercent(5),}}
            onPress={() => {
              pressRightTextIcon();
            }}>
            <AntDesign
              name="pluscircle"
              size={WidthPercent(12)}
              style={{color:globalColor.CARD}}
            />
          </TouchableOpacity>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: WidthPercent(4),
    fontWeight: 'bold',
    color: globalColor.BLACK,
    textAlign: 'left',
    padding: HeightPercent(1),
  },
  emailText: {
    padding: HeightPercent(1),
    fontSize: WidthPercent(4),
    color: globalColor.BLACK,
  },
});
const mapStateToProps = state => ({
  fetchedappointmentList: state.appointment.appointmentList,
  deleteAppointmentStatus: state.appointment.deleteAppointment,
  editappointSuccessStatus: state.appointment.editappointSuccess,
  createappointSuccessStatus: state.appointment.createappointSuccess,
});

export default connect(mapStateToProps, {
  getAppointmentList,
  clearDeleteAppointment,
})(QuickAppointment);
