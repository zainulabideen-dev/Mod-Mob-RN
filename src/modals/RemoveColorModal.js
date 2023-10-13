import React, {useState} from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {COLORS} from '../config/colors';
import ButtonCompReact from '../components/ButtomCompReact';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const RemoveColorModal = ({
  visible,
  submit,
  onCloseModal,
  currentProduct,
}) => {
  const [productColors, setProductColors] = useState([]);

  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
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
              Pick Product Color
            </Text>

            <TouchableOpacity onPress={() => onCloseModal()}>
              <Entypo name="cross" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <View style={{marginTop: 15, marginBottom: 15}}>
            <Text
              style={{
                color: 'black',
                fontSize: 17,
                fontFamily: 'Poppins-Regular',
              }}>
              Available Colors:
            </Text>
            <View
              style={{
                flexDirection: 'row',
              }}>
              {currentProduct.colors.split(',').map((item, i) => {
                let bol = false;
                if (productColors.includes(item)) {
                  bol = true;
                }
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      setProductColors([item]);
                    }}>
                    <View
                      style={{
                        width: 30,
                        height: 30,
                        backgroundColor: item,
                        marginRight: 5,
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {bol ? (
                        <AntDesign name="check" color="white" size={15} />
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <ButtonCompReact
            label={'Submit'}
            bgColor={COLORS.green_100}
            extraStyle={{marginTop: 20}}
            onPress={() => submit(productColors)}
          />
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
