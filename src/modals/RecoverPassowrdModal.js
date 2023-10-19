import React, {useState} from 'react';
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
import {VERFIY_CODE, axiosClient} from '../config/apis';

export const RecoverPassowrdModal = ({visible, onCloseModal}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [newPass, setNewPass] = useState('');

  async function _sendCode() {
    if (email === '') {
      toastShow('error', 'please provide email');
      return;
    }

    setLoading(true);
    let params = {
      email: email,
      code: code,
      newPass: newPass,
    };

    //console.log(params);

    try {
      const {data, status} = await axiosClient.post(VERFIY_CODE, params);
      setLoading(false);
      if (status == 200) {
        if (data.status === '200') {
          ToastAndroid.showWithGravityAndOffset(
            data.message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          onCloseModal();
        } else {
          setError(data.message);
          setTimeout(() => {
            setError('');
          }, 3000);
        }
      }
    } catch (error) {
      setLoading(false);
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
                marginBottom: 20,
              }}>
              Recover Passowrd
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
          <InputTextComp
            placeholder={'Verification code'}
            hint={'Verification Code'}
            onChangeText={text => {
              setCode(text);
            }}
          />
          <InputTextComp
            placeholder={'new password'}
            hint={'New Password'}
            onChangeText={text => {
              setNewPass(text);
            }}
          />
          <ButtonCompReact
            label={loading ? 'Loading Please Wait...' : 'Recover Passowrd'}
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
