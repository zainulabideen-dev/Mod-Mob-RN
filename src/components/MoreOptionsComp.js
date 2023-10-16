import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function MoreOptionsComp({showHide, list, onPress}) {
  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 2,
        backgroundColor: 'white',
        bottom: 0,
        width: '100%',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#D5DBDB',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            color: 'black',
            fontSize: 17,
            color: 'black',
            fontFamily: 'Poppins-Regular',
          }}>
          More Options
        </Text>
        <TouchableWithoutFeedback onPress={() => showHide(false)}>
          <AntDesign name="close" size={20} color={'black'} />
        </TouchableWithoutFeedback>
      </View>

      <View
        style={{
          marginTop: 15,
        }}>
        {list.map((item, _i) => {
          return (
            <TouchableOpacity
              key={_i}
              style={{marginBottom: 15}}
              onPress={() => {
                onPress(item);
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  borderBottomWidth: 1,
                  borderBottomColor: '#D5DBDB',
                  paddingBottom: 5,
                }}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* <View
            style={{
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowMoreOptions(false);
                navigation.navigate('CreateProductScreen', {
                  userLoggedIn,
                  metaData,
                  item: currectProduct,
                });
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  borderBottomWidth: 1,
                  borderBottomColor: '#D5DBDB',
                  paddingBottom: 5,
                }}>
                Update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowMoreOptions(false);
                _deleteProduct(currectProduct);
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  marginTop: 10,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View> */}
    </View>
  );
}
