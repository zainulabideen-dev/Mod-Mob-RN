import {View, Text, Image, StatusBar} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../../config/colors';
import {_signInWithGoogle} from '../../config/firebase';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {SIGN_IN, _apiSignIn, axiosClient} from '../../config/apis';
import {_storeIntoAsyncStorage} from '../../config/asyncstorage';
import ButtonCompReact from '../../components/ButtomCompReact';
import messaging from '@react-native-firebase/messaging';
import {toastShow} from '../../config/toastmessage';
import {asyncStorageKeys} from '../../config/constants';
import {useDispatch} from 'react-redux';
import {setLoggedInUser} from '../../config/store/reducers/appReducer';
import InputTextComp from '../../components/InputTextComp';

export default function SignInScreen({navigation}) {
  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);

  const [gmailId, setGmailId] = useState('');
  const [password, setPassword] = useState('');

  async function _googleSignIn() {
    let fcmToken = await messaging().getToken();
    _signIn(fcmToken);
  }

  async function _signIn(fcmToken) {
    setShowLoader(true);
    let params = {
      userName: gmailId,
      password: password,
      fcmToken: fcmToken,
      action: 'signIn',
    };

    try {
      const {data, status} = await axiosClient.post(SIGN_IN, params);
      if (status == 200) {
        if (data.status === '200') {
          toastShow('success', data.message);
          const userData = {
            user: data.user,
            shop: data.shop,
          };
          await _storeIntoAsyncStorage(
            asyncStorageKeys.user,
            JSON.stringify(userData),
          );

          dispatch(setLoggedInUser(userData));

          if (
            userData?.user?.homeAddress === null ||
            userData?.user?.homeAddress === ''
          ) {
            navigation.replace('UserInfoScreen');
          } else {
            navigation.replace('HomeScreen');
          }
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
      <StatusBar backgroundColor={'#2C3E50'} />
      <AppLoaderComp visible={showLoader} />
      <View style={{flex: 0.4}}>
        <Image
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
          source={require('../../assets/logo.png')}
        />
      </View>
      <View style={{flex: 0.6, paddingHorizontal: 20}}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Poppins-Regular',
            color: 'black',
          }}>
          Welcome to Meri Online Dukan
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
          }}>
          Fastest and flexible online selling and purchasing platform
        </Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <InputTextComp
            value={gmailId}
            placeholder={'Gmail'}
            onChangeText={text => setGmailId(text)}
            hint={'gmail'}
          />
          <InputTextComp
            value={password}
            placeholder={'Password'}
            onChangeText={text => setPassword(text)}
            hint={'password'}
            secureTextEntry={true}
          />
          <ButtonCompReact
            label={'Log In'}
            bgColor={COLORS.green_100}
            extraStyle={{marginTop: 20}}
            onPress={() => _googleSignIn()}
          />

          <Text
            style={{
              marginVertical: 20,
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
            }}>
            Dont have an account?
          </Text>
          <ButtonCompReact
            label={'Create Account'}
            bgColor={'#2E86C1'}
            onPress={() => {
              navigation.navigate('CreateAccountScreen');
            }}
          />
        </View>
      </View>
    </View>
  );
}
