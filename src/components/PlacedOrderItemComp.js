//PlacedOrderItemComp

import React from 'react';
import {View, Text, Image} from 'react-native';

export default function PlacedOrderItemComp({item, currency}) {
  console.log(item);
  return (
    <View
      key={item.id}
      style={{
        backgroundColor: 'white',
        borderRadius: 7,
        elevation: 1,
        marginBottom: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 5,
        }}>
        <View style={{flex: 0.3}}>
          <Image
            style={{
              height: 50,
              width: 50,
              borderColor: 'black',
              borderWidth: 1,
            }}
            resizeMode="contain"
            borderRadius={5}
            source={{uri: item?.photo}}
          />
        </View>
        <View style={{flex: 0.6}}>
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              fontFamily: 'Poppins-Medium',
            }}>
            {item.name}
          </Text>
          <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
            {item.ammount} {item.unit} = {item.price} {currency}
          </Text>
        </View>
        <View
          style={{
            flex: 0.1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
          }}></View>
      </View>
    </View>
  );
}
