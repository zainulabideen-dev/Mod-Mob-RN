import React, {useState} from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {SIGN_OUT, _getAxiosHeaders, axiosClient} from '../config/apis';
import {toastShow} from '../config/toastmessage';

export const LogoutModal = ({visible, closeModal, logout}) => {
  const appStates = useSelector(state => state.appStoredData);
  let {user} = appStates?.user;

  const [loading, setLoading] = useState(false);

  async function _logout() {
    try {
      let params = {
        userId: user?.id,
        userType: 'mob',
      };
      console.log(params);
      setLoading(true);
      let res = await axiosClient.post(
        SIGN_OUT,
        params,
        _getAxiosHeaders(user?.token),
      );
      setLoading(false);
      console.log(res.data);
      if (res.status === 200) {
        if (res.data.status === '200') {
          toastShow('success', res.data.message);
          logout();
        }
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
          justifyContent: 'center',
          padding: 15,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              alignItems: 'center',
              padding: 10,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 17,
                fontFamily: 'Poppins-Regular',
                includeFontPadding: false,
              }}>
              Are you sure you want to logout?
            </Text>
            <View style={{marginTop: 20, flexDirection: 'row'}}>
              {loading ? (
                <Text
                  style={{
                    color: 'black',
                    fontFamily: 'Poppins-Regular',
                    includeFontPadding: false,
                  }}>
                  Logging Out Please Wait...
                </Text>
              ) : (
                <>
                  <TouchableOpacity onPress={() => closeModal()}>
                    <Text
                      style={{
                        backgroundColor: '#E74C3C',
                        paddingVertical: 5,
                        width: 70,
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: 15,
                      }}>
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => _logout()}>
                    <Text
                      style={{
                        backgroundColor: '#1ABC9C',
                        paddingVertical: 5,
                        width: 70,
                        color: 'white',
                        textAlign: 'center',
                        borderRadius: 15,
                        marginLeft: 10,
                      }}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
  },
  map: {flex: 1},
});
