import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {APP_NAME} from '../config/constants';

export default function HomeOptionsComp({title, navigation}) {
  let mb = 0;
  let mt = 0;
  let resizeMode = 'cover';
  let image = require('../assets/customers.png');
  if (title == APP_NAME) {
    mb = 30;
    mt = 45;
    image = require('../assets/becomeSeller.jpeg');
    resizeMode = 'contain';
  }

  return (
    <ImageBackground
      resizeMode={resizeMode}
      borderRadius={20}
      source={image}
      style={{
        flex: 0.5,
        width: '100%',
        alignItems: 'center',
        marginBottom: mb,
        marginTop: mt,
      }}>
      <Text
        style={
          title === 'Customer' ? styles.customerText : styles.onlineSellerText
        }>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('UserNavHomeScreen', {
            title,
          })
        }
        style={{
          position: 'absolute',
          bottom: -30,
        }}>
        <View
          style={{
            width: 60,
            height: 60,
            backgroundColor: 'white',
            borderRadius: 30,
            borderColor: 'black',
            borderWidth: 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AntDesign name="right" size={25} color={'black'} />
        </View>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  customerText: {
    margin: 15,
    textAlign: 'left',
    fontSize: 25,
    color: 'black',
    fontFamily: 'Poppins-Regular',
    width: '100%',
    paddingHorizontal: 20,
  },
  onlineSellerText: {
    margin: 15,
    textAlign: 'left',
    fontSize: 25,
    color: 'white',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 10,
    fontFamily: 'Poppins-Regular',
    width: '100%',
  },
});
