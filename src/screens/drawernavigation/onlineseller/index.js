import {View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComp from '../../../components/HeaderComp';
import ShopItemsComp from '../../../components/ShopItemsComp';
import SearchComp from '../../../components/SearchComp';
import {_getFromAsyncStorage} from '../../../config/asyncstorage';
import {_apiAddToFav, _apiGetNearByShops} from '../../../config/apis';
import {AppLoaderComp} from '../../../components/AppLoaderComp';
import {toastShow} from '../../../config/toastmessage';
import Geocoder from 'react-native-geocoding';
import Config from 'react-native-config';

export default function OnlineSellerScreen({navigation, route}) {
  const {userLoggedIn, isCustomer, metaData} = route.params;
  let user = userLoggedIn.user;

  const [showLoader, setShowLoader] = useState(false);
  const [shopsList, setShopsList] = useState([]);
  const [filterShopsList, setFilterShopsList] = useState([]);

  Geocoder.init(Config.GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    _getLocationPermission();
  }, []);

  async function _getLocationPermission() {
    setShopsList([]);
    setFilterShopsList([]);
    setShowLoader(true);
    let res = await _apiGetNearByShops(user);
    if (res) {
      setShopsList(res);
      setFilterShopsList(res);
    }
    setShowLoader(false);
  }

  async function _addToFav(item) {
    setShowLoader(true);
    await _apiAddToFav(item, user);
    setShowLoader(false);
  }

  function searchShops(text) {
    if (text.length > 0 && shopsList.length > 0) {
      if (text) {
        const filterData = shopsList.filter(function (item) {
          const sname = item.shopName
            .replace(/[^a-zA-Z0-9 ]/g, '')
            .toLowerCase();
          const textSearch = text.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
          return sname.includes(textSearch);
        });

        setFilterShopsList(filterData);
      }
    } else if (text.length === 0) {
      setFilterShopsList(shopsList);
    }
  }

  return (
    <View style={{flex: 1}}>
      <HeaderComp
        title={'Nearby Dukan'}
        navigation={navigation}
        backPress={true}
      />
      <AppLoaderComp visible={showLoader} />
      <View style={{flex: 1, padding: 15}}>
        <SearchComp onTextChange={text => searchShops(text)} />
        <View style={{marginTop: 10, marginBottom: 40}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filterShopsList}
            renderItem={({item}) => (
              <ShopItemsComp
                item={item}
                metaData={metaData}
                navigation={navigation}
                addToFav={item => _addToFav(item)}
                onShopPress={shop => {
                  if (item.shopOpen === 'true') {
                    navigation.navigate('ShopDetailsScreen', {
                      user,
                      shop,
                      userLoggedIn,
                      isCustomer,
                      metaData,
                    });
                  } else {
                    toastShow('info', 'Shop is closed today');
                  }
                }}
              />
            )}
            keyExtractor={item => item.id}
          />
        </View>
      </View>
    </View>
  );
}
