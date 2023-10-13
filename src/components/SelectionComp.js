import React from 'react';
import {View, Text, TouchableWithoutFeedback} from 'react-native';
import {COLORS} from '../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';

export default function SelectionComp({
  extraStyle,
  label,
  type,
  onPress,
  placeHolder,
}) {
  const ImageComp = ({color}) => {
    if (type === 'time') {
      return <Ionicons name="time" size={20} color={color} />;
    } else if (type === 'location') {
      return <Entypo name="location-pin" size={20} color={color} />;
    } else if (type === 'category') {
      return <Feather name="chevron-down" size={20} color={color} />;
    } else if (type === 'date') {
      return <Fontisto name="date" size={20} color={color} />;
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => onPress()}>
      <View>
        <View
          style={[
            extraStyle,
            {
              borderWidth: 1,
              borderColor: COLORS.gray_100,
              paddingVertical: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 10,
              borderRadius: 5,
            },
          ]}>
          <View style={{flex: 0.8}}>
            <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
              {label}
            </Text>
          </View>
          <View
            style={{
              flex: 0.2,
              alignItems: 'flex-end',
            }}>
            <ImageComp color={'black'} />
          </View>
        </View>
        <Text style={{textAlign: 'right', fontFamily: 'Poppins-Regular'}}>
          {placeHolder}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
