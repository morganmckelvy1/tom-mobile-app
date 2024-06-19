import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  BackHandler,
  TextInput,
  Platform,
  SafeAreaView,Switch
} from 'react-native';
import {connect} from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';

import {WidthPercent, HeightPercent} from '../Global/device';
import {TextInputSecond} from '../Utils/TomTextInputSecond';
import Header from './Header';
import * as globalColor from '../Global/color';
import DatePicker from 'react-native-date-picker';
import {
  getContactCampaign,
  createContact,
  viewContact,
  clearContactDetails,
  createReminder,
} from '../Redux/Actions/contactAction';
import {userDetails} from '../Global/userDetails';
import TomLoader from './tomLoader';
import moment from 'moment';

// const typeList = ['Choose Type', 'Customer', 'Prospect'];

const typeList = [
  // { label: 'Choose Type', value: '1' },
  { label: 'Customer', value: '1' },
  { label: 'Prospect', value: '2' },
 ];


const statusList = [
  { label: 'Active', value: '1' },
  { label: 'Inactive', value: '2' },
];


const timeZoneList = [
  'Choose delay time',
  '15 min',
  '30 min',
  '45 min',
  '60 min',
];


const date = new Date();

const ContactEdit = props => {
  const {
    campaignType,
    createdContact,
    contactfullDetails,
    createReminderStatus,
    generalI,
    error,
  } = props;
  const pickerRef = useRef();
  const [open, setOpen] = useState(false);
  const [openReminderDate, setopenReminderDate] = useState(false);
  const [openReminderTime, setopenReminderTime] = useState(false);

  const [isLoading, setisLoading] = useState(true);
  const [register_open, setregister_open] = useState(false);

  const [typeVisible, settypeVisible] = useState(false);
  const [userAllDetails, setuserAllDetails] = useState({
    date_registered:
      date.getFullYear() +
      '/' +
      parseInt(date.getMonth() + 1) +
      '/' +
      date.getDate(),
    firstName: null,
    lastName: null,
    email: null,
    mobileNumber: null,
    alternatePhone: null,
    referedBy: null,
    address: null,
    address1: null,
    country: null,
    state: null,
    city: null,
    pin: null,
    birthDate: null,
    customerType: null,
    status: null,
  });
  const [campaignTypeList, setcampaignTypeList] = useState([]);
  const [selectedCampaign, setselectedCampaign] = useState([]);
  const [generalInfoStatus, setgeneralInfoStatus] = useState(true);
  const [reminderInfo, setreminderInfo] = useState({
    date: '',
    time: '',
    //delay: '',
    note: '',
    reminderStatus: 0,
  });
  const [tagDetails, settagDetails] = useState({
    name: false,
    email: false,
    phone: false,
  });
  const [showas, setShowas] = useState(false);
  const [camsel, setCamsel] = useState([]);
  const [isEnabled, setIsEnabled] = useState({contact: false, user: false});

  //Back handler.....
  useEffect(() => {
    const backAction = () => {
      backPress();
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
    if (error.id === 'CREATE_CONTACT') {
      Alert.alert(error.message);
    }
  }, [error]);

  useEffect(() => {
    getContactcampaignType();
    if (props.type == 'Edit') {
      setuserAllDetails({
        date_registered: moment
          .unix(props.contactfullInfo.contact_data?.date_registered)
          .format('MM/DD/YYYY'),
        firstName: props.contactfullInfo.contact_data?.first_name,
        lastName: props.contactfullInfo.contact_data?.last_name,
        email: props.contactfullInfo.contact_data?.email,
        mobileNumber: props.contactfullInfo.contact_data?.mobile_phone,
        alternatePhone: props.contactfullInfo.contact_data?.alt_phone,
        referedBy: props.contactfullInfo.contact_data?.reffered_by,
        address: props.contactfullInfo.contact_data?.address,
        address1: props.contactfullInfo.contact_data?.address1,
        country: props.contactfullInfo.contact_data?.country,
        state: props.contactfullInfo.contact_data?.state,
        city: props.contactfullInfo.contact_data?.city,
        pin: props.contactfullInfo.contact_data?.postal_code,
        birthDate: props.contactfullInfo.contact_data?.date_of_birth,
        customerType: props.contactfullInfo.contact_data?.type,
        status: props.contactfullInfo.contact_data?.is_active,
      });
      setselectedCampaign(props.contactfullInfo.campaings);
      setisLoading(false);
    }
  }, []);

  useEffect(() => {
    campaignList = [];
    if (campaignType) {
      setcampaignTypeList([]);
      if (campaignType.dated_campaigns.length > 0) {
        let type = campaignType.dated_campaigns_type;
        campaignType.dated_campaigns.map((item,index) => {
          let campaignObj = item;
          campaignObj.value = item.id;
          campaignObj.label = item.name;
          campaignObj.type = type;

          setcampaignTypeList(pre => [...pre, campaignObj]);
          if(index==0){//For default selection of campaign
            setselectedCampaign([item.id]);
          }
        });
      }

      if (campaignType.holiday_campaigns.length > 0) {
        let type = campaignType.holiday_campaigns_type;
        campaignType.holiday_campaigns.map(item => {
          let campaignObj = item;

          campaignObj.value = item.id;
          campaignObj.label = item.name;
          campaignObj.type = type;
          setcampaignTypeList(pre => [...pre, campaignObj]);
        });
      }
      if (campaignType.monthly_campaigns.length > 0) {
        let type = campaignType.monthly_campaigns_type;
        campaignType.monthly_campaigns.map(item => {
          let campaignObj = item;
          campaignObj.value = item.id;
          campaignObj.label = item.name;
          campaignObj.type = type;
          setcampaignTypeList(pre => [...pre, campaignObj]);
        });
      }
      if (campaignType.sub_users.length == 0) {
        //Do nothing for this section
      }
      if (campaignType.universal_campaigns.length > 0) {
        let type = campaignType.universal_campaigns_type;
        campaignType.universal_campaigns.map(item => {
          let campaignObj = item;
          campaignObj.value = item.id;
          campaignObj.label = item.name;
          campaignObj.type = type;
          setcampaignTypeList(pre => [...pre, campaignObj]);
        });
      }
      if (props.type != 'Edit') {
        setisLoading(false);
      }
    }
  }, [campaignType]);

  useEffect(() => {
    if (createdContact) {
      {
        props.type == 'Edit'
          ? Alert.alert('Contact Updated.')
          : Alert.alert('New contact added.');
      }
      props.createContactResponse();
    }
  }, [createdContact]);

  useEffect(() => {
    if (createReminderStatus) {
      alert('Contact reminder sent.');
      props.createReminderResponse();
    }
  }, [createReminderStatus]);

  useEffect(()=>{
    if(isEnabled.contact && isEnabled.user){
      setreminderInfo({...reminderInfo,reminderStatus:3});
    }else if(isEnabled.contact){
      setreminderInfo({...reminderInfo,reminderStatus:1});
    }else if(isEnabled.user){
      setreminderInfo({...reminderInfo,reminderStatus:2});
    }else if(!isEnabled.contact && !isEnabled.user){
      setreminderInfo({...reminderInfo,reminderStatus:0});
    }
  },[isEnabled]);
  const backPress = () => {
    props.backPress();
    setcampaignTypeList('');
    setselectedCampaign('');
    props.clearContactDetails();
  };

  const getContactcampaignType = async () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let userId = data.user_id;
        props.getContactCampaign({token, userId});
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const Validation = async () => {
    let validationStatus = true;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if( userAllDetails.email){
      if (reg.test(userAllDetails.email) === false) {
        validationStatus = false;
      }
    }
    if (
      selectedCampaign.length == 0 ||
      userAllDetails.email == null ||
      userAllDetails.firstName == null || 
      userAllDetails.lastName == null
    ) {
      validationStatus = false;
    }
    return validationStatus;
  };

  const pressRightTextIcon = async () => {
    try {
      let status = await Validation();
      if (status) {
        let userSavedData = userDetails();
        userSavedData.then(data => {
          let token = data.token;
          let userId = data.user_id;
          let campaignTypee = '';
          campaignTypeList.map((item, index) => {
            selectedCampaign.map((id, index) => {
              if (item.id == id) {
                campaignTypee = campaignTypee + item.type + ',';
              }
            });
          });
          const sendData = {
            users_id: userId,
            assigned_campaign_type: campaignTypee,
            date_registered: userAllDetails.date_registered,
            first_name: userAllDetails.firstName,
            last_name: userAllDetails.lastName,
            email: userAllDetails.email,
            mobile_phone: userAllDetails.mobileNumber,
            alt_phone: userAllDetails.alternatePhone,
            reffered_by: userAllDetails.referedBy,
            address: userAllDetails.address,
            address1: userAllDetails.address1,
            country: userAllDetails.country,
            city: userAllDetails.city,
            state: userAllDetails.state,
            postal_code: userAllDetails.pin,
            date_of_birth: userAllDetails.birthDate,
            type: userAllDetails.customerType,
            is_active: userAllDetails.status == 'Active' || '1' ? 1 : 0,
            assigned_campaign_id: selectedCampaign,
          };
          if (props.type == 'Edit') {
            let contactId = props.contactfullInfo.contact_data?.id;
            sendData.contact_id = contactId;
          }

          props.createContact({token, sendData});
          // props.backPress();
        });
      } else {
        let validEmail = true;
        if(userAllDetails.email){
          let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (reg.test(userAllDetails.email) === false) {
            validEmail = false;
          }
        }
        if(userAllDetails.email==null){
          Alert.alert('Please enter email.');
        }else if(!validEmail){
          Alert.alert('Please enter a valid email.');
        }
        else if(userAllDetails.firstName==null){
          Alert.alert('Please enter first name.');
        }
        else if(userAllDetails.lastName==null){
          Alert.alert('Please enter last name.');
        }
        else if(selectedCampaign.length == 0 ){
          Alert.alert('Please select campaign.');
        }
      }
    } catch (error) {
      console.error('error', error);
    }
  };

  const onSelectedItemsChange = item => {
    setselectedCampaign(item);
  };

  const changeText = (field, value) => {
    setuserAllDetails({...userAllDetails, [field]: value});
  };

  const changeReminderText = (field, value) => {
    setreminderInfo({...reminderInfo, [field]: value});
  };

  const reminderValidation = async () => {
    var remindervalidationStatus = true;
    if(reminderInfo.date == (null || '') || reminderInfo.time == (null || '') || reminderInfo.note == (null || '')){
      remindervalidationStatus = false;
    }
    return remindervalidationStatus;
  };

  const sendReminder = async () => {
    try {
      let validationStatus = await reminderValidation();
      if (validationStatus) {
        let userSavedData = userDetails();
        userSavedData.then(data => {
          let token = data.token;
          let userId = data.user_id;
          const sendData = {
            date: reminderInfo.date,
            time: reminderInfo.time,
            note: reminderInfo.note,
            //delay_time: reminderInfo.delayTime,
            reminder_status:reminderInfo.reminderStatus
          };
          let contactId = props.contactfullInfo.contact_data?.id;
          props.createReminder({token, contactId, sendData});
          setisLoading(true);
        }).catch(e=>console.log("sendReminder error ",e));
      } else {
          Alert.alert('Please fill all fields.');
      }
    } catch (error) {console.log(error);}
  };

  const markTags = item => {
    var arr = [];
    var flag = 0;
    for (var i = 0; i < selectedCampaign.length; i++) {
      if (selectedCampaign[i] != item.id) {
        arr.push(selectedCampaign[i]);
      } else {
        flag = 1;
      }
    }
    if (flag == 0) {
      arr.push(item.id);
    }
    setselectedCampaign([]);
    setselectedCampaign(arr);
    // selectedCampaign.push(item.id);
  };

  const generalInfoUI = () => {
    return (
      <ScrollView
        style={{
          //flex: 1,
          marginHorizontal: HeightPercent(2),
        }}>
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            zIndex: 1,
            margin: 10,
          }}>
          <TouchableOpacity
            onPress={() => {
              // settypeVisible(!typeVisible);
              setShowas(!showas);
            }}
            style={{flexDirection:'row',justifyContent:'space-between', alignItems:'center',paddingVertical:HeightPercent(2) }}
            >
            <Text style={{fontSize: WidthPercent(3)}}>
              ASSIGNED CAMPAIGN
            </Text>
            <Image source={require('../Assests/Images/downArrow.png')} style={{width:WidthPercent(3),height:WidthPercent(3)}}/>
          </TouchableOpacity>
          {showas
            ? campaignTypeList.map((item, index) => {
                return (
                  <TouchableOpacity style={{ paddingVertical:HeightPercent(0.7),}} key={index} onPress={() => markTags(item)} >
                    {selectedCampaign.includes(item.id) ? (

                      <View style={{width:WidthPercent(89),justifyContent:'space-between',flexDirection:'row', alignItems:'center'}}>

                         <Text
                          style={{marginBottom: 5, color: globalColor.PRIMARY}}
                          key={index}>
                          {item.name}
                         </Text>

                         <Image source={require('../Assests/Images/tick.png')} resizeMode={'contain'} style={{width:WidthPercent(3.5),height:WidthPercent(3.5), tintColor:globalColor.PRIMARY}}/>

                      </View>
                      

                    ) : (
                      <Text style={{marginBottom: 5}} key={index}>
                        {item.name}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })
            : null}
        </View>

        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            padding: HeightPercent(1),
          }}
          onPress={() => {
            setregister_open(true);
          }}>
          <Text style={{fontSize: WidthPercent(3)}}>DATE REGISTERED</Text>
          <Text
            style={{
              fontSize: WidthPercent(3),
              color: globalColor.BLACK,
              paddingVertical: HeightPercent(1),
            }}>
            {userAllDetails?.date_registered}
          </Text>

          <DatePicker
            modal
            open={register_open}
            mode="date"
            date={new Date()}
            maximumDate={new Date()}
            onConfirm={date => {
              var selectedDate = `${date.getFullYear()}/${
                date.getMonth() + 1
              }/${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`;
              changeText('date_registered', selectedDate);
              setOpen(false);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </TouchableOpacity>
        <TextInputSecond
          name="firstName"
          label="FIRST NAME"
          val={userAllDetails.firstName}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="lastName"
          label="LAST NAME"
          val={userAllDetails.lastName}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="email"
          label="EMAIL"
          val={userAllDetails.email}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="mobileNumber"
          label="MOBILE NUMBER"
          countrycode={true}
          val={userAllDetails.mobileNumber}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="alternatePhone"
          label="ALTERNATE PHONE"
          countrycode={true}
          val={userAllDetails.alternatePhone}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="referedBy"
          label="REFERRED BY"
          val={userAllDetails.referedBy}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="address"
          label="ADDRESS"
          val={userAllDetails.address}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="address1"
          label="ADDRESS 1"
          val={userAllDetails.address1}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="country"
          label="COUNTRY"
          val={userAllDetails.country}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="city"
          label="CITY"
          val={userAllDetails.city}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="state"
          label="STATE"
          val={userAllDetails.state}
          _onChangeText={changeText}
        />
        <TextInputSecond
          name="pin"
          label="POSTAL CODE"
          val={userAllDetails.pin}
          _onChangeText={changeText}
        />
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            padding: HeightPercent(1),
          }}
          onPress={() => {
            setOpen(true);
          }}>
          <Text style={{fontSize: WidthPercent(3)}}>DATE OF BIRTH</Text>
          <Text
            style={{
              fontSize: WidthPercent(3),
              color: globalColor.BLACK,
              paddingVertical: HeightPercent(1),
            }}>
            {userAllDetails?.birthDate}
          </Text>

          <DatePicker
            modal
            open={open}
            mode="date"
            date={new Date()}
            maximumDate={new Date()}
            onConfirm={date => {
              setOpen(false);
              var selectedDate = `${date.getFullYear()}/${
                date.getMonth() + 1
              }/${date.getDate()}`;
              changeText('birthDate', selectedDate);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </TouchableOpacity>



        {/* <TouchableOpacity style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            zIndex: 1,
            backgroundColor:'transparent'
          }}
          onPress={() => {
            // settypeVisible(!typeVisible);
          }}>

          <Text style={{
              fontSize: WidthPercent(3),
              marginTop: Platform.OS === 'ios' ? WidthPercent(2) : null,
              marginLeft: Platform.OS === 'ios' ? WidthPercent(2) : null,
            }}>
            TYPE
          </Text>

          <Picker
            // selectedValue={userAllDetails.customerType}
            onValueChange={(itemValue, itemIndex) => {changeText('customerType', itemValue);}}
            style={{width: WidthPercent(93), backgroundColor:'transparent'}}
            mode="dropdown">
            {typeList.map((item, index) => {
              return (
                <Picker.Item
                  key={item.toString()}
                  enabled={index == 0 ? false : true}
                  value={item}
                  label={item}
                />
              );
            })}
          </Picker>


        </TouchableOpacity> */}

        <Text style={{
            fontSize: WidthPercent(3),
            marginTop: Platform.OS === 'ios' ? WidthPercent(2) : WidthPercent(2),
            marginLeft: Platform.OS === 'ios' ? WidthPercent(2) : null,
          }}>
          TYPE
        </Text>

        {/* {console.log('selectedValue---------', userAllDetails.customerType)} */}

        <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        containerStyle={{backgroundColor:globalColor.WHITE}}
        activeColor={{backgroundColor:'red'}}
        itemTextStyle={{ color:globalColor.BLACK, fontSize:WidthPercent(3)}}
        data={typeList}
        labelField="label"
        valueField="value"
        placeholder={"Choose Type"}
        selectedValue={userAllDetails.customerType}
        onChange={item => {
          {changeText('customerType', item);}
        }}
        />

        <Text style={{
          fontSize: WidthPercent(3),
          marginTop: Platform.OS === 'ios' ? WidthPercent(2) : WidthPercent(2),
          marginLeft: Platform.OS === 'ios' ? WidthPercent(2) : null,
          }}>
           STATUS
         </Text>

        {/* {console.log('selectedValue---------', userAllDetails.customerType)} */}

        <Dropdown
        style={[styles.dropdown]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        iconStyle={styles.iconStyle}
        containerStyle={{backgroundColor:globalColor.WHITE}}
        activeColor={{backgroundColor:'red'}}
        itemTextStyle={{ color:globalColor.BLACK,fontSize:WidthPercent(3)}}
        data={statusList}
        labelField="label"
        valueField="value"
        placeholder={"Choose Option"}
        selectedValue={userAllDetails.status}
        onChange={item => {
          {changeText('status', item);}
        }}
        />


        {/* <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            zIndex: 1,
          }}
          onPress={() => {
            settypeVisible(!typeVisible);
          }}>
          <Text
            style={{
              fontSize: WidthPercent(3),
              marginTop: Platform.OS === 'ios' ? WidthPercent(2) : null,
              marginLeft: Platform.OS === 'ios' ? WidthPercent(2) : null,
            }}>
            STATUS
          </Text>

          <Picker
            selectedValue={userAllDetails.status}
            onValueChange={(itemValue, itemIndex) => {
              changeText('status', itemValue);
            }}
            style={{width: WidthPercent(50)}}
            mode="dropdown">
            {statusList.map((item, index) => {
              return (
                <Picker.Item
                  key={item.toString()}
                  enabled={index == 0 ? false : true}
                  value={item}
                  label={item}
                />
              );
            })}
          </Picker>
        </TouchableOpacity> */}

        <View style={{height:HeightPercent(10)}}/>

      </ScrollView>
    );
  };

  const toggleSwitch =(field)=>{
    if(field == 'contact'){
        setIsEnabled({...isEnabled, contact:!isEnabled.contact});
    }else if(field == 'user'){
      setIsEnabled({...isEnabled,user:!isEnabled.user});
    }
  }

  const quickReminderUI = () => {
    return (
      <ScrollView style={{flex: 1}}>
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            padding: HeightPercent(1),
            marginHorizontal:5
          }}
          onPress={() => {
            setopenReminderDate(true);
          }}>
          <Text style={{fontSize: WidthPercent(3)}}>DATE</Text>
          <Text
            style={{
              fontSize: WidthPercent(3),
              color: globalColor.BLACK,
              paddingVertical: HeightPercent(1),
            }}>
            {reminderInfo.date}
          </Text>

          <DatePicker
            modal
            open={openReminderDate}
            mode="date"
            minimumDate={new Date()}
            date={new Date()}
            onConfirm={date => {
              setopenReminderDate(false);
              let selectedDate = `${date.getFullYear()}-${
                date.getMonth() > 8
                  ? date.getMonth() + 1
                  : '0' + (date.getMonth() + 1)
              }-${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}`;
              changeReminderText('date', selectedDate);
            }}
            onCancel={() => {
              setopenReminderDate(false);
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            padding: HeightPercent(1),
            marginHorizontal:5
          }}
          onPress={() => {
            setopenReminderTime(true);
          }}>
          <Text style={{fontSize: WidthPercent(3)}}>TIME</Text>
          <Text
            style={{
              fontSize: WidthPercent(3),
              color: globalColor.BLACK,
              paddingVertical: HeightPercent(1),
            }}>
            {reminderInfo.time}
          </Text>

          <DatePicker
            modal
            open={openReminderTime}
            mode="time"
            date={new Date()}
            // minimumDate={new Date()}
            onConfirm={date => {
              setopenReminderTime(false);
              let time = `${date.getHours()}:${date.getMinutes()}`;
              changeReminderText('time', time);
            }}
            onCancel={() => {
              setopenReminderTime(false);
            }}
          />
        </TouchableOpacity>
        <View style={{flexDirection:'row',padding: HeightPercent(1),marginHorizontal:5,justifyContent:'flex-start',alignItems:'center'}}>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Text>Contact: </Text>
            <Switch
            trackColor={{ false: globalColor.LIGHTGREY, true: globalColor.CARD }}
            thumbColor={isEnabled.contact ? globalColor.PRIMARY : globalColor.BLACK}
            ios_backgroundColor={globalColor.LIGHTGREY}
            onValueChange={()=>{toggleSwitch('contact')}}
            value={isEnabled.contact}
            />
          </View>
          <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
            <Text> User: </Text>
            <Switch
            trackColor={{ false: globalColor.LIGHTGREY, true: globalColor.CARD }}
            thumbColor={isEnabled.user ? globalColor.PRIMARY : globalColor.BLACK}
            ios_backgroundColor={globalColor.LIGHTGREY}
            onValueChange={()=>{toggleSwitch('user')}}
            value={isEnabled.user}
            />
          </View>
          {/* <Text style={{flex:1,paddingLeft:WidthPercent(3),color:globalColor.BLACK}}>**Select at least one to whom you want to send a reminder </Text> */}
        </View>
        {/* <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            // padding: HeightPercent(1),
            zIndex: 1,
          }}
          onPress={() => {
            // settimezoneVisible(!timezoneVisible);
            pickerRef.current.focus();
          }}>
          <Text style={{fontSize: WidthPercent(3)}}>DELAY TIME</Text>

          <Picker
            ref={pickerRef}
            selectedValue={reminderInfo.delayTime}
            onValueChange={(itemValue, itemIndex) => {
              changeReminderText('delayTime', itemValue);
            }}>
            {timeZoneList.map((item, index) => {
              return (
                <Picker.Item
                  key={item.toString()}
                  enabled={index == 0 ? false : true}
                  value={item}
                  label={item}
                />
              );
            })}
          </Picker>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={{
            borderBottomWidth: 1,
            borderBottomColor: globalColor.LIGHTGREY,
            padding: HeightPercent(1),
            marginHorizontal:5
          }}>
          <Text style={{fontSize: WidthPercent(3)}}>ADD NOTE</Text>
          <TextInput
            placeholder="Note"
            multiline
            numberOfLines={5}
            style={Platform.OS=='ios'?{paddingVertical:5}:null}
            value={reminderInfo.note}
            onChangeText={text => {
              changeReminderText('note', text);
            }}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            marginVertical: HeightPercent(5),
          }}>
          <TouchableOpacity
            style={{
              height: HeightPercent(5),
              width: WidthPercent(20),
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              margin: WidthPercent(2),
              borderWidth: WidthPercent(0.5),
              borderColor: globalColor.LIGHTGREY,
              backgroundColor: globalColor.BTNCOLOR,
            }}
            onPress={() => {
              settagDetails({...tagDetails, name: !tagDetails.name});
              let lastName = props.contactfullInfo.contact_data?.last_name ? props.contactfullInfo.contact_data?.last_name : '';
              let name =
                reminderInfo.note +
                ' ' +
                props.contactfullInfo.contact_data?.first_name +
                ' ' +
                lastName;
              changeReminderText('note', name);
            }}>
            <Text
              style={{
                color: globalColor.WHITE,
              }}>
              Name
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: HeightPercent(5),
              width: WidthPercent(20),
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              margin: WidthPercent(2),
              borderWidth: WidthPercent(0.5),
              borderColor: globalColor.LIGHTGREY,
              backgroundColor: globalColor.BTNCOLOR,
            }}
            onPress={() => {
              settagDetails({...tagDetails, email: !tagDetails.email});
              let email =
                reminderInfo.note +
                ' ' +
                props.contactfullInfo.contact_data?.email;
              changeReminderText('note', email);
            }}>
            <Text
              style={{
                color: globalColor.WHITE,
              }}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: HeightPercent(5),
              width: WidthPercent(20),
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              margin: WidthPercent(2),
              borderWidth: WidthPercent(0.5),
              borderColor: globalColor.LIGHTGREY,
              backgroundColor: globalColor.BTNCOLOR,
            }}
            onPress={() => {
              settagDetails({...tagDetails, phone: !tagDetails.phone});
              let mobile_phone = props.contactfullInfo.contact_data?.mobile_phone ? props.contactfullInfo.contact_data?.mobile_phone : '';
              let phone =
                reminderInfo.note +
                ' ' +
                mobile_phone;
              changeReminderText('note', phone);
            }}>
            <Text
              style={{
                color: globalColor.WHITE,
              }}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            height:Platform.OS=='android'? HeightPercent(8): HeightPercent(7),
            width: WidthPercent(90),
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            margin: WidthPercent(2),
            borderWidth: WidthPercent(0.5),
            borderColor: globalColor.LIGHTGREY,
            backgroundColor: globalColor.BTNCOLOR,
          }}
          onPress={() => {
            sendReminder();
          }}>
          <Text style={{color: globalColor.WHITE, fontSize: WidthPercent(5)}}>
            Send Reminder
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView  style={{flex:1}}>
      {isLoading ? (
        <TomLoader />
      ) : (
        <View style={{flex: 1, backgroundColor: globalColor.WHITE}}>
          <Header
            title={props.title}
            leftIcon={'keyboard-backspace'}
            pressLeftIcon={backPress}
            leftImageIcon={null}
            pressleftImageIcon={null}
            rightIcon={null}
            pressRightIcon={null}
            rightTextIcon={generalInfoStatus ? 'SAVE' : null}
            pressRightTextIcon={pressRightTextIcon}
          />
          {props.type == 'Edit' && (
            <View
              style={{
                width: WidthPercent(100),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                marginVertical: HeightPercent(2),
              }}>
              <TouchableOpacity
                style={{
                  height: HeightPercent(6),
                  width: WidthPercent(45),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: WidthPercent(0.5),
                  borderColor: globalColor.LIGHTGREY,
                  backgroundColor: generalInfoStatus
                    ? globalColor.BTNCOLOR
                    : globalColor.WHITE,
                }}
                onPress={() => {
                  setgeneralInfoStatus(true);
                }}>
                <Text
                  style={{
                    fontSize: WidthPercent(4),
                    color: generalInfoStatus
                      ? globalColor.BLACK
                      : globalColor.BLACK,
                  }}>
                  General Info
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: HeightPercent(6),
                  width: WidthPercent(45),
                  borderRadius: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: WidthPercent(0.5),
                  backgroundColor: !generalInfoStatus
                    ? globalColor.BTNCOLOR
                    : globalColor.WHITE,
                  borderColor: globalColor.LIGHTGREY,
                }}
                onPress={() => {
                  setgeneralInfoStatus(false);
                }}>

                <Text
                  style={{
                    fontSize: WidthPercent(4),
                    color: !generalInfoStatus
                      ? globalColor.WHITE
                      : globalColor.BLACK,
                  }}>
                  Quick Reminder
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {generalInfoStatus
            ? generalInfoUI()
            : generalI
            ? quickReminderUI()
            : quickReminderUI()}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width:WidthPercent(90),
    height: HeightPercent(7.2),
    borderBottomColor: globalColor.LIGHTGREY,
    borderBottomWidth: WidthPercent(0.1 ),
    paddingHorizontal:WidthPercent(2),
    alignSelf:'center',
    backgroundColor:globalColor.WHITE,
    // fontFamily:fonts.InterRegular,
    color:globalColor.BLACK
  },
  
  icon: {
    marginRight: WidthPercent(5),
  },
      
  placeholderStyle: {
    fontSize:WidthPercent(2.9),
    color:globalColor.LIGHTGREY,
  },
  
  selectedTextStyle: {
    fontSize:WidthPercent(3),
    color:globalColor.BLACK
  },

  iconStyle: {
    width: WidthPercent(7),
    height: WidthPercent(7),
    marginRight:WidthPercent(-2),
    tintColor:globalColor.LIGHTGREY
  },
});


const mapStateToProps = state => ({
  campaignType: state.contact.campaignType,
  createdContact: state.contact.createContact,
  contactfullDetails: state.contact.contactDetails,
  createReminderStatus: state.contact.createReminder,
  error: state.error,
});
export default connect(mapStateToProps, {
  getContactCampaign,
  createContact,
  viewContact,
  clearContactDetails,
  createReminder,
})(ContactEdit);
