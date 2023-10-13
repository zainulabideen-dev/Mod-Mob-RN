import React, {useEffect, useState} from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import SearchComp from '../components/SearchComp';

export const SearchSelectionModal = ({
  visible,
  title,
  onCloseModal,
  onSelected,
  data = [],
}) => {
  const [filterData, setFilterData] = useState(data);

  useEffect(() => {
    if (visible) {
      setFilterData(data);
    }
  }, [visible]);

  function _applyFilter(text) {
    setFilterData(
      data.filter(item => item.name.toLowerCase().includes(text.toLowerCase())),
    );
  }

  const ItemsComp = ({item}) => {
    return (
      <TouchableOpacity onPress={() => onSelected(item)}>
        <View
          style={{
            borderWidth: 1,
            borderColor: 'black',
            paddingVertical: 7,
            paddingHorizontal: 20,
            borderRadius: 25,
            marginRight: 5,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {item.photo !== '' ? (
            <Image
              style={{
                width: 30,
                height: 30,
              }}
              source={{uri: item.photo}}
            />
          ) : null}
          <Text
            style={{
              color: 'black',
              fontFamily: 'Poppins-Regular',
              marginLeft: 10,
            }}>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
            backgroundColor: '#F8F9F9',
            padding: 15,
            borderRadius: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20,
              paddingHorizontal: 5,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
              }}>
              {title}
            </Text>
            <TouchableOpacity onPress={() => onCloseModal()}>
              <Entypo name="cross" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <SearchComp onTextChange={text => _applyFilter(text)} />
          <ScrollView
            style={{
              height: 300,
              marginTop: 10,
            }}>
            <View
              style={{
                marginTop: 10,
              }}>
              {filterData.map(item => {
                return <ItemsComp key={item.id} item={item} />;
              })}
            </View>
          </ScrollView>
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
