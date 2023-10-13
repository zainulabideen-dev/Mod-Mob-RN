import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';

export default function ButtonCompReact({extraStyle, bgColor, label, onPress}) {
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
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontFamily: 'Poppins-Regular',
          }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
