import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import {COLORS} from '../config/colors';
import {_storeIntoAsyncStorage} from '../config/asyncstorage';

export default function ShopItemsComp({item, onShopPress, addToFav, metaData}) {
  const [fav, setFav] = useState(item.fav === 'true' ? true : false);

  useEffect(() => {
    setFav(item.fav === 'true' ? true : false);
  }, []);

  function _getShopCategory(id) {
    let cat = '';
    metaData.shopCategories.forEach(element => {
      if (element.id === id) {
        cat = element.name;
      }
    });
    return cat;
  }

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 7,
        elevation: 2,
        marginBottom: 5,
      }}>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}>
        <View style={{flex: 0.3}}>
          <Image
            style={{
              height: 100,
              width: '100%',
            }}
            resizeMode="cover"
            borderRadius={5}
            source={{uri: item.shopImage}}
          />
        </View>
        <View style={{flex: 0.7, paddingLeft: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingRight: 3,
            }}>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontFamily: 'Poppins-Regular',
              }}>
              {item.shopName}
            </Text>
            <TouchableOpacity
              onPress={() => {
                addToFav(item);
                setFav(!fav);
              }}>
              <AntDesign name={fav ? 'heart' : 'hearto'} size={20} />
            </TouchableOpacity>
          </View>
          <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
            {/* {_getShopCategory(item.shopCategory)} Shop */}Shop
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Entypo name="location-pin" />
            <Text style={{marginLeft: 3, fontFamily: 'Poppins-Regular'}}>
              {item.shopAddress}
            </Text>
          </View>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
            <AntDesign size={15} name="star" color={COLORS.yellow_100} />
            <Text style={{marginLeft: 5, color: 'black'}}>{item.ratings}</Text>
          </View>
        </View>
      </View>
      <View style={{backgroundColor: COLORS.gray_100, height: 1}} />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomEndRadius: 7,
          borderBottomStartRadius: 7,
        }}>
        <View style={{flex: 0.5}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Octicons
              size={20}
              name="dot-fill"
              color={
                item.shopOpen === 'true' ? COLORS.green_100 : COLORS.red_100
              }
            />
            <Text
              style={{
                marginLeft: 5,
                color: 'black',
                fontFamily: 'Poppins-Regular',
                includeFontPadding: false,
                padding: 0,
              }}>
              {item.shopOpen === 'true' ? 'Opened' : 'Closed'}
            </Text>
          </View>
        </View>
        <View style={{flex: 0.5, alignItems: 'flex-end'}}>
          <TouchableWithoutFeedback onPress={() => onShopPress(item)}>
            <Text
              style={{
                color: COLORS.blue_200,
                fontFamily: 'Poppins-Regular',
              }}>
              More Detail
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}
