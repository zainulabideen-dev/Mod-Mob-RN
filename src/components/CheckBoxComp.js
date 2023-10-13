import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../config/colors';

export default function CheckBoxComp({label, isChecked, onPress}) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity onPress={() => onPress()}>
        {isChecked ? (
          <AntDesign name="checkcircle" size={20} color={COLORS.green_100} />
        ) : (
          <Feather name="circle" size={20} />
        )}
      </TouchableOpacity>

      <Text
        style={{
          marginLeft: 10,
          color: 'black',
          fontFamily: 'Poppins-Regular',
          includeFontPadding: false,
          padding: 0,
        }}>
        {label}
      </Text>
    </View>
  );
}
