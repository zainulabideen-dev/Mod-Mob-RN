import {
  Image,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';
import HeaderComp from '../../../components/HeaderComp';
import {
  _getFromAsyncStorage,
  _storeIntoAsyncStorage,
} from '../../../config/asyncstorage';
import ShopDetailsScreen from '../../shopdetails';
import {COLORS} from '../../../config/colors';
import ButtonCompReact from '../../../components/ButtomCompReact';
import {asyncStorageKeys} from '../../../config/constants';
import {DISABLE_ENABLE_SHOP, axiosClient} from '../../../config/apis';
import {AppLoaderComp} from '../../../components/AppLoaderComp';
import {toastShow} from '../../../config/toastmessage';

export default function MyOnlineShopScreen({navigation, route}) {
  const {user, shop, isCustomer} = route.params;
  const [showLoader, setShowLoader] = useState(false);

  async function _enableShop() {
    let params = {
      userId: user.id,
      apiToken: user.token,
      status: 'true',
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        DISABLE_ENABLE_SHOP,
        params,
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          const userData = {
            user,
            shop: data.shop,
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
      setShowLoader(false);
      console.log('error sign in api => ', error);
      toastShow('error', 'System error sign in');
    }
  }

  async function _getLocationPermission() {
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
          navigation.navigate('CreateOnlineShopScreen', {
            user,
            shop: undefined,
          });
        } else {
          console.log('Location permission denied');
          toastShow('info', 'Please allow permission to get nearby shops');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }

  if (shop === null) {
    return (
      <View style={{flex: 1}}>
        <HeaderComp title={'My Online Shop'} navigation={navigation} />
        <ImageBackground
          style={{flex: 1}}
          source={require('../../../assets/becomeSeller.jpeg')}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              padding: 5,
            }}>
            <View
              style={{
                backgroundColor: 'white',
                padding: 12,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 6,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                }}>
                Hello!{'\n'}You are not a Online Seller. Do you want to become
                an online Seller and Create your own online shop?
              </Text>

              <ButtonCompReact
                label={'Yes, Create My Online Shop'}
                bgColor={COLORS.blue_200}
                extraStyle={{marginTop: 20, paddingHorizontal: 15}}
                onPress={() => _getLocationPermission()}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (shop.active === 'false') {
    return (
      <View style={{flex: 1}}>
        <HeaderComp title={'My Online Shop'} navigation={navigation} />
        <AppLoaderComp visible={showLoader} />
        <View
          style={{
            flex: 1,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'black', fontSize: 17}}>
            Your Shop is De Activated. No Customer can see your shop or place
            order. If you want to Re Activate your shop again then Click the
            button below. Thanks!!
          </Text>

          <ButtonCompReact
            label={'Yes, I want to Re Activate My Shop'}
            bgColor={COLORS.blue_200}
            extraStyle={{marginTop: 20, paddingHorizontal: 15}}
            onPress={() => _enableShop()}
          />
        </View>
      </View>
    );
  }

  if (shop.active === 'block') {
    return (
      <View style={{flex: 1}}>
        <HeaderComp title={'My Online Shop'} navigation={navigation} />
        <AppLoaderComp visible={showLoader} />
        <View
          style={{
            flex: 1,
            padding: 15,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'red', fontSize: 17}}>
            Your Shop is blocked due to unusal activities and not good reviews
            from customers. Send us email and explain us what happen. We will
            check your profile again.
          </Text>

          <ButtonCompReact
            label={'Contact Us'}
            bgColor={COLORS.blue_200}
            extraStyle={{marginTop: 20, paddingHorizontal: 15}}
            onPress={() => console.log('contact Us')}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <ShopDetailsScreen
        navigation={navigation}
        route={{
          params: {
            user,
            shop,
            isCustomer: false,
          },
        }}
      />
    </View>
  );
}
