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
import CheckBoxComp from './CheckBoxComp';
import {_numberWithCommas} from '../config/constants';
import Entypo from 'react-native-vector-icons/Entypo';

export default function ProductComp({
  item,
  shop,
  addProduct,
  isCustomer,
  moreOptions,
  openImage,
}) {
  let colorList = item?.colors !== '' ? item?.colors.split(',') : [];
  let sizeList = item?.size !== '' ? item?.size.split(',') : [];
  const [checked, setChecked] = useState(false);

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
                height: 90,
                width: '100%',
              }}
              resizeMode="contain"
              borderRadius={5}
              source={{uri: item.photo}}
            />
          </TouchableWithoutFeedback>
        </View>
        <View style={{paddingLeft: 10, flex: 0.5}}>
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
          {!isCustomer ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 3,
                }}>
                {sizeList.map((item, i) => {
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
                          justifyContent: 'center',

                          marginRight: 5,
                          backgroundColor: '#5DADE2',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontFamily: 'Poppins-Regular',
                          }}>
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
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
            </>
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
          {isCustomer ? (
            <View style={{alignItems: 'flex-end'}}>
              <CheckBoxComp
                isChecked={checked}
                onPress={() => {
                  setChecked(!checked);
                  addProduct({
                    id: item.id,
                    name: item.name,
                    ammount: 1,
                    price: item.price,
                    colors: '',
                    size: '',
                    unit: item.unit,
                    stockLeft: parseInt(item.remainStock) - 1,
                  });
                }}
              />
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
