import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {_getAddressFromLatLong, asyncStorageKeys} from '../../config/constants';
import HeaderComp from '../../components/HeaderComp';
import InputTextComp from '../../components/InputTextComp';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonCompReact from '../../components/ButtomCompReact';
import {COLORS} from '../../config/colors';
import {
  UPDATE_INFO,
  _askLocationPermission,
  _getAxiosHeaders,
  axiosClient,
} from '../../config/apis';
import {toastShow} from '../../config/toastmessage';
import {useDispatch, useSelector} from 'react-redux';
import {setLoggedInUser} from '../../config/store/reducers/appReducer';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {_storeIntoAsyncStorage} from '../../config/asyncstorage';

export default function UserInfoScreen({navigation, route}) {
  const {back} = route.params;
  const appStates = useSelector(state => state.appStoredData);
  let {user, shop} = appStates.user;

  const mapRef = useRef(null);
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [marker, setMarker] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    _getLocationPermission();
  }, []);

  useEffect(() => {
    if (marker !== undefined) {
      _fetchAddress();
    }
  }, [marker]);

  async function _fetchAddress() {
    let address = await _getAddressFromLatLong(marker);
    if (address !== null) {
      setAddress(address);
    }
  }

  async function _getLocationPermission() {
    let result = await _askLocationPermission();
    console.log(result);
    if (result === 'granted') {
      setPermissionGranted(true);
      _setInfo();
    }
  }

  function _setInfo() {
    setName(user?.name);
    if (user?.phone !== '' && user?.phone !== null) {
      setMobile(user?.phone);
    }
    if (user?.homeAddress !== '' && user?.homeAddress !== null) {
      setAddress(user?.homeAddress);
      let lat = parseFloat(user?.latitude);
      let lng = parseFloat(user?.longitude);
      setMarker({
        latitude: lat,
        longitude: lng,
      });
      if (mapRef !== null) {
        mapRef.current.animateToRegion(
          {
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          },
          2000,
        );
      }
    }
  }

  async function _updateInfo() {
    if (name === '') {
      toastShow('error', 'Please provide name.');
      return;
    }

    if (mobile === '') {
      toastShow('error', 'Please provide mobile number.');
      return;
    }
    if (address === '') {
      toastShow('error', 'Please provide home location');
      return;
    }

    let params = {
      userId: user?.id,
      name: name,
      phone: mobile,
      latitude: marker.latitude,
      longitude: marker.longitude,
      address: address,
      platform: 'mob',
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        UPDATE_INFO,
        params,
        _getAxiosHeaders(user?.token),
      );
      setShowLoader(false);
      if (status == 200) {
        if (data.status === '200') {
          toastShow('success', data.message);
          const userData = {
            user: data.data,
            shop: shop,
          };
          await _storeIntoAsyncStorage(
            asyncStorageKeys.user,
            JSON.stringify(userData),
          );

          dispatch(setLoggedInUser(userData));
          if (back) {
            navigation.goBack();
          } else {
            navigation.replace('HomeScreen');
          }
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error sign in api => ', error);
      toastShow('error', 'System error sign in');
    }
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AppLoaderComp visible={showLoader} />
      <HeaderComp
        title={'Update Your Profile'}
        navigation={navigation}
        logout={true}
        backPress={back}
      />
      {permissionGranted ? (
        <View style={{flex: 1, padding: 10}}>
          <InputTextComp
            placeholder={'Name'}
            value={name}
            hint={'name'}
            extraStyle={{marginTop: 5}}
            onChangeText={text => setName(text)}
          />
          <InputTextComp
            placeholder={'Phone number'}
            extraStyle={{marginTop: 5}}
            keyboardType="number-pad"
            value={mobile}
            hint={'phone number'}
            onChangeText={text => setMobile(text)}
          />
          <View style={{marginTop: 15, flexDirection: 'row'}}>
            <View style={{paddingTop: 5}}>
              <Ionicons name="home-outline" size={25} color="black" />
            </View>
            <View style={{marginLeft: 10}}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                }}>
                Home location
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  includeFontPadding: false,
                }}>
                You will recieve online delivery at your home
              </Text>
            </View>
          </View>
          <View style={styles.container}>
            <MapView
              ref={mapRef}
              showsUserLocation={true}
              showsMyLocationButton={true}
              zoomControlEnabled={true}
              provider={PROVIDER_GOOGLE}
              onPress={e => {
                setMarker(e.nativeEvent.coordinate);
              }}
              style={styles.map}
              region={{
                latitude: 24.884544,
                longitude: 67.201191,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {marker ? (
                <Marker coordinate={marker} title="Home location"></Marker>
              ) : null}
            </MapView>
          </View>
          {address !== null ? (
            <Text
              style={{
                color: 'black',
                fontFamily: 'Poppins-Regular',
                includeFontPadding: false,
                marginTop: 5,
              }}>
              {address}
            </Text>
          ) : null}

          <ButtonCompReact
            label={'Update Info'}
            bgColor={COLORS.blue_200}
            extraStyle={{marginTop: 20, marginBottom: 30}}
            onPress={() => _updateInfo()}
          />
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
              includeFontPadding: false,
            }}>
            Please Allow Location Permission to Continue
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    marginTop: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  map: {flex: 1},
});
