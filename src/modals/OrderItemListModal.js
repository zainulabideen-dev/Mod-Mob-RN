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
import {FlatList} from 'react-native-gesture-handler';

export const OrderItemListModal = ({
  visible,
  onCloseModal,
  addedItems,
  shop,
  metaData,
  productsList,
  removeItem,
  onSubmit,
}) => {
  const OrderItemsJSX = ({item}) => {
    let product = productsList.find(p => p.id === item.id);
    console.log(product);
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 5,
          borderBottomWidth: 1,
          borderBottomColor: '#D5D8DC',
        }}>
        <View style={{flex: 0.2}}>
          <Image
            style={{
              width: 35,
              height: 35,
            }}
            resizeMode="contain"
            source={{uri: product.photo}}
          />
        </View>
        <View style={{flex: 0.6, paddingHorizontal: 20}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            {product.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
            }}>
            Items: {item.ammount}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
            }}>
            Price: {item.price}
            {' ' + _getShopCurrency(metaData, shop.currency)}
          </Text>
        </View>
        <View
          style={{
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <TouchableOpacity onPress={() => removeItem(item)}>
            <AntDesign name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
              Order Item List
            </Text>

            <TouchableOpacity onPress={() => onCloseModal()}>
              <Entypo name="cross" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 15, marginBottom: 15}}>
            <FlatList
              data={addedItems}
              renderItem={({item}) => <OrderItemsJSX item={item} />}
              keyExtractor={item => item.id}
            />
          </View>
          <ButtonCompReact
            label={'Confirm & Continue'}
            bgColor={COLORS.green_100}
            extraStyle={{marginTop: 20}}
            onPress={() => onSubmit()}
          />
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
