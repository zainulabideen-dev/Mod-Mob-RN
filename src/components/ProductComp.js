import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../config/colors';
import {_constGetSize, _numberWithCommas} from '../config/constants';
import Entypo from 'react-native-vector-icons/Entypo';

export default function ProductComp({
  item,
  shop,
  isCustomer,
  moreOptions,
  openImage,
  addToCart,
  minusToCart,
  addedItems,
}) {
  let prdAddedItem = addedItems.filter(prd => prd.id === item.id)[0];

  return (
    <View
      style={isCustomer ? styles.customerProductStyle : styles.skProductStyle}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}>
        <View style={{flex: 0.4}}>
          <TouchableWithoutFeedback onPress={() => openImage(item)}>
            <Image
              style={{
                height: 50,
                width: 50,
              }}
              resizeMode="contain"
              borderRadius={5}
              source={{uri: item.photo}}
            />
          </TouchableWithoutFeedback>
          {item?.colors !== '' ? (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  marginRight: 5,
                  fontSize: 12,
                }}>
                Color
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.gray_100,
                  borderRadius: 5,
                  width: 17,
                  height: 17,
                  marginRight: 5,
                  backgroundColor: item?.colors,
                }}></View>
            </View>
          ) : null}
        </View>
        <View style={{paddingLeft: 10, flex: 0.6}}>
          <Text
            style={{
              fontSize: 17,
              color: 'black',
              fontFamily: 'Poppins-Regu',
            }}>
            {`${item.name} ${_constGetSize(item?.size)}`}
          </Text>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            {`${'1'}  ${
              item.unit === '' ? 'item' : item.unit
            } = ${_numberWithCommas(item.price)} ${shop.currency}`}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <View style={{justifyContent: 'flex-end'}}></View>
          </View>
          {isCustomer ? (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => minusToCart(item)}
                style={{
                  marginVertical: 10,
                  borderRadius: 5,
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                  }}>
                  -
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  marginVertical: 10,
                  borderRadius: 5,
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: 'black',
                  borderWidth: 1,
                  marginHorizontal: 10,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                  }}>
                  {prdAddedItem?.ammount === undefined
                    ? '0'
                    : prdAddedItem?.ammount}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => addToCart(item)}
                style={{
                  marginVertical: 10,
                  borderRadius: 5,
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'black',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'white',
                  }}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View
          style={{
            justifyContent: isCustomer ? 'center' : 'flex-start',
            alignItems: 'flex-end',
            flex: 0.2,
          }}>
          {!isCustomer ? (
            <View>
              <TouchableWithoutFeedback onPress={() => moreOptions(item)}>
                <Entypo name="dots-three-vertical" size={20} color={'black'} />
              </TouchableWithoutFeedback>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customerProductStyle: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderBottomColor: '#E5E8E8',
    borderBottomWidth: 1,
  },
  skProductStyle: {
    borderColor: '#D5D8DC',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 3,
  },
});
