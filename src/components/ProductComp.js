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
import {_numberWithCommas} from '../config/constants';
import Entypo from 'react-native-vector-icons/Entypo';

export default function ProductComp({
  item,
  shop,
  isCustomer,
  moreOptions,
  openImage,
  addToCart,
}) {
  let colorList = item?.colors !== '' ? item?.colors.split(',') : [];

  return (
    <View
      style={isCustomer ? styles.customerProductStyle : styles.skProductStyle}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}>
        <View style={{flex: 0.3}}>
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
        </View>
        <View style={{paddingLeft: 10, flex: 0.7}}>
          <Text
            style={{
              fontSize: 17,
              color: 'black',
              fontFamily: 'Poppins-Medium',
            }}>
            {item.name}
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
          {isCustomer ? (
            <TouchableOpacity
              onPress={() => addToCart(item)}
              style={{
                marginVertical: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  backgroundColor: '#17A589',
                  padding: 10,
                  color: 'white',
                  borderRadius: 5,
                }}>
                Add To Cart
              </Text>
            </TouchableOpacity>
          ) : null}
          {!isCustomer ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                {item?.size !== '' ? (
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 17,
                    }}>
                    {`Size: ${item?.size}`}
                  </Text>
                ) : null}
              </View>
              <View style={{flex: 0.5, justifyContent: 'flex-end'}}>
                {colorList.length > 0 ? (
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                      fontSize: 17,
                    }}>
                    Color
                  </Text>
                ) : null}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 3,
                  }}>
                  {colorList.map((item, i) => {
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          console.log('test');
                        }}>
                        <View
                          style={{
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: COLORS.gray_100,
                            borderRadius: 5,
                            width: 30,
                            height: 30,
                            marginRight: 5,
                            backgroundColor: item,
                          }}></View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
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
