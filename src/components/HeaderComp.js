import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {_deleteFromAsyncStorage} from '../config/asyncstorage';
import {asyncStorageKeys} from '../config/constants';
import {useSelector} from 'react-redux';
import {LogoutModal} from '../modals/LogoutModal';

export default function HeaderComp({
  title,
  navigation,
  backPress = false,
  edit = false,
  logout = false,
}) {
  const appStates = useSelector(state => state.appStoredData);
  let userLoggedIn = appStates?.user;

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  async function _clearDataLogOut() {
    try {
      await _deleteFromAsyncStorage(asyncStorageKeys.user);
      await _deleteFromAsyncStorage(asyncStorageKeys.currentShop);

      //await GoogleSignin.signOut();
    } catch (error) {}

    navigation.reset({
      index: 0,
      routes: [{name: 'SplashScreen'}],
    });
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 15,
        alignItems: 'center',
        paddingHorizontal: 10,
        elevation: 5,
        backgroundColor: 'white',
      }}>
      <LogoutModal
        visible={showLogoutModal}
        logout={() => _clearDataLogOut()}
        closeModal={() => setShowLogoutModal(false)}
      />
      {backPress ? (
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <AntDesign
            style={{
              marginRight: 20,
            }}
            name={'left'}
            size={25}
            color={'black'}
          />
        </TouchableWithoutFeedback>
      ) : null}

      <View
        style={{
          flex: backPress ? 1 : 1,
          flexDirection: 'row',
        }}>
        <View style={{flex: 0.6}}>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 19,
              color: 'black',
              fontWeight: '500',
              fontFamily: 'Poppins-Regular',
              includeFontPadding: false,
            }}>
            {title}
          </Text>
        </View>
        <View
          style={{
            flex: 0.4,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}>
          <TouchableOpacity>
            <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
              }}
              source={{uri: userLoggedIn.user.photo}}
            />
          </TouchableOpacity>
          {edit ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CreateOnlineShopScreen', {
                  userLoggedIn,
                  shop: userLoggedIn.shop,
                })
              }>
              <SimpleLineIcons
                style={{
                  marginLeft: 15,
                }}
                name={'pencil'}
                size={25}
                color={'black'}
              />
            </TouchableOpacity>
          ) : null}
          {logout ? (
            <TouchableWithoutFeedback onPress={() => setShowLogoutModal(true)}>
              <MaterialIcons
                style={{
                  marginLeft: 15,
                }}
                name={'logout'}
                size={25}
                color={'black'}
              />
            </TouchableWithoutFeedback>
          ) : null}
        </View>
      </View>
    </View>
  );
}
