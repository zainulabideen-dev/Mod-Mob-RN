import {View, FlatList, Alert, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComp from '../../../components/HeaderComp';
import PlacedOrdersComp from '../../../components/PlacedOrdersComp';
import FiltersComp from '../../../components/FiltersComp';
import {
  GET_PLACE_ORDERS,
  UPDATE_ORDER_STATUS,
  _getAxiosHeaders,
  axiosClient,
} from '../../../config/apis';
import {toastShow} from '../../../config/toastmessage';
import {AppLoaderComp} from '../../../components/AppLoaderComp';
import {
  formatDate,
  placeOrderStatus,
  placeOrderStatusCustomer,
} from '../../../config/constants';
import DatePicker from 'react-native-date-picker';
import PlaceOrderFilterComp from '../../../components/PlaceOrderFilterComp';
import MoreOptionsComp from '../../../components/MoreOptionsComp';

export default function PlaceOrdersScreen({navigation, route}) {
  const {isCustomer, shop, userLoggedIn, metaData} = route.params;
  let user = userLoggedIn?.user;

  const [ordersList, setOrdersList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [currentStatus, setCurrentStatus] = useState(
    metaData?.sellsOrderStatus[0],
  );
  const [filterDate, setFilterDate] = useState('Select Date');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [currentOrder, setCurrentOrder] = useState();
  const [actions, setActions] = useState([]);

  useEffect(() => {
    _getPlacedOrders(currentStatus, filterDate);
  }, []);

  async function _getPlacedOrders(status, date) {
    let params = {
      userId: user.id,
      userType: isCustomer ? 'CST' : 'SK',
      platform: 'mob',
    };

    if (status) {
      params.status = status;
    }

    if (date !== 'Select Date') {
      params.date = date;
    }

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        GET_PLACE_ORDERS,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          setOrdersList(data.data);
        } else {
          setOrdersList([]);
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error sign in api => ', error);
      toastShow('error', 'System error sign in');
    }
  }

  function _pickDate(date) {
    setFilterDate(formatDate(date));
  }

  function _applyFilters(status, date) {
    setShowFilter(false);
    setCurrentStatus(status);
    _getPlacedOrders(status, date);
  }

  async function _updateStatus(item, type) {
    let updateStatusTo = type;

    let params = {
      userId: user.id,
      orderId: item.id,
      shopId: item.shopId,
      isCustomer,
      platform: 'mob',
      status: updateStatusTo,
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        UPDATE_ORDER_STATUS,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          _getPlacedOrders(currentStatus, filterDate);
        }
        if (data.status === '201') {
          Alert.alert('Place Order Alert', data.message, [
            {
              text: 'OK',
              onPress: () => _getPlacedOrders(currentStatus, filterDate),
            },
          ]);
        } else {
          setOrdersList([]);
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error sign in api => ', error);
      toastShow('error', 'System error sign in');
    }
  }

  return (
    <View
      style={{
        flex: 1,
      }}>
      <HeaderComp
        title={'Placed Orders'}
        navigation={navigation}
        userLoggedIn={userLoggedIn}
        backPress={true}
      />
      {showMoreOptions ? (
        <MoreOptionsComp
          list={actions}
          showHide={bol => setShowMoreOptions(bol)}
          onPress={item => {
            if (item.toLowerCase().includes('change status')) {
              let changeTo =
                metaData?.sellsOrderStatus[
                  metaData?.sellsOrderStatus.indexOf(
                    currentOrder?.orderStatus,
                  ) + 1
                ];
              setShowMoreOptions(false);
              _updateStatus(currentOrder, changeTo);
            } else if (item === 'Details') {
              setShowMoreOptions(false);
              navigation.navigate('PlaceOrderDetailScreen', {
                order: currentOrder,
                shop,
                user,
                item,
                userLoggedIn,
                metaData,
                isCustomer,
              });
            } else if (item === 'Cancel') {
              setShowMoreOptions(false);
              _updateStatus(currentOrder, 'Cancel');
            }
          }}
        />
      ) : null}

      <AppLoaderComp visible={showLoader} />
      {showFilter ? (
        <PlaceOrderFilterComp
          currentStatus={currentStatus}
          metaData={metaData}
          isCustomer={isCustomer}
          onCloseFilter={() => setShowFilter(false)}
          filterDate={filterDate}
          applyFilters={(p1, p2) => _applyFilters(p1, p2)}
          showDatePicker={() => setShowDatePicker(true)}
          clearFilter={() => {
            let status = '';
            if (isCustomer) {
              status = placeOrderStatusCustomer[0];
            } else {
              status = placeOrderStatus[0];
            }
            setCurrentStatus(status);
            setFilterDate('Select Date');
            _applyFilters(status, 'Select Date');
          }}
        />
      ) : null}
      <DatePicker
        modal
        mode="date"
        open={showDatePicker}
        date={new Date()}
        onConfirm={date => {
          setShowDatePicker(false);
          _pickDate(date);
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
      />

      <View style={{flex: 1, padding: 10}}>
        <FiltersComp
          appliedFilters={`${' ( ' + currentStatus + ''} ${
            filterDate !== 'Select Date' ? filterDate : ')'
          }`}
          onPress={() => setShowFilter(true)}
        />
        <View style={{marginTop: 10, paddingBottom: 35}}>
          <FlatList
            data={ordersList}
            renderItem={({item}) => (
              <PlacedOrdersComp
                item={item}
                isCustomer={isCustomer}
                keyExtractor={item => item.id}
                metaStatus={metaData?.sellsOrderStatus}
                metaData={metaData}
                showDetails={(order, actions) => {
                  setCurrentOrder(order);
                  setActions(actions);
                  setShowMoreOptions(true);
                }}
              />
            )}
          />
        </View>
      </View>
    </View>
  );
}
