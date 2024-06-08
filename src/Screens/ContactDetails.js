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
  Platform,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import {v4 as uuidv4} from 'uuid';
import {connect} from 'react-redux';
import {NativeModules} from 'react-native';
const RNFetchBlob = NativeModules.RNFetchBlob
import DatePicker from 'react-native-date-picker';

import ContactEdit from '../Components/ContactCreateEdit';
import FieldView from '../Components/FieldView';
import Header from '../Components/Header';
import * as globalColor from '../Global/color';
import {HeightPercent, WidthPercent} from '../Global/device';
import {
  deleteContact,
  viewContact,
  clearcreatecontactStatus,
  feedBack,
  clearfeedBack,
  viewcampaignList,
  clearcreateReminder,
  downloadCampaignList,
  cleardownloadCampaignList,
} from '../Redux/Actions/contactAction';
import {userDetails} from '../Global/userDetails';
import TomLoader from '../Components/tomLoader';
import moment from 'moment';

function ContactDetails(props) {
  const {
    deletedContact = false,
    contactfullInfo,
    feedBackRes,
    fetchedcampaignList,
    campaigndownloadlink,
  } = props;
  const date = new Date();

  const [isLoading, setisLoading] = useState(true);
  const [contactInfos, setContactInfo] = useState('');
  const [editContactStatus, seteditContactStatus] = useState(false);
  const [campaignModal, setcampaignModal] = useState(false);
  const [campaignList, setcampaignList] = useState([]);
  const [generalInfoStatus, setgeneralInfoStatus] = useState(true);
  const [open, setOpen] = useState(false);
  const [openReminderDate, setopenReminderDate] = useState(false);
  const [openReminderTime, setopenReminderTime] = useState(false);
  const [reminderInfo, setreminderInfo] = useState({
    date: '',
    time: '',
    //delay: '',
    note: '',
  });
  const [tagDetails, settagDetails] = useState({
    name: false,
    email: false,
    phone: false,
  });

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
    // console.log('props', props.route.params.contactInfo);
    // let currentTimestamp = new Date(1648771200);
    // let date = new Intl.DateTimeFormat('indian', {
    //   year: 'numeric',
    //   month: '2-digit',
    //   day: '2-digit',
    // }).format(currentTimestamp);
    // console.log(date.getTime())
    // console.log('formatted', contactInfos.length);
    getContactDetails();
    // setContactInfo(props.route.params.contactInfo);
  }, []);

  useEffect(() => {
    if (contactfullInfo) {
      setContactInfo(contactfullInfo);
      setisLoading(false);
      console.log(
        'contact details-use effect',
        contactfullInfo.contact_data.id,
      );
    }
  }, [contactfullInfo]);

  useEffect(() => {
    if (deletedContact) {
      console.log('Deleted Contact', deletedContact);
      setContactInfo('');
      //Alert.alert('Contact deleted successfully');
      props.navigation.goBack();

      //Toogle drawer not working......
      // props.navigation.navigate('Contacts', {deleteContact: true}, {...props});
    }
  }, [deletedContact]);

  useEffect(() => {
    if (feedBackRes) {
      console.log('feedBackRes', feedBackRes);
      Alert.alert(feedBackRes, '', [
        {
          text: 'OK',
          onPress: () => {
            props.clearfeedBack();
          },
        },
      ]);
    }
  }, [feedBackRes]);

  useEffect(() => {
    if (fetchedcampaignList) {
      console.log('fetchedcampaignList', fetchedcampaignList);
      setcampaignList(fetchedcampaignList);
    }
  }, [fetchedcampaignList]);
  useEffect(() => {
    if (campaigndownloadlink) {
      checkPermission(campaigndownloadlink?.url);
    }
  }, [campaigndownloadlink]);

  const getContactDetails = async () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let contactId = props.route.params.contactInfo?.id;
        props.viewContact({token, contactId});
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const deleteContactFunc = () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let userId = data.user_id;
        let id = contactfullInfo.contact_data.id;
        //console.log('id', contactfullInfo.contact_data.id);
        props.deleteContact({token, userId, id});
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const sendFeedBackAction = () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let user_id = data.user_id;
        let contactId = props.route.params.contactInfo?.id;
        props.feedBack({token, user_id, contactId});
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const viewcampaignAction = () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let user_id = data.user_id;
        let contactId = props.route.params.contactInfo?.id;
        props.viewcampaignList({token, contactId});
      });
    } catch (error) {
      console.error('error', error);
    }
  };

  const downloadcampaignListAction = () => {
    try {
      let userSavedData = userDetails();
      userSavedData.then(data => {
        let token = data.token;
        let user_id = data.user_id;
        let contactId = props.route.params.contactInfo?.id;
        props.downloadCampaignList({token, user_id, contactId});
      });
    } catch (error) {
      console.error('error', error);
    }
  };
  const pressLeftIconModal = () => {
    setcampaignModal(false);
  };

  const checkPermission = async url => {
    // Function to check the platform
    // If Platform is Android then check for permissions.

    if (Platform.OS === 'ios') {
      downloadFile(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(url);
          console.log('Storage Permission Granted.');
        } else {
          // If permission denied then show alert
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('++++' + err);
      }
    }
  };

  const downloadFile = fileUrl => {
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = fileUrl;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = '.' + file_ext[0];

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const {config, dirs} = RNFetchBlob.fs;
    let RootDir = dirs;

    console.log('RootDir>',RNFetchBlob.fs.dirs.DocumentDir);
    // return
    let file_path = RootDir.DocumentDir + '/file_' + Math.floor(date.getTime() + date.getSeconds() / 2) + file_ext;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path: file_path,
        description: 'downloading file...',
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    let userSavedData = userDetails();
    let token = null;
    userSavedData.then(data => {
       token = data.token;
    });

    // let dirs = RNFetchBlob.fs.dirs
// RNFetchBlob
// .config({
//   // response data will be saved to this path if it has access right.
//   path : dirs.DocumentDir + '/path-to-file.csv'
// })
// .fetch('GET',FILE_URL,{Authorization:`Beader ${token}`})
// .then((res) => {
//   // the path should be dirs.DocumentDir + 'path-to-file.anything'
//   console.log('The file saved to ', res.path())
// })

    RNFetchBlob.fetch('GET',FILE_URL,{Authorization:`Beader ${token}`}).then((res)=>{
      console.log('status>',res.info().status);
      console.log('erspos>',res.base64());
      console.log('path>',res.path());
      console.log('text>',res.text());
      console.log('json>',res.json());
      fs.writeFile(file_path, res.data, 'uri');
    })
    config(options)
      .fetch('GET', FILE_URL)
      .then(res => {
        // Alert after successful downloading
        console.log('res>',res);
        fs.writeFile(file_path, res.data, 'uri');
        Alert.alert('File Downloaded Successfully.', '', [
          {
            text: 'Ok',
            onPress: () => {
              props.cleardownloadCampaignList(), setcampaignModal(false);
            },
          },
        ]);
      });
  };
  const getFileExtention = fileUrl => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const campaignListUI = () => {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={campaignModal}
        onRequestClose={() => {
          setcampaignModal(!campaignModal);
        }}>
        <View
          style={{
            flex: 1,
            marginTop: Platform.OS == 'ios' ? HeightPercent(5) : null,
          }}>
          <Header
            title={'Campaign List'}
            leftIcon={'keyboard-backspace'}
            pressLeftIcon={pressLeftIconModal}
            leftImageIcon={null}
            pressleftImageIcon={null}
            rightIcon={null}
            pressRightIcon={null}
            rightTextIcon={null}
          />
          <ScrollView
            style={{
              margin: HeightPercent(3),
            }}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text style={styles.topLeftBox}>Campaign Name</Text>
                <Text style={styles.topRightBox}>Campaign Type</Text>
              </View>

              {campaignList.map((item, index) => {
                return (
                  <View
                    key={index.toString()}
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={[
                        styles.topLeftBox,
                        {
                          borderTopWidth: 0,
                          borderTopLeftRadius: 0,
                          fontWeight: 'normal',
                          borderBottomLeftRadius:
                            index == campaignList.length - 1
                              ? WidthPercent(1)
                              : 0,
                        },
                      ]}>
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.topRightBox,
                        {
                          borderTopWidth: 0,
                          borderTopRightRadius: 0,
                          fontWeight: 'normal',
                          borderBottomRightRadius:
                            index == campaignList.length - 1
                              ? WidthPercent(1)
                              : 0,
                        },
                      ]}>
                      {item.type}
                    </Text>
                  </View>
                );
              })}
            </View>

            <TouchableOpacity
              style={{
                height: HeightPercent(7),
                width: WidthPercent(80),
                borderRadius: 10,
                marginTop: HeightPercent(3),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                backgroundColor: globalColor.BTNCOLOR,
              }}
              onPress={() => {
                downloadcampaignListAction();
              }}>
              <Text
                style={{
                  fontSize: WidthPercent(5),
                  color: globalColor.WHITE,
                }}>
                Download List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: HeightPercent(7),
                width: WidthPercent(80),
                borderRadius: 10,
                marginTop: HeightPercent(3),
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                borderWidth: WidthPercent(0.5),
                borderColor: globalColor.LIGHTGREY,
              }}
              onPress={() => {
                setcampaignModal(false);
              }}>
              <Text
                style={{
                  fontSize: WidthPercent(4),
                  color: globalColor.BLACK,
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  //Header prop....
  const pressLeftIcon = () => {
    props.navigation.goBack();
  };

  //Edit contact property...
  const backPress = () => {
    seteditContactStatus(false);
  };
  const createContactResponse = () => {
    seteditContactStatus(false);
    props.clearcreatecontactStatus();
    getContactDetails();
  };

  const createReminderResponse = () => {
    seteditContactStatus(false);
    props.clearcreateReminder();
  };

  return (
    <>
      {isLoading ? (
        <TomLoader />
      ) : editContactStatus ? (
        <ContactEdit
          type={'Edit'}
          title={'Edit Contact'}
          backPress={backPress}
          // contactInfos={contactInfos}
          contactfullInfo={contactInfos}
          generalI={generalInfoStatus}
          createContactResponse={createContactResponse}
          createReminderResponse={createReminderResponse}
        />
      ) : (
        !isLoading && (
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: globalColor.WHITE,
              // alignItems: 'center',
            }}>
            <StatusBar
              animated={true}
              backgroundColor={globalColor.CARD}
              hidden={false}
            />
            <Header
              title={'Contact'}
              leftIcon={'keyboard-backspace'}
              pressLeftIcon={pressLeftIcon}
              leftImageIcon={null}
              pressleftImageIcon={null}
              rightIcon={null}
              pressRightIcon={null}
              rightTextIcon={'     '}
              // pressRightTextIcon={pressRightTextIcon}
            />
            <ScrollView>
              {campaignModal ? campaignListUI() : null}
              {contactInfos ? (
                <>
                  <FieldView
                    key={uuidv4()}
                    field={'USER NAME'}
                    value={
                      contactInfos.contact_data.last_name
                        ? contactInfos.contact_data?.first_name
                            .charAt(0)
                            .toUpperCase() +
                          contactInfos.contact_data?.first_name.slice(1) +
                          ' ' +
                          contactInfos.contact_data.last_name
                            ?.charAt(0)
                            .toUpperCase() +
                          contactInfos.contact_data.last_name?.slice(1)
                        : contactInfos.contact_data?.first_name
                            .charAt(0)
                            .toUpperCase() +
                          contactInfos.contact_data?.first_name.slice(1)
                    }
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'EMAIL'}
                    value={contactInfos.contact_data.email}
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'DATE REGISTERD'}
                    value={moment
                      .unix(contactInfos.contact_data.date_registered)
                      .format('MM/DD/YYYY')}
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'TYPE'}
                    value={contactInfos.contact_data.type}
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'MOBILE NUMBER'}
                    value={contactInfos.contact_data.mobile_phone}
                    fontSize={3.5}
                    margin={3}
                  />
                  <FieldView
                    key={uuidv4()}
                    field={'STATUS'}
                    value={
                      contactInfos.contact_data.is_active == 1
                        ? 'Active'
                        : 'Inactive'
                    }
                    fontSize={3.5}
                    margin={3}
                  />
                </>
              ) : null}
              <View style={{alignItems: 'center'}}>
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
                    seteditContactStatus(true);
                    setgeneralInfoStatus(true);
                  }}>
                  <Text
                    style={{
                      fontSize: WidthPercent(4),
                      color: globalColor.WHITE,
                    }}>
                    Edit Contact
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    height: HeightPercent(6),
                    width: WidthPercent(80),
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: WidthPercent(0.5),
                    backgroundColor: !generalInfoStatus
                      ? globalColor.BTNCOLOR
                      : globalColor.WHITE,
                    borderColor: globalColor.LIGHTGREY,
                    marginTop: HeightPercent(3),
                  }}
                  onPress={() => {
                    seteditContactStatus(true);
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
                    Alert.alert('Confirm deletion?', '', [
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                      {text: 'OK', onPress: () => deleteContactFunc()},
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
                <View
                  style={{
                    width: WidthPercent(80),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: HeightPercent(3),
                  }}>
                  <TouchableOpacity
                    style={{
                      height: HeightPercent(6),
                      width: WidthPercent(38),
                      borderRadius: 10,
                      marginTop: HeightPercent(3),
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 10,
                      borderWidth: WidthPercent(0.5),
                      borderColor: globalColor.LIGHTGREY,
                      backgroundColor: globalColor.BTNCOLOR,
                    }}
                    onPress={() => {
                      Alert.alert('Confirm to send feedback campaign?', '', [
                        {
                          text: 'Cancel',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'OK',
                          onPress: () => {
                            sendFeedBackAction();
                          },
                        },
                      ]);
                    }}>
                    <Text
                      style={{
                        fontSize: WidthPercent(4),
                        color: globalColor.WHITE,
                      }}>
                      Send Feedback
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      height: HeightPercent(6),
                      width: WidthPercent(38),
                      borderRadius: 10,
                      marginTop: HeightPercent(3),
                      padding: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: WidthPercent(0.5),
                      borderColor: globalColor.LIGHTGREY,
                      backgroundColor: globalColor.BTNCOLOR,
                    }}
                    onPress={() => {
                      setcampaignModal(true);
                      viewcampaignAction();
                    }}>
                    <Text
                      style={{
                        fontSize: WidthPercent(4),
                        color: globalColor.WHITE,
                      }}>
                      Campaign List
                    </Text>
                  </TouchableOpacity>
                </View>
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
  deletedContact: state.contact.deletedContact,
  contactfullInfo: state.contact.contactDetails,
  feedBackRes: state.contact.feedBack,
  fetchedcampaignList: state.contact.campaignList,
  campaigndownloadlink: state.contact.campaigndownloadlist,
});

export default connect(mapStateToProps, {
  deleteContact,
  viewContact,
  clearcreatecontactStatus,
  feedBack,
  clearfeedBack,
  viewcampaignList,
  clearcreateReminder,
  downloadCampaignList,
  cleardownloadCampaignList,
})(ContactDetails);
