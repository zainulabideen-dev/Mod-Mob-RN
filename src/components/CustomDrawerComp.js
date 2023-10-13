import {
  View,
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  _deleteFromAsyncStorage,
  _getFromAsyncStorage,
} from '../config/asyncstorage';
import {asyncStorageKeys} from '../config/constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const CustomDrawerComp = props => {
  const [user, setUser] = useState();

  useEffect(() => {
    _getUser();
  }, []);

  async function _clearData() {
    await _deleteFromAsyncStorage(asyncStorageKeys.user);
    await _deleteFromAsyncStorage(asyncStorageKeys.currentShop);

    //await auth().signOut();
    await GoogleSignin.signOut();

    props.navigation.reset({
      index: 0,
      routes: [{name: 'SplashScreen'}],
    });
  }

  async function _logout() {
    Alert.alert('Logout', 'Are you sure you want logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => _clearData()},
    ]);
  }

  async function _getUser() {
    let userData = await _getFromAsyncStorage(asyncStorageKeys.user);
    if (userData) {
      let userJSON = JSON.parse(userData);
      setUser(userJSON.user);
    }
  }

  if (user === undefined) return;

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={'#2C3E50'} />
      <DrawerContentScrollView {...props} contentContainerStyle={{}}>
        <View style={{padding: 20}}>
          <Image
            source={{uri: user.photo}}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Poppins-Regular',
              includeFontPadding: false,
            }}>
            {user.name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: 'white',
                marginRight: 5,
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                includeFontPadding: false,
              }}>
              {user.email}
            </Text>
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: '#2C3E50', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          borderTopColor: 'white',
          borderTopWidth: 1,
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.closeDrawer();
            _logout();
          }}>
          <View style={{padding: 10}}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawerComp;
