import {
  View,
  Text,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import HeaderComp from '../../components/HeaderComp';
import {
  APP_NAME,
  CUSTOMER_NAV,
  SELLER_NAV,
  createNewShopText,
} from '../../config/constants';
import UserNavList from '../../components/UserNavList';
import ButtonCompReact from '../../components/ButtomCompReact';
import {COLORS} from '../../config/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {_apiDeActivateShop, _askLocationPermission} from '../../config/apis';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {useSelector} from 'react-redux';

export default function UserNavHomeScreen({navigation, route}) {
  const appStates = useSelector(state => state.appStoredData);
  let userLoggedIn = appStates?.user;
  let metaData = appStates.metaData;

  const {title} = route.params;
  const [showLoader, setShowLoader] = useState(false);

  //console.log(userLoggedIn);

  async function _getLocationPermission() {
    let granted = await _askLocationPermission();
    if (granted === 'granted') {
      navigation.navigate('CreateOnlineShopScreen', {
        shop: undefined,
        userLoggedIn,
      });
    }
  }

  async function _deActivateShop(status) {
    setShowLoader(true);
    await _apiDeActivateShop(userLoggedIn.user, navigation, status);
    setShowLoader(false);
  }

  const NavigationComp = ({navList}) => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}>
        <AppLoaderComp visible={showLoader} />
        <HeaderComp title={title} navigation={navigation} backPress={true} />
        <Text
          style={{
            marginLeft: 10,
            fontSize: 19,
            color: 'black',
            fontWeight: '500',
            fontFamily: 'Poppins-Regular',
            includeFontPadding: false,
            textAlign: 'right',
            marginTop: 10,
            paddingRight: 25,
          }}>
          {title === 'Customer' ? `Customer Id: ${userLoggedIn?.user?.id}` : ''}
        </Text>
        <View style={{marginTop: 10, padding: 10}}>
          <FlatList
            data={navList}
            renderItem={({item}) => (
              <UserNavList
                item={item}
                navigation={navigation}
                userLoggedIn={userLoggedIn}
                metaData={metaData}
                deActivateShop={() => _deActivateShop('0')}
              />
            )}
          />
        </View>
      </View>
    );
  };

  const ReActivateComp = ({navList}) => {
    let label = '';
    let labelButton = '';
    if (userLoggedIn.shop === null) {
      label = createNewShopText;
      labelButton = 'Yes, Create My Online Shop';
    } else if (userLoggedIn?.shop?.active === '0') {
      label = 'Hello! Do you want to Re Activate Your Shop?';
      labelButton = 'Yes, Re Activate my Shop';
    }

    return (
      <View style={{flex: 1}}>
        <ImageBackground
          style={{flex: 1}}
          source={require('../../assets/becomeSeller.jpeg')}>
          <View
            style={{
              flex: 1,
              padding: 5,
            }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  marginBottom: 5,
                  marginTop: 15,
                }}>
                <AntDesign name="left" size={30} color={'white'} />
              </View>
            </TouchableOpacity>
            <View
              style={{
                backgroundColor: 'white',
                padding: 12,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 6,
                marginHorizontal: 3,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                }}>
                {label}
              </Text>

              <ButtonCompReact
                label={labelButton}
                bgColor={COLORS.blue_200}
                extraStyle={{marginTop: 20, paddingHorizontal: 15}}
                onPress={() => {
                  if (userLoggedIn.shop === null) {
                    _getLocationPermission();
                  } else if (userLoggedIn.shop.active === '0') {
                    _deActivateShop('1');
                  }
                }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  if (title === 'Customer') {
    return <NavigationComp navList={CUSTOMER_NAV} />;
  }

  if (title === APP_NAME) {
    if (userLoggedIn.shop !== null && userLoggedIn?.shop?.active === '1') {
      return <NavigationComp navList={SELLER_NAV} />;
    }
  }

  if (title !== 'Customer') {
    return <ReActivateComp />;
  }

  return <View></View>;
}
