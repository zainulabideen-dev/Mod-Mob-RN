import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import InputTextComp from '../../components/InputTextComp';
import SelectionComp from '../../components/SelectionComp';
import ImagePickerComp from '../../components/ImagePickerComp';
import {COLORS} from '../../config/colors';
import {_formatTime, asyncStorageKeys, days} from '../../config/constants';
import DatePicker from 'react-native-date-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {
  _getFromAsyncStorage,
  _storeIntoAsyncStorage,
} from '../../config/asyncstorage';
import {
  CREATE_SHOP,
  UPDATE_SHOP,
  _apiGetShopCategories,
  axiosClient,
} from '../../config/apis';
import {toastShow} from '../../config/toastmessage';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {LocationPickerModal} from '../../modals/LocationPickerModal';
import HeaderComp from '../../components/HeaderComp';
import ButtonCompReact from '../../components/ButtomCompReact';
import {SearchSelectionModal} from '../../modals/SearchSelectionModal';

export default function CreateOnlineShopScreen({navigation, route}) {
  const {userLoggedIn, shop} = route.params;
  let user = userLoggedIn.user;

  const [showLoader, setShowLoader] = useState(false);
  const [shopCategories, setShopCategories] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [currentTimeField, setCurrentTimeField] = useState();

  const [shopName, setShopName] = useState();
  const [openTime, setOpenTime] = useState('--:--');
  const [closeTime, setCloseTime] = useState('--:--');
  const [deliveryCharges, setDeliveryCharges] = useState();
  const [shopImage, setShopImage] = useState();
  const [shopKeeperImage, setShopKeeperImage] = useState();
  const [shopSelectedCategory, setShopSelectedCategory] = useState();
  const [shopCurrecny, setShopCurrecny] = useState();
  const [shopLocation, setShopLocation] = useState();
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  useEffect(() => {
    if (shop !== undefined) {
      setShopName(shop.shopName);
      setOpenTime(shop.openTime);
      setCloseTime(shop.closeTime);
      setShopLocation({
        address: shop.shopAddress,
        marker: {
          latitude: parseFloat(shop.latitude),
          longitude: parseFloat(shop.longitude),
        },
      });
      let days = shop.days.split(',');
      setSelectedDays(days);
      setShopCurrecny(shop?.currency);
      setDeliveryCharges(shop?.deliveryCharges);

      console.log(shop?.shopCategory);
      let obj = shopCategories.filter(cat => cat.id === shop?.shopCategory)[0];
      setShopSelectedCategory(obj);
    }
  }, []);

  async function _fetchData() {
    setShowLoader(true);
    let res = await _apiGetShopCategories(user);
    if (res) {
      setShopCategories(res);
      if (shop === undefined) {
        setShopSelectedCategory(res[0]);
      }
    }
    setShowLoader(false);
  }

  function _pickTime(date, type) {
    let formatedTime = _formatTime(date.getHours() + ':' + date.getMinutes());
    if (type === 'open') {
      setOpenTime(formatedTime);
    } else if (type === 'close') {
      setCloseTime(formatedTime);
    }
  }

  async function _pickImage(type) {
    const result = await launchImageLibrary();
    if (result.didCancel) {
      return;
    }
    if (type === 'shopKeeper') {
      setShopKeeperImage(result);
    } else if (type === 'shop') {
      setShopImage(result);
    }
  }

  async function _createShop() {
    if (shopName === undefined) {
      toastShow('error', 'Please provide shop name');
      return;
    }
    if (openTime === '--:--') {
      toastShow('error', 'Please provide shop open time');
      return;
    }
    if (closeTime === '--:--') {
      toastShow('error', 'Please provide shop close time');
      return;
    }
    if (shopSelectedCategory === undefined) {
      toastShow('error', 'Please provide shop category');
      return;
    }
    if (shop === undefined) {
      if (shopImage === undefined) {
        toastShow('error', 'Please provide shop image');
        return;
      }
      if (shopKeeperImage === undefined) {
        toastShow('error', 'Please provide shop keeper image');
        return;
      }
    }
    if (selectedDays.length === 0) {
      toastShow('error', 'Please provide shop open days');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('shopName', shopName);
    formData.append('shopAddress', shopLocation.address);
    formData.append('deliveryCharges', deliveryCharges);
    formData.append('openTime', openTime);
    formData.append('closeTime', closeTime);
    formData.append('latitude', shopLocation.marker.latitude);
    formData.append('longitude', shopLocation.marker.longitude);
    formData.append('days', selectedDays.toString());
    formData.append('shopCategory', shopSelectedCategory.id);
    formData.append('currency', shopCurrecny);
    formData.append('platform', 'mob');

    if (shopImage !== undefined) {
      formData.append('shopImage', {
        uri: shopImage.assets[0].uri,
        type: shopImage.assets[0].type,
        name: shopImage.assets[0].fileName,
      });
    }

    if (shopKeeperImage !== undefined) {
      formData.append('shopKeeperImage', {
        uri: shopKeeperImage.assets[0].uri,
        type: shopKeeperImage.assets[0].type,
        name: shopKeeperImage.assets[0].fileName,
      });
    }

    let END_POINT = '';
    if (shop === undefined) END_POINT = CREATE_SHOP;
    else END_POINT = UPDATE_SHOP;

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(END_POINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: user?.token,
        },
      });
      if (status == 200) {
        setShowLoader(false);
        if (data.status == '200') {
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
      setShowLoader(false);
      console.log('error get shop categories api => ', error.response);
      toastShow('error', 'System error get shop categories');
    }
  }

  function _addDays(item) {
    if (selectedDays.includes(item)) {
      let array = selectedDays.filter(item1 => item1 !== item);
      setSelectedDays(array);
    } else {
      setSelectedDays([...selectedDays, item]);
    }
  }

  if (showLoader) {
    <AppLoaderComp visible={true} />;
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderComp
        backPress={true}
        navigation={navigation}
        userLoggedIn={userLoggedIn}
        title={shop === undefined ? 'Create Shop' : 'Update Shop'}
      />

      <SearchSelectionModal
        data={shopCategories}
        visible={showItemPicker}
        title={'Select Shop Category'}
        onCloseModal={() => setShowItemPicker(false)}
        onSelected={item => {
          setShopSelectedCategory(item);
          setShowItemPicker(false);
          console.log(item);
        }}
      />

      <View style={{flex: 1, padding: 15}}>
        <AppLoaderComp visible={showLoader} />
        <LocationPickerModal
          visible={showMap}
          onClose={() => setShowMap(false)}
          locationConfirm={json => {
            setShowMap(false);
            setShopLocation(json);
          }}
        />
        <DatePicker
          modal
          mode="time"
          open={showDatePicker}
          date={new Date()}
          onConfirm={date => {
            setShowDatePicker(false);
            _pickTime(date, currentTimeField);
          }}
          onCancel={() => {
            setShowDatePicker(false);
          }}
        />

        <View style={{flex: 0.9}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <InputTextComp
              placeholder={'Shop Name'}
              value={shopName}
              onChangeText={text => setShopName(text)}
            />
            <InputTextComp
              placeholder={'Currency'}
              value={shopCurrecny}
              onChangeText={text => setShopCurrecny(text)}
              extraStyle={{marginTop: 10}}
            />
            <InputTextComp
              placeholder={'Delivery Charges Of (1KM)'}
              keyboardType="number-pad"
              value={deliveryCharges}
              onChangeText={text => setDeliveryCharges(text)}
              extraStyle={{marginTop: 10}}
            />

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 0.5}}>
                <SelectionComp
                  label={openTime}
                  placeHolder={'open time'}
                  onPress={() => {
                    setCurrentTimeField('open');
                    setShowDatePicker(true);
                  }}
                  type="time"
                />
              </View>
              <View style={{flex: 0.5, marginLeft: 5}}>
                <SelectionComp
                  label={closeTime}
                  onPress={() => {
                    setCurrentTimeField('close');
                    setShowDatePicker(true);
                  }}
                  placeHolder={'close time'}
                  type="time"
                />
              </View>
            </View>

            <SelectionComp
              label={
                shopSelectedCategory === undefined
                  ? 'Select Shop Category'
                  : shopSelectedCategory.name
              }
              placeHolder={'category'}
              extraStyle={{marginTop: 10}}
              onPress={() => {
                if (shopCategories !== undefined) {
                  setShowItemPicker(true);
                }
              }}
              type="category"
            />

            <SelectionComp
              label={
                shopLocation === undefined
                  ? 'Shop Location'
                  : shopLocation.address
              }
              placeHolder={'location'}
              extraStyle={{marginTop: 10}}
              type="location"
              onPress={() => {
                setShowMap(true);
              }}
            />

            {/* <SelectionComp
              label={shopSelectedCurrecny.name}
              placeHolder={'Currency'}
              extraStyle={{marginTop: 10}}
              onPress={() => {
                if (shopSelectedCurrecny !== undefined) {
                  setShowCurrencyPicker(true);
                }
              }}
              type="category"
            /> */}
            <Text
              style={{
                marginTop: 20,
                color: 'black',
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
              }}>
              Select Shop Open Days
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderWidth: 1,
                borderColor: COLORS.gray_100,
                padding: 10,
                marginTop: 10,
                borderRadius: 5,
              }}>
              {days.map((item, i) => {
                return (
                  <TouchableOpacity key={i} onPress={() => _addDays(item)}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: selectedDays.includes(item)
                          ? COLORS.blue_200
                          : COLORS.gray_100,
                        marginRight: 10,
                        paddingVertical: 2,
                        paddingHorizontal: 10,
                        marginBottom: 10,
                        borderRadius: 5,
                        backgroundColor: selectedDays.includes(item)
                          ? COLORS.blue_200
                          : 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: selectedDays.includes(item)
                            ? 'white'
                            : 'black',
                          fontFamily: 'Poppins-Regular',
                        }}>
                        {item}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text
              style={{
                marginTop: 20,
                fontSize: 20,
                color: 'black',
                fontFamily: 'Poppins-Regular',
              }}>
              Upload Images
            </Text>
            <View style={{flexDirection: 'row', marginBottom: 50}}>
              <View style={{flex: 0.3}}>
                <ImagePickerComp
                  extraStyle={{marginTop: 10}}
                  image={
                    shopKeeperImage !== undefined
                      ? shopKeeperImage.assets[0].uri
                      : shop !== undefined
                      ? shop.skImage
                      : undefined
                  }
                  onPress={() => _pickImage('shopKeeper')}
                  label={'Shop Keeper'}
                />
              </View>
              <View style={{flex: 0.7, marginLeft: 5}}>
                <ImagePickerComp
                  extraStyle={{marginTop: 10}}
                  image={
                    shopImage !== undefined
                      ? shopImage.assets[0].uri
                      : shop !== undefined
                      ? shop.shopImage
                      : undefined
                  }
                  onPress={() => _pickImage('shop')}
                  label={'Shop Image'}
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{flex: 0.1}}>
          <ButtonCompReact
            label={shop === undefined ? 'Create Shop' : 'Update Shop'}
            bgColor={COLORS.blue_200}
            extraStyle={{marginTop: 20}}
            onPress={() => _createShop()}
          />
        </View>
      </View>
    </View>
  );
}
