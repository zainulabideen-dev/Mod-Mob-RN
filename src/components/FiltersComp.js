import {View, Text, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';

export default function FiltersComp({onPress, appliedFilters = ''}) {
  return (
    <TouchableWithoutFeedback onPress={() => onPress()}>
      <View style={{backgroundColor: 'white', padding: 10, borderRadius: 5}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color: 'black',
              fontSize: 15,
            }}>{`Filters ${appliedFilters !== '' ? appliedFilters : ''}`}</Text>
          <Feather name="chevron-down" size={20} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
