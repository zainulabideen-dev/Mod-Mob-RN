import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import MapView, {Circle, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import {COLORS} from '../config/colors';
import ButtonCompReact from '../components/ButtomCompReact';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as geolib from 'geolib';
import Config from 'react-native-config';

export const LocationPickerModal = ({
  visible,
  locationConfirm,
  onClose,
  da = [],
  shop = undefined,
  placeOrder = false,
}) => {
  const mapRef = useRef(null);
  const [address, setAddress] = useState();
  const [marker, setMarker] = useState();
  const [city, setCity] = useState('');
  let note = '';
  if (placeOrder) {
    note = 'Pleace place your delivery location iside the red area';
  } else {
    note = 'You will Recieve orders under this 10KM round area.';
  }

  const [zoomLocation, setZoomLocation] = useState(
    shop !== undefined
      ? {
          latitude: parseFloat(shop.latitude),
          longitude: parseFloat(shop.longitude),
        }
      : undefined,
  );

  async function _moveToLocation(latitude, longitude) {
    try {
      if (mapRef !== null) {
        mapRef.current.animateToRegion(
          {
            latitude,
            longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          2000,
        );
      }
    } catch (error) {}
  }

  Geocoder.init(Config.GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    if (marker !== undefined) {
      Geocoder.from(marker.latitude, marker.longitude)
        .then(json => {
          let district =
            json.results[json.results.length - 3].formatted_address;

          console.log('=> district', district.split(',')[0]);
          setCity(district.split(',')[0]);

          let fetchedAddress = json.results[0].formatted_address;
          setAddress(
            fetchedAddress.substring(fetchedAddress.indexOf(',') + 1).trim(),
          );
        })
        .catch(error => console.log(error));
    }
  }, [marker]);

  function _checkInsideRadius(coord) {
    let showMsg = true;
    da.forEach(element => {
      const coordinates = {
        latitude: parseFloat(element.latitude),
        longitude: parseFloat(element.longitude),
      };

      let inside = geolib.isPointWithinRadius(coordinates, coord, 10000);
      if (inside) {
        setMarker(coord);
        showMsg = false;
      }
    });

    if (showMsg) {
      ToastAndroid.showWithGravityAndOffset(
        'Place Delivery location inside red area',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
    }
  }

  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              position: 'absolute',
              left: 10,
              top: 10,
              zIndex: 3,
            }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: 'white',
                elevation: 1,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={() => onClose()}>
                <AntDesign name="arrowleft" size={20} />
              </TouchableOpacity>
            </View>
            {shop !== undefined ? (
              <View
                style={{
                  backgroundColor: 'white',
                  marginTop: 10,
                  padding: 10,
                  borderRadius: 5,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    _moveToLocation(
                      parseFloat(shop.latitude),
                      parseFloat(shop.longitude),
                    )
                  }>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 5,
                      }}
                      source={require('../assets/shop_location.png')}
                    />
                    <Text
                      style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
                      Zoom To Shop
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View style={styles.container}>
            <MapView
              ref={mapRef}
              showsUserLocation={true}
              showsMyLocationButton={true}
              zoomControlEnabled={true}
              provider={PROVIDER_GOOGLE}
              onPress={e => {
                if (placeOrder) {
                  _checkInsideRadius(e.nativeEvent.coordinate);
                } else {
                  setMarker(e.nativeEvent.coordinate);
                  setZoomLocation(e.nativeEvent.coordinate);
                }
              }}
              style={styles.map}
              region={{
                latitude: 24.884544,
                longitude: 67.201191,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {marker ? (
                <Marker coordinate={marker} title="shop location"></Marker>
              ) : null}

              {shop !== undefined ? (
                <>
                  <Marker
                    coordinate={{
                      latitude: parseFloat(shop.latitude),
                      longitude: parseFloat(shop.longitude),
                    }}
                    title="shop location">
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                      }}
                      source={require('../assets/shop_location.png')}
                    />
                  </Marker>
                </>
              ) : null}

              {da.map((item, i) => {
                return (
                  <Circle
                    key={i}
                    center={{
                      latitude: parseFloat(item.latitude),
                      longitude: parseFloat(item.longitude),
                    }}
                    radius={10000}
                    strokeColor="#AED6F1"
                    strokeWidth={2}
                    fillColor="rgba(255, 0, 0, 0.1)"
                  />
                );
              })}

              {marker && !placeOrder ? (
                <Circle
                  center={{
                    latitude: marker.latitude,
                    longitude: marker.longitude,
                  }}
                  radius={10000}
                  strokeColor="#AED6F1"
                  strokeWidth={2}
                  fillColor="rgba(255, 0, 0, 0.1)"
                />
              ) : null}
            </MapView>
          </View>

          <View style={{flex: 0.3, padding: 10}}>
            <ScrollView>
              {shop !== undefined ? (
                <Text
                  style={{
                    color: 'black',
                    backgroundColor: '#EAECEE',
                    padding: 10,
                    borderRadius: 10,
                    marginBottom: 10,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  {note}
                </Text>
              ) : null}
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  fontFamily: 'Poppins-Regular',
                }}>
                Click on map to provide your shop location
              </Text>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                }}>
                {address}
              </Text>
              {address !== undefined ? (
                <ButtonCompReact
                  label={'Confirm'}
                  bgColor={COLORS.blue_200}
                  extraStyle={{marginTop: 20, marginBottom: 5}}
                  onPress={() =>
                    locationConfirm({
                      marker,
                      address,
                      city,
                    })
                  }
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.7,
  },
  map: {flex: 1},
});
