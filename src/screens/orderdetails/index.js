import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import HeaderComp from '../../components/HeaderComp';
import {toastShow} from '../../config/toastmessage';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {
  GET_PLACE_ORDER_DETAILS,
  _getAxiosHeaders,
  axiosClient,
} from '../../config/apis';
import PlacedOrderItemComp from '../../components/PlacedOrderItemComp';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import ButtonCompReact from '../../components/ButtomCompReact';
import {COLORS} from '../../config/colors';

export default function PlaceOrderDetailScreen({navigation, route}) {
  const mapRef = useRef(null);
  const {order, isCustomer, user, item, userLoggedIn} = route.params;

  const [showLoader, setShowLoader] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [placeOrderList, setPlaceOrderList] = useState([]);

  console.log(order, 'order=?');

  useEffect(() => {
    _getOrderDetail();
  }, []);

  async function _getOrderDetail() {
    let URL =
      GET_PLACE_ORDER_DETAILS +
      `?userId=${user?.id}&sellOrderId=${order.id}&platform=mob&shopId=${order?.shopId}&userType=CST`;

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.get(
        URL,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        toastShow('success', data.message);
        if (data.status === '200') {
          setPlaceOrderList(data.data);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error get place order details api => ', error);
      toastShow('error', 'System error sign in');
    }
  }

  const DeliveryLocation = () => {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          zIndex: 5,
          backgroundColor: 'white',
          height: '100%',
          padding: 15,
        }}>
        <View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <View style={{flex: 0.5}}>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: 'bold',
                  color: 'black',
                  marginBottom: 5,
                }}>
                Delivery Location
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={() => {
                  mapRef.current.animateToRegion(
                    {
                      latitude: parseFloat(order.latitude),
                      longitude: parseFloat(order.longitude),
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    },
                    2000,
                  );
                }}>
                <Text
                  style={{
                    backgroundColor: '#566573',
                    color: 'white',
                    paddingVertical: 3,
                    paddingHorizontal: 5,
                  }}>
                  Zoom delivery location
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              borderColor: 'black',
              borderWidth: 1,
              height: '80%',
            }}>
            <MapView
              ref={mapRef}
              showsUserLocation={true}
              showsMyLocationButton={true}
              zoomControlEnabled={true}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: parseFloat(order.latitude),
                longitude: parseFloat(order.longitude),
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              <Marker
                coordinate={{
                  latitude: parseFloat(order.latitude),
                  longitude: parseFloat(order.longitude),
                }}
                title="delivery location"></Marker>
            </MapView>
          </View>
          <ButtonCompReact
            bgColor={COLORS.green_100}
            extraStyle={{marginTop: 20}}
            label={'Close'}
            onPress={() => setShowLocation(false)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {showLocation ? <DeliveryLocation /> : null}
      <AppLoaderComp visible={showLoader} />
      <HeaderComp
        navigation={navigation}
        backPress={true}
        title={'Order Details'}
        userLoggedIn={userLoggedIn}
      />
      <View style={{flex: 1, padding: 15}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 5,
            paddingBottom: 5,
            borderBottomColor: '#CCD1D1',
            borderBottomWidth: 1,
          }}>
          <View style={{flex: 0.5}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Medium',
              }}>
              Order Date
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Regular',
              }}>
              {order?.orderDate}
            </Text>
          </View>
          <View style={{flex: 0.5, alignItems: 'flex-end'}}>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Medium',
              }}>
              Total Items - Price
            </Text>
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Regular',
              }}>
              {order.totalItems} Items - {order.totalPrice}{' '}
              {`${order?.currency}`}
            </Text>
          </View>
        </View>
        <View>
          {!isCustomer ? (
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 0.5}}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Customer Name
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {order?.user?.name}
                </Text>
              </View>
              <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Medium',
                  }}>
                  Call Customer
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${order?.user?.phone}`);
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Poppins-Regular',
                      backgroundColor: '#3498DB',
                      includeFontPadding: false,
                      padding: 0,
                      paddingVertical: 2,
                      paddingHorizontal: 10,
                      borderRadius: 15,
                    }}>
                    {order?.user?.phone}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          {order.customerAddress !== '' ? (
            <View style={{marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 5,
                  borderBottomColor: '#CCD1D1',
                  borderBottomWidth: 1,
                }}>
                <View style={{flex: 0.5}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    Delivery Charges
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    {order.dlvCharges}
                    {` ${order?.currency}`}
                  </Text>
                </View>
                <View style={{flex: 0.5, alignItems: 'flex-end'}}>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Medium',
                    }}>
                    SubTotal + Delivery Charges
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Bold',
                    }}>
                    {parseInt(order.dlvCharges) + parseInt(order.totalPrice)}
                    {` ${order?.currency}`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  paddingBottom: 5,
                  borderBottomColor: '#CCD1D1',
                  borderBottomWidth: 1,
                }}>
                <Text
                  style={{
                    fontSize: 17,
                    color: 'black',
                    fontFamily: 'Poppins-Medium',
                    marginTop: 15,
                  }}>
                  Shop Name
                </Text>
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {order?.shopName}
                </Text>
              </View>

              {order?.pickFromShop === '0' ? (
                <>
                  <Text
                    style={{
                      fontSize: 17,
                      color: 'black',
                      fontFamily: 'Poppins-Medium',
                      marginTop: 15,
                    }}>
                    Delivery Address
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      fontFamily: 'Poppins-Regular',
                    }}>
                    {user?.homeAddress}
                  </Text>
                  <ButtonCompReact
                    bgColor={COLORS.green_100}
                    extraStyle={{marginTop: 20}}
                    label={'Delivery Location'}
                    onPress={() => setShowLocation(true)}
                  />
                </>
              ) : (
                <>
                  <ButtonCompReact
                    bgColor={COLORS.green_100}
                    extraStyle={{marginTop: 20}}
                    label={'Pick from Shop'}
                    onPress={() => console.log('')}
                  />
                </>
              )}
            </View>
          ) : null}
        </View>

        <Text
          style={{
            fontSize: 17,
            color: 'black',
            marginVertical: 10,
            fontFamily: 'Poppins-Regular',
          }}>
          Order Items:
        </Text>

        <FlatList
          data={placeOrderList}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <PlacedOrderItemComp currency={order?.currency} item={item} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {width: '100%', height: '100%'},
});
