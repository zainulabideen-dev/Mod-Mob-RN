import React from 'react';
import {Modal, StatusBar, View, StyleSheet, Text} from 'react-native';
import {COLORS} from '../config/colors';
import ButtonCompReact from '../components/ButtomCompReact';

export const NotificationAlertModal = ({visible, data, onCloseModal}) => {
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
            <Text style={{color: 'black', fontSize: 20, fontWeight: 'bold'}}>
              {data.title}
            </Text>
          </View>
          <View
            style={{
              marginTop: 10,
              paddingVertical: 5,
              paddingHorizontal: 5,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              borderRadius: 5,
            }}>
            <Text style={{color: 'black'}}>{data.body}</Text>
          </View>

          <ButtonCompReact
            label={'OK'}
            bgColor={COLORS.green_100}
            extraStyle={{marginTop: 20}}
            onPress={() => onCloseModal()}
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
