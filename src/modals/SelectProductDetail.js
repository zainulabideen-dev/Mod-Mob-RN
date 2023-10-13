import React, {useState} from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {COLORS} from '../config/colors';
import ButtonCompReact from '../components/ButtomCompReact';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {_getShopCurrency} from '../config/apis';
import {toastShow} from '../config/toastmessage';

export const SelectProductDetail = ({
  visible,
  submit,
  onCloseModal,
  currentProduct,
  shop,
  metaData,
  isCustomer,
}) => {
  const [productColors, setProductColors] = useState([]);

  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
              }}>
              Product Details
            </Text>

            <TouchableOpacity onPress={() => onCloseModal()}>
              <Entypo name="cross" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 15, marginBottom: 15}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderColor: 'black',
                  borderWidth: 1,
                }}
                resizeMode="contain"
                borderRadius={5}
                source={{uri: currentProduct.photo}}
              />
              <View style={{marginLeft: 15}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontFamily: 'Poppins-Regular',
                    includeFontPadding: false,
                    padding: 0,
                  }}>
                  {currentProduct?.name}
                </Text>

                <Text
                  style={{
                    color: 'black',
                    fontSize: 17,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {currentProduct.ammount} {currentProduct.unit} ={' '}
                  {currentProduct.price} {shop.currency}
                </Text>
              </View>
            </View>
            {currentProduct.colors !== null && currentProduct.colors !== '' ? (
              <View style={{marginTop: 15}}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 17,
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Available Colors:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  {currentProduct.colors.split(',').map((item, i) => {
                    let bol = false;
                    if (productColors.includes(item)) {
                      bol = true;
                    }
                    return (
                      <TouchableOpacity
                        key={i}
                        onPress={() => {
                          setProductColors([item]);
                        }}>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            backgroundColor: item,
                            marginRight: 5,
                            borderRadius: 5,
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

            <View
              style={{
                marginTop: 15,
              }}>
              {currentProduct.size !== null && currentProduct.size !== '' ? (
                <View>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 17,
                      fontFamily: 'Poppins-Bold',
                      includeFontPadding: false,
                      padding: 0,
                    }}>
                    Available Sizes:
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 17,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    {currentProduct.size}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          {isCustomer ? (
            <ButtonCompReact
              label={'Add to Cart'}
              bgColor={COLORS.green_100}
              extraStyle={{marginTop: 20}}
              onPress={() => {
                if (
                  currentProduct.colors !== null &&
                  currentProduct.colors !== ''
                ) {
                  if (productColors.length === 0) {
                    toastShow('error', 'Please Select Color');
                    return;
                  }
                }
                submit(productColors);
              }}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
  },
  map: {flex: 1},
});
