import {View, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComp from '../../../components/HeaderComp';
import ShopItemsComp from '../../../components/ShopItemsComp';
import SearchComp from '../../../components/SearchComp';
import {
  ADD_TO_FAV,
  GET_FAV_SHOPS,
  _getAxiosHeaders,
  axiosClient,
} from '../../../config/apis';
import {AppLoaderComp} from '../../../components/AppLoaderComp';
import {toastShow} from '../../../config/toastmessage';

export default function FavouriteSellerScreen({navigation, route}) {
  const {userLoggedIn, isCustomer, metaData} = route.params;
  let user = userLoggedIn?.user;

  const [shopsList, setShopsList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _GetFavShops();
    });
    return unsubscribe;
  }, [navigation]);

  async function _GetFavShops() {
    let params = {
      userId: user.id,
    };

    setShowLoader(true);
    try {
      const {data, status} = await axiosClient.post(
        GET_FAV_SHOPS,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          setShopsList(data.data);
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

  async function _addToFav(shopData) {
    let params = {
      userId: user.id,
      shopId: shopData.shopId,
    };

    setShowLoader(true);
    try {
      const {data, status} = await axiosClient.post(
        ADD_TO_FAV,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          let newList = shopsList.filter(
            item => item.shopId !== shopData.shopId,
          );
          setShopsList(newList);
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
    <View style={{flex: 1}}>
      <HeaderComp
        title={'Favourite Sellers'}
        navigation={navigation}
        userLoggedIn={userLoggedIn}
        backPress={true}
      />
      <AppLoaderComp visible={showLoader} />
      <View style={{marginTop: 10, padding: 10}}>
        <SearchComp extraStyle={{marginBottom: 10}} />
        <FlatList
          data={shopsList}
          renderItem={({item}) => (
            <ShopItemsComp
              metaData={metaData}
              item={item}
              navigation={navigation}
              addToFav={item => _addToFav(item)}
              onShopPress={shop => {
                navigation.navigate('ShopDetailsScreen', {
                  user,
                  shop,
                  userLoggedIn,
                  isCustomer,
                  metaData,
                });
              }}
            />
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}
