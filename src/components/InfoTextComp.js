import {View, Text} from 'react-native';
import React from 'react';
import {COLORS} from '../config/colors';

export default function InfoTextComp({extraStyle, heading, subHeading}) {
  return (
    <View style={[{marginBottom: 10}, extraStyle]}>
      <Text>{heading}</Text>
      <Text
        style={{
          marginTop: 5,
          fontSize: 17,
          color: 'black',
          fontFamily: 'Poppins-Regular',
          marginBottom: 10,
        }}>
        {subHeading}
      </Text>
      <View style={{backgroundColor: COLORS.gray_100, height: 1}} />
    </View>
  );
}
