import React, {useEffect, useState} from 'react';
import {View, Text, Alert, ScrollView, TouchableOpacity} from 'react-native';
import HeaderComp from '../../components/HeaderComp';
import InfoTextComp from '../../components/InfoTextComp';
import {COLORS} from '../../config/colors';
import {toastShow} from '../../config/toastmessage';
import {
  DELIVERY_AREA,
  PLACE_ORDER,
  _getAxiosHeaders,
  axiosClient,
} from '../../config/apis';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import ButtonCompReact from '../../components/ButtomCompReact';
import * as geolib from 'geolib';
import {useSelector} from 'react-redux';
import {_numberWithCommas} from '../../config/constants';

export default function PlaceOrderScreen({navigation, route}) {
  const appStates = useSelector(state => state.appStoredData);
  let {user} = appStates.user;

  const {items, shop, totalPrice, addSales} = route.params;

  const [bolPFS, setBolPFS] = useState(true);
  const [distanceKm, setDistanceKm] = useState();

  const [showLoader, setShowLoader] = useState(false);
  const [price, setPrice] = useState(0);
  const [areas, setAreas] = useState([]);
  const [calcDeliveryCharges, setCalcDeliveryCharges] = useState(0);

  useEffect(() => {
    _calculateDistance();
  }, []);

  useEffect(() => {
    setPrice(parseInt(totalPrice));
  }, []);

  async function _deliveryAreaApi(json, type = 'get') {
    let params = {};
    if (type === 'get') {
      params = {
        userId: user.id,
        apiToken: user.token,
        type,
        shopId: shop.id,
      };
    }
    setShowLoader(true);

    try {
      const {data, status} = await axiosClient.post(DELIVERY_AREA, params);
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          if (type === 'get') {
            setAreas(data.data);
          }
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error sign in api => ', error);
      toastShow('error', `System error in delivery area`);
    }
  }

  async function _confirmOrder() {
    let params = {
      userId: user.id,
      totalPrice: price,
      totalItems: items.length,
      items,
      orderType: addSales ? 'SK' : 'CST',
      shopId: shop.id,
      deliveryCharges: bolPFS ? '0' : calcDeliveryCharges,
      pickFromShop: bolPFS ? '1' : '0',
      platform: 'mob',
    };

    if (addSales) {
      params.rcvAmount = price;
      params.customerId = 'user.id';
    }

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        PLACE_ORDER,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          Alert.alert('Place Order', data.message, [
            {text: 'OK', onPress: () => navigation.pop(3)},
          ]);
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error sign in api => ', error.response);
      toastShow('error', 'System error sign in');
    }
  }

  function _calculateDistance() {
    let distance = geolib.getDistance(
      {
        latitude: parseFloat(shop.latitude),
        longitude: parseFloat(shop.longitude),
      },
      {
        latitude: parseFloat(user?.latitude),
        longitude: parseFloat(user?.longitude),
      },
    );

    let km = distance / 1000;
    let totalDc = km.toFixed(2) * parseInt(shop?.deliveryCharges);
    //let totalPrice = price + totalDc;
    setCalcDeliveryCharges(totalDc.toFixed(2));
    //setPrice(totalPrice);
    setDistanceKm(km);
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AppLoaderComp visible={showLoader} />
      <HeaderComp
        title={addSales ? 'Confirm Sale' : 'Confirm Order'}
        navigation={navigation}
        backPress={true}
      />

      <ScrollView style={{padding: 15, flex: 1}}>
        {addSales ? null : (
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#D5DBDB',
                borderRadius: 5,
                flex: 0.5,
                height: 40,
                backgroundColor: bolPFS ? 'green' : 'white',
              }}>
              <TouchableOpacity onPress={() => setBolPFS(true)}>
                <Text
                  style={{
                    color: bolPFS ? 'white' : 'black',
                    fontFamily: 'Poppins-Regular',
                    textAlign: 'center',
                  }}>
                  Pick From Shop
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: '#D5DBDB',
                borderRadius: 5,
                flex: 0.5,
                height: 40,
                marginLeft: 5,
                backgroundColor: bolPFS ? 'white' : 'green',
              }}>
              <TouchableOpacity onPress={() => setBolPFS(false)}>
                <Text
                  style={{
                    color: bolPFS ? 'black' : 'white',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  Online Delivery
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View>
          <InfoTextComp
            heading={'Total Price'}
            subHeading={`${_numberWithCommas(price)} ${shop.currency}`}
            extraStyle={{marginTop: 5}}
          />
          {!bolPFS ? (
            <InfoTextComp
              heading={'Total Distance'}
              subHeading={`${distanceKm} KM`}
              extraStyle={{marginTop: 5}}
            />
          ) : null}

          {!bolPFS ? (
            <InfoTextComp
              heading={'Delivery Charges'}
              subHeading={`${calcDeliveryCharges} ${shop.currency}`}
              extraStyle={{marginTop: 5}}
            />
          ) : null}
        </View>

        <InfoTextComp
          heading={'Total ITems'}
          subHeading={`${items.length}`}
          extraStyle={{marginTop: 5}}
        />

        {addSales ? null : (
          <>
            <View style={{marginTop: 5, flexDirection: 'row'}}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Delivery location
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                    includeFontPadding: false,
                  }}>
                  {user?.homeAddress}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: COLORS.gray_100,
                height: 1,
                marginTop: 5,
              }}
            />
            <View style={{marginTop: 15, flexDirection: 'row'}}>
              <View>
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontFamily: 'Poppins-SemiBold',
                  }}>
                  Contact Phone
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                    includeFontPadding: false,
                  }}>
                  {user?.phone}
                </Text>
              </View>
            </View>
            <View
              style={{
                backgroundColor: COLORS.gray_100,
                height: 1,
                marginTop: 5,
              }}
            />
          </>
        )}
        <Text
          style={{
            marginTop: 5,
            color: 'black',
            fontSize: 17,
            color: 'black',
            fontFamily: 'Poppins-Regular',
          }}>
          {bolPFS ? 'SubTotal Price' : 'SubTotal Price + Delivery Charges'}
        </Text>

        <Text
          style={{
            color: 'black',
            fontFamily: 'Poppins-Bold',
            fontSize: 20,
          }}>
          {`${_numberWithCommas(
            bolPFS ? price : price + parseInt(calcDeliveryCharges),
          )} ${shop.currency}`}
        </Text>

        <ButtonCompReact
          label={'Confirm'}
          bgColor={COLORS.blue_200}
          extraStyle={{marginTop: 15, marginBottom: 20}}
          onPress={() => _confirmOrder()}
        />
      </ScrollView>
    </View>
  );
}
