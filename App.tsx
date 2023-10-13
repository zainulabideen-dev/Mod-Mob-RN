// In App.js

import * as React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/screens/splash';
import OnBoardingScreen from './src/screens/onboarding';
import SignInScreen from './src/screens/signin';
import ShopDetailsScreen from './src/screens/shopdetails';
import PlaceOrderScreen from './src/screens/placeorder';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import CreateProductScreen from './src/screens/createproduct';
import CreateOnlineShopScreen from './src/screens/createshop';
import {PermissionsAndroid} from 'react-native';
import DeliveryAreasScreen from './src/screens/deliveryareas';
import SellerRatingsScreen from './src/screens/shopdetails/SellerRatings';
import PlaceOrderDetailScreen from './src/screens/orderdetails';
import messaging from '@react-native-firebase/messaging';
import TestingScreen from './src/screens/testing';
import HomeScreen from './src/screens/home';
import UserNavHomeScreen from './src/screens/UserNavHome';
import OnlineSellerScreen from './src/screens/drawernavigation/onlineseller';
import SellerInfoScreen from './src/screens/shopdetails/SellerInfo';
import SellerProductsScreen from './src/screens/shopdetails/SellerProducts';
import PlaceOrdersScreen from './src/screens/drawernavigation/placeorders';
import FavouriteSellerScreen from './src/screens/drawernavigation/favouriteseller';
import AppUpdateScreen from './src/screens/AppUpdate';
import {NotificationAlertModal} from './src/modals/NotificationAlertModal';
import UserInfoScreen from './src/screens/info';
import {Provider} from 'react-redux';
import store from './src/config/store/store';
import SelectedItemsScreen from './src/screens/selectedItems';
import SessionScreen from './src/screens/session';
import CreateAccountScreen from './src/screens/createAccount';
import ShopCustomersScreen from './src/screens/ShopCustomers';

const Stack = createNativeStackNavigator();

function App() {
  const navigationRef: any = React.createRef();

  const [showNotModal, setShowNotModal] = React.useState(false);
  const [notificationData, setNotificationData] = React.useState<any>();

  React.useEffect(() => {
    _notificationPermission();
  }, []);

  React.useEffect(() => {
    //Foreground => When App is open
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('=> FCM Foreground => ', remoteMessage.data);
      setShowNotModal(true);
      setNotificationData(remoteMessage.data);
    });

    //When app is open but user is using other apps
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('=> FCM background => ', remoteMessage.data);
      setShowNotModal(true);
      setNotificationData(remoteMessage.data);
    });

    messaging().onNotificationOpenedApp((remoteMessage: any) => {
      if (remoteMessage) {
        console.log(
          'APP OPEN BY NOTIFICATION CLICK:',
          remoteMessage.data.screen,
        );
        //setNavigateTo(remoteMessage.data.screen);
      }
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage,
          );
        }
      });

    return unsubscribe;
  }, []);

  async function _notificationPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'Please allow permission to recieve notifications on time',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  return (
    <>
      <Provider store={store}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName={'SplashScreen'}
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen
              name="SelectedItemsScreen"
              component={SelectedItemsScreen}
            />
            <Stack.Screen
              name="ShopCustomersScreen"
              component={ShopCustomersScreen}
            />
            <Stack.Screen
              name="CreateAccountScreen"
              component={CreateAccountScreen}
            />
            <Stack.Screen name="SessionScreen" component={SessionScreen} />
            <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
              name="UserNavHomeScreen"
              component={UserNavHomeScreen}
            />
            <Stack.Screen
              name="OnlineSellerScreen"
              component={OnlineSellerScreen}
            />
            <Stack.Screen
              name="SellerInfoScreen"
              component={SellerInfoScreen}
            />
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="TestingScreen" component={TestingScreen} />
            <Stack.Screen
              name="SellerRatingsScreen"
              component={SellerRatingsScreen}
            />
            <Stack.Screen
              name="OnBoardingScreen"
              component={OnBoardingScreen}
            />
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen
              name="SellerProductsScreen"
              component={SellerProductsScreen}
            />
            <Stack.Screen
              name="CreateOnlineShopScreen"
              component={CreateOnlineShopScreen}
            />
            <Stack.Screen
              name="ShopDetailsScreen"
              component={ShopDetailsScreen}
            />
            <Stack.Screen
              name="PlaceOrderScreen"
              component={PlaceOrderScreen}
            />
            <Stack.Screen
              name="PlaceOrdersScreen"
              component={PlaceOrdersScreen}
            />
            <Stack.Screen
              name="CreateProductScreen"
              component={CreateProductScreen}
            />
            <Stack.Screen
              name="DeliveryAreasScreen"
              component={DeliveryAreasScreen}
            />
            <Stack.Screen
              name="PlaceOrderDetailScreen"
              component={PlaceOrderDetailScreen}
            />
            <Stack.Screen
              name="FavouriteSellerScreen"
              component={FavouriteSellerScreen}
            />
            <Stack.Screen name="AppUpdateScreen" component={AppUpdateScreen} />
          </Stack.Navigator>
          {notificationData !== undefined ? (
            <NotificationAlertModal
              visible={showNotModal}
              data={notificationData}
              onCloseModal={() => {
                setShowNotModal(false);
                setNotificationData(undefined);
              }}
            />
          ) : null}
          <Toast position="top" topOffset={50} visibilityTime={2000} />
        </NavigationContainer>
      </Provider>
    </>
  );
}

export default App;
