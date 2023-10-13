import {View, Text, ImageBackground, Image, ScrollView} from 'react-native';
import React from 'react';
import {COLORS} from '../../config/colors';
import {_getFromAsyncStorage} from '../../config/asyncstorage';
import HeaderComp from '../../components/HeaderComp';

export default function SellerInfoScreen({route, navigation}) {
  const {shop, isCustomer} = route.params;

  const SellerShopDetail = ({label, text}) => {
    return (
      <View style={{marginBottom: 10}}>
        <Text style={{color: COLORS.blue_200}}>{label}</Text>
        <Text
          style={{
            marginTop: 5,
            fontSize: 17,
            color: 'black',
            marginBottom: 5,
            fontFamily: 'Poppins-Regular',
          }}>
          {text}
        </Text>
        <View style={{backgroundColor: 'black', height: 1}} />
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {!isCustomer ? (
        <HeaderComp
          title={'Seller Info'}
          navigation={navigation}
          backPress={true}
          edit={true}
        />
      ) : null}
      <View style={{flex: 0.4, padding: 10}}>
        <ImageBackground
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'flex-end',
            borderWidth: 2,
            borderColor: 'black',
            borderRadius: 10,
          }}
          resizeMode="cover"
          borderRadius={10}
          source={{uri: shop.shopImage}}>
          <View style={{margin: 10}}>
            <Image
              resizeMode="contain"
              source={{uri: shop.skImage}}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: 'white',
              }}
            />
          </View>
        </ImageBackground>
      </View>
      <View style={{flex: 0.6, padding: 15}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SellerShopDetail label={'Shop Name'} text={shop.shopName} />
          <SellerShopDetail label={'Shop Address'} text={shop.shopAddress} />
          <SellerShopDetail label={'closeTime'} text={shop.closeTime} />
          <SellerShopDetail label={'openTime'} text={shop.openTime} />
          <SellerShopDetail label={'days'} text={shop.days} />
        </ScrollView>
      </View>
    </View>
  );
}
