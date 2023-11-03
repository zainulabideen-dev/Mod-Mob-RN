import {View, Text, TouchableOpacity, Modal, StatusBar} from 'react-native';
import React, {useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import {COLORS} from '../config/colors';
import Fontisto from 'react-native-vector-icons/Fontisto';
import ButtonComp from './ButtonComp';

export default function PlaceOrderFilterComp({
  currentStatus,
  onCloseFilter,
  showDatePicker,
  filterDate,
  applyFilters,
  clearFilter,
  metaData,
}) {
  const [cFilter, setCFilter] = useState(currentStatus);
  let orderStatusArray = metaData?.sellsOrderStatus;

  return (
    <Modal transparent={true} visible={true}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.35)',
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              padding: 15,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                Select Filters
              </Text>
              <TouchableOpacity onPress={() => onCloseFilter()}>
                <Entypo name="cross" size={25} color="black" />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontWeight: '600',
                textDecorationLine: 'underline',
                marginTop: 20,
              }}>
              Order Status
            </Text>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
              {orderStatusArray.map((item, i) => {
                return (
                  <View key={i}>
                    <TouchableOpacity onPress={() => setCFilter(item)}>
                      <View
                        style={{
                          borderColor: item === cFilter ? '#3498DB' : 'black',
                          borderWidth: 1,
                          marginRight: 5,
                          paddingHorizontal: 12,
                          marginBottom: 10,
                          borderRadius: 12,
                          paddingVertical: 3,
                          alignItems: 'center',
                          backgroundColor:
                            item === cFilter ? '#3498DB' : '#CCD1D1',
                        }}>
                        <Text
                          style={{
                            color: item === cFilter ? 'white' : 'black',
                          }}>
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => {
                showDatePicker();
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: COLORS.gray_100,
                  paddingVertical: 15,
                  paddingHorizontal: 10,
                  borderRadius: 5,
                  marginTop: 10,
                }}>
                <Text>{filterDate}</Text>
                <Fontisto name="date" size={20} color={'black'} />
              </View>
            </TouchableOpacity>
            <ButtonComp
              label={'Apply Filters'}
              bgColor={COLORS.blue_200}
              extraStyle={{marginTop: 20}}
              onPress={() => applyFilters(cFilter, filterDate)}
            />
            <ButtonComp
              label={'Clear Filters'}
              bgColor={COLORS.blue_200}
              extraStyle={{marginTop: 20}}
              onPress={() => clearFilter()}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
