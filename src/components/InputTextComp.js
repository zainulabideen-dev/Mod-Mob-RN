import {View, Text, TextInput} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from '../config/colors';

export default function InputTextComp({
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  onChangeText,
  extraStyle,
  hint,
  value,
}) {
  return (
    <View>
      <View
        style={[
          extraStyle,
          {
            borderBottomWidth: 1,
            borderBottomColor: COLORS.gray_100,
          },
        ]}>
        <TextInput
          value={value}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          placeholder={placeholder}
          onChangeText={text => {
            onChangeText(text);
          }}
          style={{
            fontSize: 17,
            fontWeight: '400',
            fontFamily: 'Poppins-Regular',
          }}
        />
      </View>
      {hint ? (
        <Text
          style={{
            textAlign: 'right',
            color: COLORS.gray_200,
          }}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
