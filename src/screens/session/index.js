import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {_deleteFromAsyncStorage} from '../../config/asyncstorage';
import {asyncStorageKeys} from '../../config/constants';

export default function SessionScreen({navigation}) {
  async function _clearDataLogOut() {
    try {
      await _deleteFromAsyncStorage(asyncStorageKeys.user);
      await _deleteFromAsyncStorage(asyncStorageKeys.currentShop);
    } catch (error) {}

    navigation.reset({
      index: 0,
      routes: [{name: 'SplashScreen'}],
    });
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
      }}>
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          elevation: 1,
          backgroundColor: 'white',
          borderColor: 'black',
          borderWidth: 1,
        }}>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Poppins-Medium',
            includeFontPadding: false,
          }}>
          Session Expired. Please Logout and Login again . Thanks
        </Text>
        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => _clearDataLogOut()}>
            <Text
              style={{
                backgroundColor: '#E74C3C',
                paddingVertical: 5,
                width: 70,
                color: 'white',
                textAlign: 'center',
                borderRadius: 15,
              }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
