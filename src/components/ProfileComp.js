import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../config/colors';

export default function ProfileComp({user, navigation}) {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('UserInfoScreen', {
          back: true,
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
        <View style={{flexDirection: 'row'}}>
          <View>
            <Image
              style={{
                width: 40,
                height: 40,
              }}
              source={{uri: user?.user?.photo}}
            />
          </View>
          <View style={{marginLeft: 20}}>
            <Text
              style={{
                fontSize: 18,
                color: 'black',
                fontFamily: 'Poppins-Regular',
                includeFontPadding: false,
              }}>
              {user?.user?.name}
            </Text>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                includeFontPadding: false,
              }}>
              {user?.user?.email}
            </Text>
          </View>
        </View>
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
