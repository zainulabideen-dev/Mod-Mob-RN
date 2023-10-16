import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../config/colors';
import {_numberWithCommas} from '../config/constants';
import {ScrollView} from 'react-native-gesture-handler';

export default function PlacedOrdersComp({
  metaStatus,
  item,
  isCustomer,
  showDetails,
  metaData,
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
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              let actions = ['Details'];
              if (item?.orderStatus === 'Pending') {
                actions.push('Cancel');
              }
              actions.push(
                `Change Status to ${
                  metaData?.sellsOrderStatus[
                    metaData?.sellsOrderStatus.indexOf(item?.orderStatus) + 1
                  ]
                }`,
              );
              console.log(actions);
              showDetails(item, actions);
            }}>
            <View
              style={{
                borderColor: '#3498DB',
                borderWidth: 1,
                marginRight: 5,
                paddingHorizontal: 25,
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
                More
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
