import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Alert,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connect} from 'react-redux';

import Header from '../Components/Header';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import SearchBox from '../Utils/SearchBox';
import {
  getContactData,
  cleardeleteStatus,
  clearcreatecontactStatus,
  clearcreateReminder,
} from '../Redux/Actions/contactAction';
import {userDetails} from '../Global/userDetails';
import ContactEdit from '../Components/ContactCreateEdit';
import {searchItem} from '../Components/Search';
import TomLoader from '../Components/tomLoader';


var duplicateContactArray = [];
const Contact = props => {
  const {contactData, error, deletedContact} = props;

  const [isLoading, setisLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [contactListState, setcontactListState] = useState('');
  const [addContactStatus, setaddContactStatus] = useState(false);
  const [generalInfoStatus, setgeneralInfoStatus] = useState(true);

  //Back Handle...
  useEffect(() => {
    const backAction = () => {
      if (addContactStatus) {
        setaddContactStatus(false);
      } else {
        props.navigation.goBack();
      }
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
    getContactList();

    if (deletedContact) {
      Alert.alert('Contact deleted successfully');
      props.cleardeleteStatus();
      getContactList();
    }
  }, [deletedContact]);
  useEffect(() => {
    if (contactData) {
      setcontactListState(contactData.contacts.sort(compare));
      duplicateContactArray = contactData.contacts;
      setisLoading(false);
    }
  }, [contactData]);

  useEffect(() => {
    if (error.id === 'FETCH_CONTACT') {
      Alert.alert(error.message);
    } else if (error.id === 'AUTH_FAIL') {
      Alert.alert(error.message);
    }
  }, [error]);

  //For sorting contact list by firstname
  function compare(a, b) {
    if (a.first_name.toUpperCase() < b.first_name.toUpperCase()) {
      return -1;
    }
    if (a.first_name.toUpperCase() > b.first_name.toUpperCase()) {
      return 1;
    }
    return 0;
  }

  const getContactList = async () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let userId = data.user_id;
        props.getContactData({token, userId});
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
    setaddContactStatus(true);
    setgeneralInfoStatus(true);
  };

  //SearchBox property...
  const onChangeSearchText = text => {
    setSearchText(text);
    let searchedContact = searchItem(duplicateContactArray, text, 'Contact');
    setcontactListState(searchedContact);
    if (text.length == 0) {
      setcontactListState(duplicateContactArray);
    }
  };
  const clearSerachText = () => {
    setSearchText('');
    setcontactListState(duplicateContactArray);
  };

  //Create contact property...
  const backPress = () => {
    setaddContactStatus(false);
  };
  const createContactResponse = () => {
    setaddContactStatus(false);
    props.clearcreatecontactStatus();
    getContactList();
  };

  var key = null;
  var storedKey = null;

  const contactList = ({item}) => {
    if (storedKey == null || storedKey != item.first_name.slice(0, 1)) {
      key = item.first_name.slice(0, 1).toUpperCase();
      storedKey = item.first_name.slice(0, 1);
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
              {item.first_name.charAt(0).toUpperCase() +
                item.first_name.slice(1) +
                ' '}
              {item.last_name
                ? item.last_name?.charAt(0).toUpperCase() +
                  item.last_name?.slice(1)
                : ''}
            </Text>
            <Text style={styles.emailText}>{item.email}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate(
                'ContactDetails',
                {contactInfo: item},
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
      {addContactStatus && !isLoading ? (
        <ContactEdit
          type={'Add'}
          title={'Create New Contacts'}
          backPress={backPress}
          createContactResponse={createContactResponse}
          generalInfoStatus={generalInfoStatus}
        />
      ) : isLoading ? (
        <TomLoader />
      ) : (
        <SafeAreaView
          style={{flex: 1, backgroundColor:'#ccc'}}>
          <StatusBar
            animated={true}
            backgroundColor={globalColor.CARD}
            hidden={false}
          />
          <Header
            title={'Contacts'}
            leftIcon={null}
            pressLeftIcon={null}
            leftImageIcon={require('../Assests/Images/menu.png')}
            pressleftImageIcon={pressleftImageIcon}
            rightIcon={null}
            pressRightIcon={null}
            rightTextIcon="+ ADD"
            pressRightTextIcon={pressRightTextIcon}
          />
          <View style={{flex: 1,}}>
            <View style={{marginVertical: HeightPercent(2)}}>
              <SearchBox
                placeholder="search by name"
                rightIcon={true}
                onChangeSearchText={onChangeSearchText}
                clearSerachText={clearSerachText}
                value={searchText}
              />
            </View>
            {contactListState?.length > 0 ? (
              <FlatList
                style={{marginBottom: HeightPercent(2)}}
                data={contactListState}
                renderItem={item => contactList(item)}
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
                  Empty contact list
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              zIndex: 1,             
              left: WidthPercent(80),
              bottom: HeightPercent(5),
              // backgroundColor:globalColor.GOLD
            
            }}
            onPress={() => { pressRightTextIcon();}}>
            <AntDesign  name="pluscircle" size={WidthPercent(12)} style={{ color: globalColor.CARD,}}/>
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
  contactData: state.contact.contactData,
  // createdContact: state.contact.createContact,
  error: state.error,
  deletedContact: state.contact.deletedContact,
});

export default connect(mapStateToProps, {
  getContactData,
  cleardeleteStatus,
  clearcreatecontactStatus,
  clearcreateReminder,
})(Contact);
