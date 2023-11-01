import {View, Text, StatusBar, Linking} from 'react-native';
import React from 'react';
import ButtonCompReact from '../../components/ButtomCompReact';
import {COLORS} from '../../config/colors';

export default function AppUpdateScreen({route}) {
  let {metaData} = route.params;
  let metaDataJSON = metaData;

  return (
    <View
      style={{
        flex: 1,
        padding: 15,
        justifyContent: 'center',
      }}>
      <StatusBar backgroundColor="black" />
      <Text
        style={{
          fontFamily: 'Poppins-Bold',
          fontSize: 20,
          color: 'black',
          textAlign: 'center',
        }}>
        Time to Update!
      </Text>
      <Text
        style={{
          fontFamily: 'Poppins-Regular',
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
        }}>
        {metaDataJSON.appUpdateMessage}
      </Text>
      <View>
        <ButtonCompReact
          label={'Update APP'}
          bgColor={COLORS.green_100}
          extraStyle={{marginTop: 20}}
          onPress={() =>
            Linking.openURL(
              'http://play.google.com/store/apps/details?id=com.modrn',
            )
          }
        />
      </View>
    </View>
  );
}
