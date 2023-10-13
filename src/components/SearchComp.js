import React from 'react';
import {View, Text, TextInput} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function SearchComp({extraStyle, onTextChange, pH = 'Search'}) {
  return (
    <View
      style={[
        extraStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 15,
          borderRadius: 25,
          elevation: 1,
          borderColor: '#566573',
          borderWidth: 1,
          backgroundColor: 'white',
        },
      ]}>
      <View style={{flex: 0.1}}>
        <AntDesign name="search1" size={20} color={'#566573'} />
      </View>
      <View style={{flex: 0.9}}>
        <TextInput onChangeText={text => onTextChange(text)} placeholder={pH} />
      </View>
    </View>
  );
}
