import React from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {DeActivateShopText} from '../config/constants';
import {toastShow} from '../config/toastmessage';

export default function UserNavList({
  item,
  navigation,
  deActivateShop,
  userLoggedIn,
  metaData,
}) {
  function _handleClick(item) {
    if (item.heading === 'De Activate Shop') {
      Alert.alert(item.heading, DeActivateShopText, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => deActivateShop()},
      ]);
    } else if (item.screen === '') {
      toastShow('info', 'coming soon!');
    } else if (item.screen !== '') {
      navigation.navigate(item.screen, {
        userLoggedIn,
        isCustomer: item.isCustomer,
        shop: userLoggedIn?.shop,
        metaData,
      });
    }
  }

  return (
    <TouchableOpacity onPress={() => _handleClick(item)}>
      <View
        style={{
          margin: 5,
          paddingVertical: 10,
          paddingHorizontal: 15,
          borderColor: '#2C3E50',
          borderWidth: 1,
          borderRadius: 30,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: 35,
            height: 35,
          }}
          source={item.image}
        />
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            marginLeft: 20,
            color: 'black',
            fontSize: 17,
            includeFontPadding: false,
          }}>
          {item.heading}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
