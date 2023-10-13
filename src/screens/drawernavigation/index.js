import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawerComp from '../../components/CustomDrawerComp';
import OnlineSellerScreen from './onlineseller';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FavouriteSellerScreen from './favouriteseller';
import PlaceOrdersScreen from './placeorders';
import MyOnlineShopScreen from './onlineshop';
import {useEffect, useState} from 'react';
import {_getFromAsyncStorage} from '../../config/asyncstorage';
import {asyncStorageKeys} from '../../config/constants';

const Drawer = createDrawerNavigator();

export default function DrawerNavigationScreen() {
  const [userLoggedIn, setUserLoggedIn] = useState();

  useEffect(() => {
    _getUSerLoggedIn();
  }, []);

  async function _getUSerLoggedIn() {
    let user = await _getFromAsyncStorage(asyncStorageKeys.user);
    if (user) {
      let userJSON = JSON.parse(user);
      setUserLoggedIn(userJSON);
    }
  }

  if (userLoggedIn === undefined) return;

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerComp {...props} />}
      screenOptions={{
        drawerLabelStyle: {fontSize: 16, fontFamily: 'Poppins-Regular'},
        headerShown: false,
        drawerStyle: {
          padding: 5,
          backgroundColor: '#2C3E50',
        },
        drawerItemStyle: {borderRadius: 25, paddingLeft: 5},
        drawerActiveTintColor: 'black',
        drawerActiveBackgroundColor: 'white',
        drawerInactiveTintColor: 'white',
      }}
      initialRouteName="Online Sellers">
      <Drawer.Screen
        options={{
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name={'person-pin'}
              style={{
                fontSize: 25,
                color: focused ? 'black' : 'white',
              }}
            />
          ),
        }}
        name="Online Sellers"
        initialParams={{
          user: userLoggedIn.user,
          shop: userLoggedIn.shop,
          isCustomer: true,
        }}
        component={OnlineSellerScreen}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name={'favorite'}
              style={{
                fontSize: 25,
                color: focused ? 'black' : 'white',
              }}
            />
          ),
        }}
        name="Favourite Sellers"
        initialParams={{
          user: userLoggedIn.user,
          shop: userLoggedIn.shop,
          isCustomer: true,
        }}
        component={FavouriteSellerScreen}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({focused, size}) => (
            <MaterialIcons
              name={'shopping-basket'}
              style={{
                fontSize: 25,
                color: focused ? 'black' : 'white',
              }}
            />
          ),
        }}
        name="Placed Orders"
        initialParams={{
          user: userLoggedIn.user,
          shop: userLoggedIn.shop,
          isCustomer: true,
        }}
        component={PlaceOrdersScreen}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({focused, size}) => (
            <Entypo
              name={'shop'}
              style={{
                fontSize: 25,
                color: focused ? 'black' : 'white',
              }}
            />
          ),
        }}
        name="My Online Shop"
        initialParams={{
          user: userLoggedIn.user,
          shop: userLoggedIn.shop,
          isCustomer: false,
        }}
        component={MyOnlineShopScreen}
      />
    </Drawer.Navigator>
  );
}
