import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../config/colors';
import {_numberWithCommas} from '../config/constants';
import {ScrollView} from 'react-native-gesture-handler';

export default function PlacedOrdersComp({
  metaStatus,
  cancleOrder,
  item,
  isCustomer,
  showDetails,
  updateStatus,
}) {
  const [showUpdate, setShowUpdate] = useState(false);

  return (
    <View
      style={{
        backgroundColor: 'white',
        borderRadius: 7,
        elevation: 2,
        marginBottom: 5,
      }}>
      <View
        style={{
          paddingHorizontal: 5,
          paddingVertical: 5,
        }}>
        <View style={{paddingLeft: 10}}>
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: 17,
                  color: 'black',
                  fontWeight: 'bold',
                }}>
                {item.orderDate}
              </Text>
              <Text style={{color: 'black'}}>Order # {item.id}</Text>
            </View>
          </View>
          <Text style={{color: 'black'}}>Shop Name: {item?.shopName}</Text>

          <Text style={{color: 'black'}}>Total Items: {item.totalItems}</Text>
          <Text style={{color: 'black'}}>
            Total Price: {_numberWithCommas(item.totalPrice)}{' '}
            {`${item?.currency}`}
          </Text>
        </View>
      </View>
      <View style={{backgroundColor: COLORS.gray_100, height: 1}} />
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomEndRadius: 7,
          borderBottomStartRadius: 7,
        }}>
        <View
          style={{
            flex: 0.4,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {!isCustomer ? (
            <TouchableOpacity onPress={() => setShowUpdate(!showUpdate)}>
              <View
                style={{
                  borderColor: '#3498DB',
                  borderWidth: 1,
                  marginRight: 5,
                  paddingHorizontal: 15,
                  borderRadius: 17,
                  paddingVertical: 5,
                  alignItems: 'center',
                  backgroundColor: '#3498DB',
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Update Status
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            flex: 0.3,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity onPress={() => showDetails(item)}>
            <View
              style={{
                borderColor: '#3498DB',
                borderWidth: 1,
                marginRight: 5,
                paddingHorizontal: 15,
                borderRadius: 17,
                paddingVertical: 5,
                alignItems: 'center',
                backgroundColor: '#3498DB',
              }}>
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                }}>
                Details
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 0.3, alignItems: 'flex-end'}}>
          {item?.orderStatus === 'Pending' ? (
            <TouchableOpacity onPress={() => cancleOrder(item)}>
              <View
                style={{
                  borderColor: '#E74C3C',
                  borderWidth: 1,
                  marginRight: 5,
                  paddingHorizontal: 15,
                  borderRadius: 17,
                  paddingVertical: 5,
                  alignItems: 'center',
                  backgroundColor: '#E74C3C',
                }}>
                <Text
                  style={{
                    color: 'white',
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {showUpdate ? (
        <View
          style={{
            borderTopColor: '#CCD1D1',
            borderTopWidth: 1,
            paddingHorizontal: 15,
            paddingVertical: 10,
          }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {metaStatus.map((ordStatus, _i) => {
              return (
                <TouchableOpacity
                  key={_i}
                  onPress={() => updateStatus(item, ordStatus)}>
                  <View
                    style={{
                      borderColor: '#28B463',
                      borderWidth: 1,
                      marginRight: 5,
                      paddingHorizontal: 15,
                      borderRadius: 17,
                      paddingVertical: 5,
                      alignItems: 'center',
                      backgroundColor: '#28B463',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                      }}>
                      {ordStatus}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
