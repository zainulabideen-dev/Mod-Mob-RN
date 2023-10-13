import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function ButtonComp({extraStyle, bgColor, label, onPress}) {
  return (
    <TouchableOpacity
      onPress={() => onPress()}
      style={[
        extraStyle,
        {
          backgroundColor: bgColor,
          paddingVertical: 10,
          borderRadius: 5,
        },
      ]}>
      <View>
        <Text style={{color: 'white', textAlign: 'center', fontWeight: '600'}}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
