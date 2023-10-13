import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import ButtonCompReact from '../../components/ButtomCompReact';
import {COLORS} from '../../config/colors';
import HeaderComp from '../../components/HeaderComp';
import {LocationPickerModal} from '../../modals/LocationPickerModal';
import {toastShow} from '../../config/toastmessage';
import {DELIVERY_AREA, _getAxiosHeaders, axiosClient} from '../../config/apis';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function DeliveryAreasScreen({navigation, route}) {
  const {userLoggedIn} = route.params;
  let user = userLoggedIn.user;
  let shop = userLoggedIn.shop;

  const [showLoader, setShowLoader] = useState(false);
  const [areas, setAreas] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _deliveryAreaApi({}, 'get');
    });
    return unsubscribe;
  }, [navigation]);

  async function _deliveryAreaApi(json, type) {
    let params = {};

    if (type === 'create') {
      params = {
        userId: user.id,
        latitude: json.marker.latitude,
        longitude: json.marker.longitude,
        address: json.address,
        radius: 10,
        type,
        shopId: shop.id,
      };
    } else if (type === 'get') {
      params = {
        userId: user.id,
        type,
        shopId: shop.id,
      };
    } else if (type === 'delete') {
      params = {
        userId: user.id,
        type,
        id: json.id,
      };
    }

    params.platform = 'mob';

    setShowLoader(true);
    try {
      const {data, status} = await axiosClient.post(
        DELIVERY_AREA,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          if (type === 'get') {
            setAreas(data.data);
          } else if (type === 'create') {
            _deliveryAreaApi({}, 'get');
          } else if (type === 'delete') {
            let newArray = areas.filter(item => item.id !== json.id);
            setAreas(newArray);
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

  async function _addDeliveryArea() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Please Allow Location permission to continue..',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setShowMap(true);
        } else {
          console.log('Location permission denied');
          toastShow('info', 'Please allow permission to get nearby shops');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  const AreasComp = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          padding: 7,
          marginBottom: 10,
        }}>
        <View
          style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
          <Entypo name="location-pin" size={15} color="black" />
        </View>
        <View style={{flex: 0.8}}>
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            {item.address}
          </Text>
        </View>
        <View
          style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
          {item.remove === 'true' ? (
            <TouchableOpacity onPress={() => _deliveryAreaApi(item, 'delete')}>
              <AntDesign name="delete" size={15} color="red" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <LocationPickerModal
        da={areas}
        visible={showMap}
        shop={shop}
        locationConfirm={json => {
          setShowMap(false);
          _deliveryAreaApi(json, 'create');
        }}
        onClose={() => setShowMap(false)}
      />
      <HeaderComp
        backPress={true}
        navigation={navigation}
        title="Delivery Areas"
        userLoggedIn={userLoggedIn}
      />
      <AppLoaderComp visible={showLoader} />
      <View style={{flex: 1, padding: 15}}>
        <View style={{marginTop: 10, flex: 0.9}}>
          <FlatList
            data={areas}
            renderItem={({item}) => <AreasComp item={item} />}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={{flex: 0.1, justifyContent: 'flex-end'}}>
          <ButtonCompReact
            label={'Add New Delivery Area'}
            bgColor={COLORS.blue_200}
            onPress={() => _addDeliveryArea()}
          />
        </View>
      </View>
    </View>
  );
}
