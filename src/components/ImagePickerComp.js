import {View, Text, Image, TouchableWithoutFeedback} from 'react-native';
import React from 'react';
import {COLORS} from '../config/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ImagePickerComp({
  extraStyle,
  label,
  onPress,
  image = undefined,
}) {
  // if (image === undefined) return;

  return (
    <TouchableWithoutFeedback onPress={() => onPress()}>
      <View>
        <View
          style={[
            extraStyle,
            {
              borderWidth: 1,
              borderColor: COLORS.gray_100,
              borderRadius: 5,
              justifyContent: 'center',
              alignItems: 'center',
              height: 100,
            },
          ]}>
          {image === undefined ? (
            <Ionicons name="ios-image-outline" size={50} />
          ) : (
            <Image
              style={{width: '100%', height: 100}}
              source={{uri: image}}
              resizeMode="cover"
            />
          )}
        </View>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
          }}>
          {label}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
