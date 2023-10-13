import {View, Text} from 'react-native';
import React from 'react';
import {COLORS} from '../config/colors';

export default function OrComp({extraStyle}) {
  return (
    <View style={[{flexDirection: 'row', alignItems: 'center'}, extraStyle]}>
      <View style={{flex: 0.4, backgroundColor: COLORS.gray_100, height: 1}} />
      <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Or</Text>
      </View>
      <View style={{flex: 0.4, backgroundColor: COLORS.gray_100, height: 1}} />
    </View>
  );
}
