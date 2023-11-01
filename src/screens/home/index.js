import {StatusBar, View} from 'react-native';
import React from 'react';
import HeaderComp from '../../components/HeaderComp';
import {_getFromAsyncStorage} from '../../config/asyncstorage';
import HomeOptionsComp from '../../components/HomeOptionsComp';
import {useSelector} from 'react-redux';
import ProfileComp from '../../components/ProfileComp';

export default function HomeScreen({navigation}) {
  const appStates = useSelector(state => state.appStoredData);
  let user = appStates?.user;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <StatusBar backgroundColor={'#1ABC9C'} />
      <HeaderComp
        title={'Meri Online Dukan'}
        navigation={navigation}
        logout={true}
      />
      <View
        style={{
          flex: 1,
          padding: 10,
        }}>
        <ProfileComp user={user} navigation={navigation} />
        <HomeOptionsComp
          title={'Customer'}
          desc={'Buy your favourite products online'}
          image={require('../../assets/target.png')}
          navigation={navigation}
        />
        <HomeOptionsComp
          title={'ShopKeeper'}
          desc={'Create and manage your own online shop'}
          image={require('../../assets/shop_icon.png')}
          navigation={navigation}
        />
      </View>
    </View>
  );
}
