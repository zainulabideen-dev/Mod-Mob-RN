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
        bottom: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}>
      <View style={{backgroundColor: 'white', padding: 20}}>
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
      </View>
    </View>
  );
}
