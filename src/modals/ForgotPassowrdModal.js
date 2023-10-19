import React, {useEffect, useState} from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import ButtonCompReact from '../components/ButtomCompReact';
import Entypo from 'react-native-vector-icons/Entypo';
import InputTextComp from '../components/InputTextComp';
import {toastShow} from '../config/toastmessage';
import {SEND_CODE, axiosClient} from '../config/apis';

export const ForgotPassowrdModal = ({visible, onCloseModal, success}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function _sendCode() {
    if (email === '') {
      toastShow('error', 'please provide email');
      return;
    }

    setLoading(true);
    let params = {
      email: email,
    };

    try {
      const {data, status} = await axiosClient.post(SEND_CODE, params);
      setLoading(false);
      if (status == 200) {
        console.log(data);
        if (data.status === '200') {
          ToastAndroid.showWithGravityAndOffset(
            data.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          success();
        } else {
          setError(data.message);
          setTimeout(() => {
            setError('');
          }, 3000);
        }
      }
    } catch (error) {
      console.log('error sign in api => ', error);
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
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
              }}>
              Forgot Passowrd
            </Text>
            <TouchableOpacity onPress={() => onCloseModal()}>
              <Entypo name="cross" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <InputTextComp
            placeholder={'email'}
            hint={'email'}
            onChangeText={text => {
              setEmail(text);
            }}
          />
          <ButtonCompReact
            label={loading ? 'Sending Code...' : 'Send Verification Code'}
            bgColor={'black'}
            extraStyle={{marginTop: 20}}
            onPress={() => _sendCode()}
          />
          <Text
            style={{
              color: 'red',
              fontFamily: 'Poppins-Regular',
              textAlign: 'center',
            }}>
            {error}
          </Text>
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
