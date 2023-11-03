import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../config/colors';
import {_signInWithGoogle} from '../../config/firebase';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {SIGN_IN, _apiSignIn, axiosClient} from '../../config/apis';
import {_storeIntoAsyncStorage} from '../../config/asyncstorage';
import ButtonCompReact from '../../components/ButtomCompReact';
import messaging from '@react-native-firebase/messaging';
import {toastShow} from '../../config/toastmessage';
import InputTextComp from '../../components/InputTextComp';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderComp from '../../components/HeaderComp';

export default function CreateAccountScreen({navigation}) {
  const [showLoader, setShowLoader] = useState(false);

  const [gmailId, setGmailId] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');

  async function _googleSignIn() {
    let fcmToken = await messaging().getToken();
    _signIn(fcmToken);
  }

  async function _signIn(fcmToken) {
    setShowLoader(true);
    let params = {
      userName: userName,
      password: password,
      fcmToken: fcmToken,
      email: gmailId,
      action: 'signUp',
    };

    try {
      const {data, status} = await axiosClient.post(SIGN_IN, params);
      if (status == 200) {
        if (data.status === '200') {
          toastShow('success', data.message);
          navigation.goBack();
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      console.log('error sign in api => ', error.response);
      toastShow('error', 'System error sign in');
    }
    setShowLoader(false);
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar backgroundColor={COLORS.primary} />
      <HeaderComp
        title={'Create New Account'}
        navigation={navigation}
        backPress={true}
      />
      <AppLoaderComp visible={showLoader} />

      <View style={{flex: 0.3}}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
          source={require('../../assets/logo.png')}
        />
      </View>
      <View
        style={{flex: 0.7, paddingHorizontal: 20, justifyContent: 'center'}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Poppins-SemiBold',
            color: 'black',
          }}>
          Create New Account
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            marginBottom: 20,
          }}>
          Fastest and flexible online selling and purchasing platform
        </Text>
        <InputTextComp
          value={userName}
          placeholder={'User Name'}
          onChangeText={text => setUserName(text)}
          hint={'name'}
        />
        <InputTextComp
          value={gmailId}
          placeholder={'Gmail Id'}
          onChangeText={text => setGmailId(text)}
          hint={'gmail'}
          keyboardType="visible-password"
        />
        <InputTextComp
          value={password}
          placeholder={'Password'}
          onChangeText={text => setPassword(text)}
          hint={'password'}
          secureTextEntry={true}
        />
        <ButtonCompReact
          label={'Create Account'}
          bgColor={COLORS.green_100}
          extraStyle={{marginTop: 20}}
          onPress={() => _googleSignIn()}
        />
      </View>
    </View>
  );
}
