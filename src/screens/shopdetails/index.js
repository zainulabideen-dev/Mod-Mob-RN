import {View, Text} from 'react-native';
import React, {useState} from 'react';
import HeaderComp from '../../components/HeaderComp';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {COLORS} from '../../config/colors';
import SellerInfoScreen from './SellerInfo';
import SellerProductsScreen from './SellerProducts';
import {_getFromAsyncStorage} from '../../config/asyncstorage';
import ShopSettingsScreen from './ShopSettings';
import PlaceOrdersScreen from '../drawernavigation/placeorders';
import SellerRatingsScreen from './SellerRatings';

const Tab = createBottomTabNavigator();

export default function ShopDetailsScreen({route, navigation}) {
  const {userLoggedIn, shop, isCustomer, metaData} = route.params;
  let user = userLoggedIn.user;

  const [addIcon, setAddIcon] = useState(false);

  return (
    <View style={{flex: 1}}>
      <HeaderComp
        title={isCustomer ? 'Seller Shop Details' : 'My Online Shop'}
        navigation={navigation}
        backPress={isCustomer}
      />
      <Tab.Navigator
        screenListeners={tab => {
          if (tab.route.name == 'Products') setAddIcon(true);
          else setAddIcon(false);
        }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            height: 60,
            borderTopColor: 'black',
          },
        }}>
        <Tab.Screen
          options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text
                style={{
                  color: focused ? COLORS.blue_200 : COLORS.gray_200,
                  marginBottom: 5,
                  fontWeight: focused ? '500' : 'normal',
                }}>
                Info
              </Text>
            ),
            tabBarIcon: ({color, size, focused}) => (
              <AntDesign
                size={20}
                name="infocirlce"
                color={focused ? COLORS.blue_200 : COLORS.gray_200}
              />
            ),
          }}
          name="Info"
          initialParams={{shop, userLoggedIn, isCustomer}}
          component={SellerInfoScreen}
        />

        <Tab.Screen
          options={{
            tabBarLabel: ({focused, color, size}) => (
              <Text
                style={{
                  color: focused ? COLORS.blue_200 : COLORS.gray_200,
                  marginBottom: 5,
                  fontWeight: focused ? '500' : 'normal',
                }}>
                Products
              </Text>
            ),
            tabBarIcon: ({color, size, focused}) => (
              <Entypo
                size={20}
                name="box"
                color={focused ? COLORS.blue_200 : COLORS.gray_200}
              />
            ),
          }}
          name="Products"
          initialParams={{
            shop,
            userLoggedIn,
            isCustomer,
            metaData,
          }}
          component={SellerProductsScreen}
        />

        {!isCustomer ? (
          <Tab.Screen
            options={{
              tabBarLabel: ({focused, color, size}) => (
                <Text
                  style={{
                    color: focused ? COLORS.blue_200 : COLORS.gray_200,
                    marginBottom: 5,
                    fontWeight: focused ? '500' : 'normal',
                  }}>
                  Orders
                </Text>
              ),
              tabBarIcon: ({color, size, focused}) => (
                <FontAwesome
                  size={20}
                  name="shopping-cart"
                  color={focused ? COLORS.blue_200 : COLORS.gray_200}
                />
              ),
            }}
            name="Orders"
            initialParams={{
              user,
              shop,
              isCustomer,
            }}
            component={PlaceOrdersScreen}
          />
        ) : null}

        {!isCustomer ? (
          <Tab.Screen
            options={{
              tabBarLabel: ({focused, color, size}) => (
                <Text
                  style={{
                    color: focused ? COLORS.blue_200 : COLORS.gray_200,
                    marginBottom: 5,
                    fontWeight: focused ? '500' : 'normal',
                  }}>
                  More
                </Text>
              ),
              tabBarIcon: ({color, size, focused}) => (
                <Fontisto
                  size={20}
                  name="player-settings"
                  color={focused ? COLORS.blue_200 : COLORS.gray_200}
                />
              ),
            }}
            name="Settings"
            initialParams={{
              user,
              shop,
              isCustomer,
            }}
            component={ShopSettingsScreen}
          />
        ) : null}
        {isCustomer ? (
          <Tab.Screen
            options={{
              tabBarLabel: ({focused, color, size}) => (
                <Text
                  style={{
                    color: focused ? COLORS.blue_200 : COLORS.gray_200,
                    marginBottom: 5,
                    fontWeight: focused ? '500' : 'normal',
                  }}>
                  Ratings
                </Text>
              ),
              tabBarIcon: ({color, size, focused}) => (
                <AntDesign
                  size={20}
                  name="star"
                  color={focused ? COLORS.blue_200 : COLORS.gray_200}
                />
              ),
            }}
            name="Ratings"
            initialParams={{
              shop,
              isCustomer,
              userLoggedIn,
            }}
            component={SellerRatingsScreen}
          />
        ) : null}
      </Tab.Navigator>
    </View>
  );
}
