import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {_numberWithCommas} from '../config/constants';

export default function AddToCardComp({
  product,
  showHide,
  shop,
  addToCart,
  addedItems,
}) {
  const [amount, setAmount] = useState(0);
  const [calcPrice, setCalcPrice] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [remainStock, setRemainStock] = useState();

  let prdSize = product?.size === '' ? [] : product?.size.split(',');
  let prdColors = product?.colors === '' ? [] : product?.colors.split(',');

  function checkOutOfStock(val) {
    let am = isNaN(parseInt(val)) ? 0 : parseInt(val);
    let prdStock = parseInt(product?.remainStock);

    let buyStock = 0;
    addedItems.forEach(element => {
      if (element?.id === product?.id) {
        buyStock += parseInt(element?.ammount);
      }
    });

    let total = buyStock + parseInt(am);
    setRemainStock(prdStock - total);
    if (am === 0) {
      setCalcPrice(0);
    }
    if (prdStock < total) {
      return true;
    } else {
      return false;
    }
  }

  useEffect(() => {
    if (!isNaN(parseInt(amount))) {
      setCalcPrice(parseInt(amount) * parseInt(parseInt(product?.price)));
    }
  }, [amount]);

  return (
    <Modal transparent={true} visible={true}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          backgroundColor: 'white',
          padding: 20,
          flex: 1,
          borderTopWidth: 1,
          borderTopColor: '#D5DBDB',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 17,
              color: 'black',
              fontFamily: 'Poppins-Regular',
              marginBottom: 20,
            }}>
            Add To Cart
          </Text>
          <TouchableWithoutFeedback onPress={() => showHide(false)}>
            <AntDesign name="close" size={20} color={'black'} />
          </TouchableWithoutFeedback>
        </View>
        <Image
          style={{
            height: '30%',
            width: '100%',
          }}
          resizeMode="contain"
          borderRadius={5}
          source={{uri: product?.photo}}
        />
        <Text
          style={{
            fontSize: 20,
            color: 'black',
            fontFamily: 'Poppins-Medium',
            marginTop: 10,
          }}>
          {product?.name}
        </Text>
        <Text
          style={{
            color: 'black',
            fontFamily: 'Poppins-Regular',
          }}>
          {`${'1'}  ${
            product?.unit === '' ? 'item' : product?.unit
          } = ${_numberWithCommas(product?.price)} ${shop.currency}`}
        </Text>
        <View style={{marginTop: 10}}>
          <Text
            style={{
              color: 'black',
              fontSize: 17,
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            Enter Quantity
          </Text>
          <View
            style={{
              borderColor: 'black',
              borderWidth: 1,
              height: 40,
            }}>
            <TextInput
              onChangeText={text => {
                if (checkOutOfStock(text)) {
                  ToastAndroid.showWithGravityAndOffset(
                    'Out of stock',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50,
                  );

                  return;
                }

                setAmount(text);
              }}
              keyboardType="number-pad"
              style={{textAlign: 'center'}}
              value={amount.toString()}
            />
          </View>
          <Text
            style={{
              color: 'black',
              color: 'black',
              fontFamily: 'Poppins-Regular',
              textAlign: 'right',
            }}>
            {`Calc Price: ${calcPrice} ${shop.currency}`}
          </Text>
          {prdSize.length > 0 ? (
            <>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  marginTop: 10,
                }}>
                Select Size
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 3,
                }}>
                {prdSize.map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setSelectedSize(item);
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: 'black',
                          borderRadius: 5,
                          width: 30,
                          height: 30,
                          justifyContent: 'center',
                          marginRight: 5,

                          backgroundColor:
                            item === selectedSize ? 'green' : 'white',
                        }}>
                        <Text
                          style={{
                            color: item === selectedSize ? 'white' : 'black',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : null}
          {prdColors.length > 0 ? (
            <>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  marginTop: 10,
                }}>
                Select Colour
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 3,
                }}>
                {prdColors.map((item, i) => {
                  return (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        setSelectedColor(item);
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: 'black',
                          borderRadius: 5,
                          width: 30,
                          height: 30,
                          marginRight: 5,
                          backgroundColor: item,
                          justifyContent: 'center',
                        }}>
                        {selectedColor === item ? (
                          <AntDesign name="check" color="black" />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          ) : null}

          <TouchableOpacity
            onPress={() => {
              console.log(amount);
              if (amount === 0 || amount === '' || amount === '0') {
                ToastAndroid.showWithGravityAndOffset(
                  'Please add quantity',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
                return;
              }
              if (prdSize.length > 0 && selectedSize === '') {
                ToastAndroid.showWithGravityAndOffset(
                  'Please Select Size',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
                return;
              }
              if (prdColors.length > 0 && selectedColor === '') {
                ToastAndroid.showWithGravityAndOffset(
                  'Please Select Colour',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                  25,
                  50,
                );
                return;
              }

              addToCart({
                id: product?.id,
                rowId: addedItems.length + 1,
                name: product?.name,
                ammount: amount,
                price: calcPrice,
                colors: selectedColor,
                size: selectedSize,
                unit: product?.unit,
                photo: product?.photo,
                stockLeft: remainStock,
              });
            }}>
            <Text
              style={{
                textAlign: 'center',
                backgroundColor: 'black',
                padding: 10,
                color: 'white',
                borderRadius: 5,
                marginTop: 20,
              }}>
              Add To Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
