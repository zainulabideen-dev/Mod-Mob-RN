import {StyleSheet, View} from 'react-native';
import React from 'react';
import HeaderComp from '../../components/HeaderComp';
import {_getFromAsyncStorage} from '../../config/asyncstorage';
import HomeOptionsComp from '../../components/HomeOptionsComp';
import {APP_NAME} from '../../config/constants';

export default function HomeScreen({navigation}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <HeaderComp
        title={'MeriOnlineDukan'}
        navigation={navigation}
        logout={true}
      />
      <View
        style={{
          flex: 1,
          padding: 10,
          justifyContent: 'space-between',
        }}>
        <HomeOptionsComp title={'Customer'} navigation={navigation} />
        <HomeOptionsComp title={APP_NAME} navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customerText: {
    margin: 15,
    textAlign: 'left',
    fontSize: 25,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    width: '100%',
    paddingHorizontal: 20,
  },
  onlineSellerText: {
    margin: 15,
    textAlign: 'left',
    fontSize: 25,
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontFamily: 'Poppins-Regular',
    width: '100%',
  },
});
