import React from 'react';
import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {DeActivateShopText} from '../config/constants';
import {toastShow} from '../config/toastmessage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../config/colors';

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
        addSales: item.addSales,
      });
    }
  }

  return (
    <TouchableOpacity
      onPress={() => _handleClick(item)}
      style={{
        backgroundColor: 'white',
        elevation: 2,
        padding: 15,
        marginBottom: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EAEDED',
      }}>
      <View
        style={{
          margin: 5,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            flex: 0.8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Image
            style={{
              width: 30,
              height: 30,
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            flex: 0.2,
          }}>
          <AntDesign name="rightcircle" size={20} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
