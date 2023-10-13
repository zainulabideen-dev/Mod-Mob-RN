import React from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const ShowFullImageModal = ({visible, closeModal, currectProduct}) => {
  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
        }}>
        <View
          style={{
            margin: 10,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <TouchableWithoutFeedback onPress={() => closeModal()}>
            <AntDesign name="close" size={20} color={'white'} />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            borderRadius: 5,
            flex: 1,
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: Dimensions.get('window').height / 2,
            }}>
            <Image
              style={{
                width: '100%',
                height: '100%',
              }}
              source={{uri: currectProduct?.photo}}
            />
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
