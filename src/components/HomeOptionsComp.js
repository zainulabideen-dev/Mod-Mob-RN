import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../config/colors';

export default function HomeOptionsComp({title, navigation, desc, image}) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('UserNavHomeScreen', {
          title,
        })
      }
      style={{
        backgroundColor: 'white',
        elevation: 2,
        padding: 15,
        marginBottom: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EAEDED',
      }}>
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{
              width: 25,
              height: 25,
            }}
            source={image}
          />
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              fontFamily: 'Poppins-Regular',
              marginLeft: 10,
            }}>
            {title}
          </Text>
        </View>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
          }}>
          {desc}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
          }}>
          <AntDesign name="rightcircle" size={20} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  customerText: {
    margin: 15,
    textAlign: 'left',
    fontSize: 20,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    width: '100%',
    paddingHorizontal: 20,
  },
  onlineSellerText: {
    margin: 15,
    textAlign: 'left',
    fontSize: 20,
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontFamily: 'Poppins-Regular',
    width: '100%',
  },
});
