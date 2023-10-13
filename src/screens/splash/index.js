import {Text, StatusBar, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import {
  _getFromAsyncStorage,
  _storeIntoAsyncStorage,
} from '../../config/asyncstorage';
import {asyncStorageKeys} from '../../config/constants';
import {
  CHECK_USER,
  _apiGetMetaData,
  _getAxiosHeaders,
  axiosClient,
} from '../../config/apis';
import {useDispatch} from 'react-redux';
import {
  setLoggedInUser,
  setMetaData,
} from '../../config/store/reducers/appReducer';

export default function SplashScreen({navigation}) {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      _checkOnboarding();
    }, 1000);
  });

  async function _checkUser(user) {
    try {
      let params = {
        userId: user?.user?.id,
        platform: 'mob',
      };
      console.log(params, 'params');
      let res = await axiosClient.post(
        CHECK_USER,
        params,
        _getAxiosHeaders(user?.user?.token),
      );
      console.log(params, 'params:');
      if (res.status === 200) {
        return res?.data;
      } else {
        return null;
      }
    } catch (e) {
      console.log('axios', e);
      return null;
    }
  }

  async function _checkOnboarding() {
    let apiMetaData = await _apiGetMetaData();
    dispatch(setMetaData(apiMetaData));

    // if (apiMetaData.appBuildVersion !== DeviceInfo.getBuildNumber()) {
    //   navigation.replace('AppUpdateScreen', {metaData: apiMetaData});

    // }

    const onBoarding = await _getFromAsyncStorage(asyncStorageKeys.onBoarding);
    if (!onBoarding) {
      navigation.replace('OnBoardingScreen');
    } else {
      const loggedInUser = await _getFromAsyncStorage(asyncStorageKeys.user);
      if (!loggedInUser) {
        navigation.replace('SignInScreen');
      } else {
        const loggedInUserJson = JSON.parse(loggedInUser);
        dispatch(setLoggedInUser(loggedInUserJson));

        let res = await _checkUser(loggedInUserJson);
        console.log(res);
        if (res?.status === '500') {
          navigation.replace('SessionScreen');
          return;
        }
        if (
          loggedInUserJson?.user?.homeAddress === null ||
          loggedInUserJson?.user?.homeAddress === ''
        ) {
          navigation.replace('UserInfoScreen');
        } else {
          navigation.replace('HomeScreen');
        }
      }
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/splash.png')}
      resizeMode="cover"
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 15,
      }}>
      <StatusBar backgroundColor={'#ebded4'} />
      <Text
        style={{
          backgroundColor: 'white',
          color: 'black',
          paddingVertical: 10,
          paddingHorizontal: 20,
          fontFamily: 'Poppins-Medium',
          includeFontPadding: false,
          borderRadius: 25,
          elevation: 1,
        }}>
        Loading . . .
      </Text>
    </ImageBackground>
  );
}
