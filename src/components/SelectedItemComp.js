import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {_numberWithCommas} from '../config/constants';

export default function SelectedItemComp({
  item,
  shop,
  productsList,
  removeItem,
}) {
  let product = productsList.filter(prd => prd.id === item.id)[0];
  let price = isNaN(parseInt(item.price)) ? 0 : parseInt(item.price);

  return (
    <View style={styles.customerProductStyle}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            flex: 0.3,
            borderRightWidth: 1,
            borderRightColor: 'black',
            padding: 5,
          }}>
          <Image
            style={{
              height: 100,
              width: '100%',
            }}
            resizeMode="contain"
            borderRadius={5}
            source={{uri: product.photo}}
          />
          <Text
            style={{
              fontSize: 12,
              color: 'black',
              marginTop: 2,
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
            }}>
            Orignal Price
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'black',
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
            }}>
            {`${_numberWithCommas(product?.price)} ${shop?.currency}`}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              flex: 1,
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity onPress={() => removeItem(item)}>
              <Text
                style={{
                  fontSize: 12,
                  color: 'white',
                  marginTop: 2,
                  fontFamily: 'Poppins-Regular',
                  textAlign: 'center',
                  backgroundColor: '#E74C3C',
                  includeFontPadding: false,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                }}>
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingLeft: 10,
            flex: 0.7,
            padding: 5,
          }}>
          <Text
            style={{
              fontSize: 17,
              color: 'black',
              fontFamily: 'Poppins-Bold',
            }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            {`Quantity: ${item?.ammount.toString()}`}
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: 'black',
              fontFamily: 'Poppins-Regular',
              marginTop: 2,
            }}>
            {`Calc Price: ${_numberWithCommas(price)} ${shop.currency}`}
          </Text>
          <View
            style={{
              flexDirection: 'row',
            }}>
            {item?.colors !== '' ? (
              <View
                style={{
                  flex: 0.5,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                    marginTop: 2,
                  }}>
                  {`Color`}
                </Text>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: item?.colors,
                    marginRight: 5,
                    borderRadius: 5,
                    borderColor: 'black',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}></View>
              </View>
            ) : null}

            {item?.size !== '' ? (
              <View
                style={{
                  flex: 0.5,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                    marginTop: 2,
                  }}>
                  {`Size`}
                </Text>
                <View
                  style={{
                    width: 30,
                    height: 30,
                    backgroundColor: 'green',
                    marginRight: 5,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    borderWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: 'white',
                      fontFamily: 'Poppins-Regular',
                      includeFontPadding: false,
                    }}>
                    {item?.size}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customerProductStyle: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
  },
  skProductStyle: {
    borderColor: '#D5D8DC',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 3,
  },
});
