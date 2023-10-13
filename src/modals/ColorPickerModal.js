import React, {useState} from 'react';
import {Modal, StatusBar, Text, View} from 'react-native';
import {ColorPicker} from 'react-native-color-picker';
import ButtonCompReact from '../components/ButtomCompReact';
import {COLORS} from '../config/colors';

export const ColorPickerModal = ({visible, onCofirm, onClose}) => {
  const [color, setColor] = useState();

  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View style={{flex: 1, backgroundColor: 'white', padding: 10}}>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 20,
            color: 'black',
            textAlign: 'center',
          }}>
          Pick Product Colour
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            color: COLORS.gray_200,
            textAlign: 'center',
          }}>
          Click on round circle to select your colour
        </Text>
        <ColorPicker
          onColorSelected={color => setColor(color)}
          style={{flex: 1}}
        />
        {color !== undefined ? (
          <ButtonCompReact
            label={'Confirm'}
            bgColor={COLORS.blue_200}
            extraStyle={{marginTop: 20}}
            onPress={() => onCofirm(color)}
          />
        ) : null}
        <ButtonCompReact
          label={'Close'}
          bgColor={'#2C3E50'}
          extraStyle={{marginTop: 10}}
          onPress={() => onClose()}
        />
      </View>
    </Modal>
  );
};
