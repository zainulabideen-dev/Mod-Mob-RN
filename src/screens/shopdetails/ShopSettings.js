import {View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {asyncStorageKeys, shopSettings} from '../../config/constants';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {DISABLE_ENABLE_SHOP, axiosClient} from '../../config/apis';
import {toastShow} from '../../config/toastmessage';
import {_storeIntoAsyncStorage} from '../../config/asyncstorage';

export default function ShopSettingsScreen({route, navigation}) {
  const {user, shop, isCustomer} = route.params;
  const [showLoader, setShowLoader] = useState(false);

  function _settingItemClick(item) {
    if (item.heading === 'Update Shop') {
      navigation.navigate('CreateOnlineShopScreen', {
        user,
        shop,
      });
    } else if (item.heading === 'De Activate Shop') {
      Alert.alert(item.heading, item.subHeading, [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => _deActivateShop(item)},
      ]);
    } else if (item.heading === 'Delivery Areas') {
      navigation.navigate('DeliveryAreasScreen', {
        user,
        shop,
        isCustomer,
      });
    } else if (item.heading === 'Reviews') {
      navigation.navigate('SellerRatingsScreen', {
        user,
        shop,
        isCustomer,
      });
    }
  }

  async function _deActivateShop(item) {
    let params = {
      userId: user.id,
      apiToken: user.token,
      status: '0',
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        DISABLE_ENABLE_SHOP,
        params,
      );
      console.log(data);
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          const userData = {
            user,
            shop: data.shop,
          };
          console.log('disable =>', userData);
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

  const ShopSettingItems = ({item}) => {
    return (
      <TouchableOpacity
        style={{
          marginBottom: 10,
          backgroundColor: 'white',
          borderRadius: 5,
          elevation: 1,
        }}
        onPress={() => _settingItemClick(item)}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <View style={{flex: 0.8}}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '400',
                color: item.color,
                paddingHorizontal: 15,
                paddingVertical: 15,
              }}>
              {item.heading}
            </Text>
          </View>
          <View
            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            {item.image}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, padding: 15}}>
      <AppLoaderComp visible={showLoader} />
      <FlatList
        data={shopSettings}
        renderItem={({item}) => <ShopSettingItems item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
