import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {_numberWithCommas} from '../config/constants';

export default function SelectedItemComp({
  item,
  shop,
  onChangeAmount,
  productsList,
  onColorSizeSelected,
  removeItem,
}) {
  let product = productsList.filter(prd => prd.id === item.id)[0];
  let price = isNaN(parseInt(item.price)) ? 0 : parseInt(item.price);
  let colors = product.colors === '' ? [] : product.colors.split(',');
  let sizes = product.size === '' ? [] : product.size.split(',');
  let chooseColors = item.colors === '' ? [] : item.colors.split(',');
  let chooseSizes = item.size === '' ? [] : item.size.split(',');

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
              fontSize: 14,
              color: 'black',
              textAlign: 'right',
              fontFamily: 'Poppins-Regular',
            }}>
            {`InStock: ${item.stockLeft} ${
              item.unit === '' ? 'items' : item.unit
            }`}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            {item.name}
          </Text>
          <View
            style={{
              borderColor: 'black',
              borderWidth: 1,
              height: 40,
            }}>
            <TextInput
              onChangeText={text => {
                onChangeAmount(text);
              }}
              keyboardType="number-pad"
              style={{textAlign: 'center'}}
              value={item?.ammount.toString()}
            />
          </View>
          <Text
            style={{
              fontSize: 15,
              color: 'black',
              fontFamily: 'Poppins-Regular',
              marginTop: 2,
            }}>
            {`Calc Price: ${_numberWithCommas(price)} ${shop.currency}`}
          </Text>
          {colors.length > 0 ? (
            <View style={{marginTop: 5}}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  marginTop: 2,
                }}>
                {`Choose Colors`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {colors.map((clr, i) => {
                  let bol = false;
                  if (chooseColors.includes(clr)) {
                    bol = true;
                  }
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        if (bol) {
                          let list = chooseColors.filter(
                            chClr => chClr !== clr,
                          );
                          onColorSizeSelected(list, 'C');
                        } else {
                          onColorSizeSelected([...chooseColors, clr], 'C');
                        }
                      }}>
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          backgroundColor: clr,
                          marginRight: 5,
                          borderRadius: 5,
                          borderColor: 'black',
                          borderWidth: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {bol ? (
                          <AntDesign name="check" color="white" size={15} />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}
          {sizes.length > 0 ? (
            <View style={{marginTop: 5}}>
              <Text
                style={{
                  fontSize: 15,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  marginTop: 2,
                }}>
                {`Choose Size`}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {sizes.map((szs, i) => {
                  let bol = false;
                  if (chooseSizes.includes(szs)) {
                    bol = true;
                  }
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        if (bol) {
                          let list = chooseSizes.filter(size => size !== szs);
                          onColorSizeSelected(list, 'S');
                        } else {
                          onColorSizeSelected([...chooseSizes, szs], 'S');
                        }
                      }}>
                      <View
                        style={{
                          width: 30,
                          height: 30,
                          backgroundColor: bol ? 'green' : 'white',
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
                            color: bol ? 'white' : 'black',
                            fontFamily: 'Poppins-Regular',
                            includeFontPadding: false,
                          }}>
                          {szs}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
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
