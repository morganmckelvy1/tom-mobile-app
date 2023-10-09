import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {View,Text,TextInput,Alert} from 'react-native';
import Header from '../Components/Header';
import * as globalColor from '../Global/color';
import { HeightPercent,WidthPercent } from '../Global/device';
import {connect} from 'react-redux';
import {userDetails} from '../Global/userDetails';
import TomLoader from '../Components/tomLoader';

import {
    supportMessage
  } from '../Redux/Actions/supportAction';
const Support= props =>{
    const {
        supportSuccessStatus
      } = props;

    const [message,setMessage]=useState('')
    const [topic,setTopic]=useState('')

  

    useEffect(() => {
        if (supportSuccessStatus) {
          Alert.alert(supportSuccessStatus);
          setisLoading(false);
          setTopic('')
          setMessage('')
        }
      }, [supportSuccessStatus]);
    

    
    //Header property...
  const pressleftImageIcon = () => {
    props.navigation.toggleDrawer();
  };

  const pressRightTextIcon = () => {
    if(message.length>0){
        let userSavedData = userDetails();
        userSavedData.then(data => {
          let token = data.token;
          props.supportMessage(token,topic,message);
          setTimeout(() => {
            setTopic('')
            setMessage('')
            Alert.alert("Mail has been sent")
              if(supportSuccessStatus){
                props.backPress();
                //Alert("Feedback has been sent")
              }
              else{
                //Alert.alert('Error after api call');
              }
            
          }, 1000);
        });
      } else {
        Alert.alert('Please fill all fields.');
      }
    } 
  
  
    return(
        <>
            <SafeAreaView
            style={{flex: 1, backgroundColor: globalColor.WHITE}}>
            <Header
                title={'Support'}
                leftIcon={null}
                pressLeftIcon={null}
                leftImageIcon={require('../Assests/Images/menu.png')}
                pressleftImageIcon={pressleftImageIcon}
                rightIcon={null}
                pressRightIcon={null}
                rightTextIcon="SEND"
                pressRightTextIcon={pressRightTextIcon}
            />
            <View style={{flex: 1}}>
                <View style={{
                    marginTop:40,
                    width:WidthPercent(80),
                    height:HeightPercent(20),
                    marginLeft:39,
                    marginRight:68
                    }}>
                    <Text style={{
                        opacity: 1,
                        fontSize:14,
                        lineHeight:18,
                        }}>"Welcome to support! Have questions, comments, or concerns? You have been assigned a personal support agent that will be able to help you with whatever you need.</Text>
                    <Text style={{
                        marginTop:20,
                        fontSize:14,
                        }}> The Tom CMS Team"
                    </Text>

                    <Text style={{marginTop:50,fontSize:12,color:globalColor.LIGHTGREY}}>SUBJECT</Text>
                    <TextInput 
                        placeholder="Welcome to support"
                        placeholderTextColor={globalColor.BLACK}
                        style={{fontSize:14,marginTop:5}}
                        value={topic}
                        multiline={true}
                        onChangeText={text => {
                            setTopic(text);
                          }}
                    />
                   
                </View>


                <View style={{
                        width:WidthPercent(100),
                        height:1,
                        backgroundColor:globalColor.LIGHTGREY,
                        marginTop:35,
                        marginBottom:15,
                    }}
                />
                <View style={{
                    width:WidthPercent(80),
                    height:HeightPercent(20),
                    marginLeft:39,
                    marginRight:68,
                    marginTop:20
                    }}>
                    
                    <TextInput 
                        placeholder="BODY"
                        style={{fontSize:15}}
                        value={message}
                        multiline={true}
                        onChangeText={text => {
                            setMessage(text);
                          }}
                    />
                       
                </View>
                
            </View>
            </SafeAreaView>
        </>
    )
}
const mapStateToProps = state => ({
   supportSuccessStatus: state.support?.createsupportSuccess,
   
  });
  
  export default connect(mapStateToProps, {
    supportMessage,
    
  })(Support);
  