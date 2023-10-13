import Axios from 'axios';
import {_storeIntoAsyncStorage} from '../asyncstorage';
import {toastShow} from '../toastmessage';
import {asyncStorageKeys} from '../constants';
import Geocoder from 'react-native-geocoding';
import GetLocation from 'react-native-get-location';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import * as geolib from 'geolib';
import Config from 'react-native-config';

export const axiosClient = Axios.create({
  baseURL: Config.API_URL,
});

export const SIGN_IN = 'signIn.php';
export const GET_SPECIFIC_DATA = 'get_specific_data.php';
export const CREATE_SHOP = 'createShop.php';
export const NEAR_BY_SHOP = 'getNearbyShops.php';
export const SHOP_PRODCUTS = 'getProducts.php';
export const PLACE_ORDER = 'createSellOrder.php';
export const CREATE_PRODUCT = 'createProduct.php';
export const UPDATE_PRODUCT = 'updateShopProduct.php';
export const DELETE_PRODUCT = 'removeShopProduct.php';
export const GET_PLACE_ORDERS = 'getSellOrders.php';
export const UPDATE_ORDER_STATUS = 'updateOrderStatus.php';
export const UPDATE_SHOP = 'updateShop.php';
export const DISABLE_ENABLE_SHOP = 'updateShopStatus.php';
export const SUBMIT_REVIEW = 'submitReview.php';
export const GET_REVIEW = 'getShopReview.php';
export const ADD_TO_FAV = 'addShopToFav.php';
export const GET_FAV_SHOPS = 'getFavShop.php';
export const DELIVERY_AREA = 'deliveryAreas.php';
export const GET_PLACE_ORDER_DETAILS = 'getSellOrderDetail.php';
export const META_DATA = 'metaData.php';
export const UPDATE_INFO = 'updateUserInfo.php';
export const GET_SHOP_CAT = 'getShopCategories.php';
export const SIGN_OUT = 'signOut.php';
export const CHECK_USER = 'checkUser.php';
export const GET_CUSTOMERS = 'getShopCustomers.php';
export const SEARCH_CUSTOMER = 'searchCustomer.php';

export const _getAxiosHeaders = token => {
  const headers = {
    Authorization: token,
  };
  return {
    headers,
  };
};

export function _getShopCurrency(metaData, id) {
  let currency = '';
  metaData.shopCurrency.forEach(element => {
    if (element.id === id) {
      currency = element.name;
    }
  });
  return currency;
}

export async function _askLocationPermission() {
  let granted = false;
  if (Platform.OS === 'android') {
    try {
      granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Please Allow Location permission to continue..',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted;
    } catch (err) {
      console.log(err);
      return granted;
    }
  }
}

async function _getCurrentLocation() {
  let location = null;
  try {
    location = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    });
    return location;
  } catch (error) {
    console.log(error);
    toastShow('info', 'Please Turn on your GPS location');
    return location;
  }
}

async function _getAddressFromLatLong(location) {
  let json = null;
  try {
    json = await Geocoder.from(location.latitude, location.longitude);
    return json;
  } catch (error) {
    console.log(error);
    return json;
  }
}

export async function _apiSignIn(data, fcmToken, navigation) {}

export async function _apiGetNearByShops(userJSON) {
  let granted = await _askLocationPermission();
  if (!granted === 'granted') {
    toastShow('info', 'Please allow permission to get nearby shops');
    return null;
  }

  const myLocation = {
    latitude: userJSON.latitude,
    longitude: userJSON.longitude,
  };

  let json = await _getAddressFromLatLong(myLocation);
  if (json === null) return null;

  let district = json.results[json.results.length - 3].formatted_address;
  console.log(district.split(',')[0], '=>district');

  let params = {
    userId: userJSON.id,
    platform: 'mob',
    level_1_address: district.split(',')[0],
  };

  try {
    const {data, status} = await axiosClient.post(
      NEAR_BY_SHOP,
      params,
      _getAxiosHeaders(userJSON?.token),
    );
    if (status == 200) {
      if (data.status === '200') {
        let shopsArray = [];
        data.data.forEach(element => {
          element.deliveryAreas.forEach(element2 => {
            const coordinates = {
              latitude: parseFloat(element2.latitude),
              longitude: parseFloat(element2.longitude),
            };

            let inside = geolib.isPointWithinRadius(
              coordinates,
              myLocation,
              10000,
            );
            if (inside) {
              shopsArray.push(element);
            }
          });
        });

        if (shopsArray.length > 0) {
          toastShow('success', data.message);
          return shopsArray;
        } else {
          toastShow('error', 'No Shop found in your area');
          return shopsArray;
        }
      } else {
        toastShow('error', data.message);
      }
    }
  } catch (error) {
    console.log('error finding nearby shops => ', error.response);
    toastShow('error', 'error finding nearby shops');
  }
}

export async function _apiGetShopCategories(user) {
  let URL = GET_SHOP_CAT + `?userId=${user.id}&platform=mob`;

  try {
    const {data, status} = await axiosClient.get(
      URL,
      _getAxiosHeaders(user?.token),
    );
    if (status == 200) {
      if (data.status === '200') {
        return data.data;
      } else {
        toastShow('error', data.message);
        return null;
      }
    }
  } catch (error) {
    console.log('error get shop categories api => ', error.response);
    toastShow('error', 'System error get shop categories');
  }
}

export async function _apiGetMetaData() {
  try {
    const {data, status} = await axiosClient.get(META_DATA);
    if (status == 200) {
      return data;
    }
  } catch (error) {
    console.log('error meta data in api => ', error.response);
    toastShow('error', 'System error meta data');
    return undefined;
  }
}

export async function _apiDeActivateShop(user, navigation, status) {
  let params = {
    userId: user.id,
    status,
    platform: 'mob',
  };

  try {
    const {data, status} = await axiosClient.post(
      DISABLE_ENABLE_SHOP,
      params,
      _getAxiosHeaders(user.token),
    );
    if (status == 200) {
      if (data.status === '200') {
        toastShow('success', data.message);
        const userData = {
          user,
          shop: data.data,
        };
        await _storeIntoAsyncStorage(
          asyncStorageKeys.user,
          JSON.stringify(userData),
        );
        navigation.reset({
          index: 0,
          routes: [{name: 'SplashScreen'}],
        });
      } else {
        toastShow('error', data.message);
      }
    }
  } catch (error) {
    console.log('error sign in api => ', error);
    toastShow('error', 'System error sign in');
  }
}

export async function _apiAddToFav(item, user) {
  let params = {
    userId: user.id,
    shopId: item.id,
  };
  try {
    const {data, status} = await axiosClient.post(
      ADD_TO_FAV,
      params,
      _getAxiosHeaders(user?.token),
    );
    if (status == 200) {
      if (data.status === '200') {
        toastShow('success', data.message);
      } else {
        toastShow('error', data.message);
      }
    }
  } catch (error) {
    console.log('error sign in api => ', error);
    toastShow('error', 'System error sign in');
  }
}
