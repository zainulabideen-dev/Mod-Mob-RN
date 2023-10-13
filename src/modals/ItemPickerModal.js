import React from 'react';
import {
  Modal,
  StatusBar,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../config/colors';

export const ItemPickerModal = ({
  visible,
  list,
  label,
  onItemSelection,
  onCloseModal,
}) => {
  const PickeItems = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          onItemSelection(item);
        }}>
        <View
          style={{
            borderWidth: 1,
            borderColor: COLORS.gray_100,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: 17,
              color: 'black',
            }}>
            {item.name}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            width: '100%',
            flex: 0.5,
            backgroundColor: 'white',
            padding: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {label}
            </Text>
            <TouchableOpacity onPress={() => onCloseModal()}>
              <Entypo name="cross" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={{
              marginTop: 10,
            }}
            data={list}
            keyExtractor={list => list.id.toString()}
            renderItem={({item}) => <PickeItems item={item} />}
          />
        </View>
      </View>
    </Modal>
  );
};
