import {View, FlatList, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import HeaderComp from '../../components/HeaderComp';
import SearchComp from '../../components/SearchComp';
import {
  GET_CUSTOMERS,
  SEARCH_CUSTOMER,
  _getAxiosHeaders,
  axiosClient,
} from '../../config/apis';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {toastShow} from '../../config/toastmessage';

export default function ShopCustomersScreen({navigation, route}) {
  const {userLoggedIn, isCustomer, metaData} = route.params;
  let user = userLoggedIn?.user;

  const [customerList, setCustomerList] = useState([]);
  const [customer, setCustomer] = useState();
  const [customerId, setCustomerId] = useState();
  const [showLoader, setShowLoader] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    _getCustomers();
  }, []);

  async function _getCustomers() {
    let URL = GET_CUSTOMERS + `?userId=${user.id}&platform=${'mob'}`;
    try {
      let res = await axiosClient.get(URL, _getAxiosHeaders(user?.token));
      if (res.status === 200) {
        if (res.data.status === '200') {
          setCustomerList(res.data.data);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function _searchCustomer() {
    if (customerId === undefined) {
      toastShow('error', 'please provide customer id');
      return;
    }

    setCustomer(undefined);
    let URL =
      SEARCH_CUSTOMER +
      `?userId=${user.id}&customerId=${customerId}&platform=${'mob'}`;
    try {
      setLoading(true);
      let res = await axiosClient.get(URL, _getAxiosHeaders(user?.token));
      setLoading(false);
      console.log(res.data);
      if (res.status === 200) {
        if (res.data.status === '200') {
          toastShow('success', res.data.message);
          setCustomer(res.data.data[0]);
        } else {
          toastShow('error', res.data.message);
        }
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  return (
    <View style={{flex: 1}}>
      <HeaderComp
        title={'Customers'}
        navigation={navigation}
        userLoggedIn={userLoggedIn}
        backPress={true}
      />
      <AppLoaderComp visible={showLoader} />
      <View style={{marginTop: 10, padding: 10}}>
        <SearchComp
          pH="Search by Customer Id"
          extraStyle={{marginBottom: 10}}
          onTextChange={text => setCustomerId(text)}
        />
        <TouchableOpacity
          onPress={() => {
            if (!loading) {
              _searchCustomer();
            }
          }}>
          <View
            style={{
              borderColor: '#566573',
              borderWidth: 1,
              backgroundColor: 'white',
              paddingHorizontal: 15,
              borderRadius: 25,
              paddingVertical: 10,
              backgroundColor: '#2E86C1',
            }}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              {loading ? 'Searching' : 'Search'}
            </Text>
          </View>
        </TouchableOpacity>
        <FlatList
          data={customerList}
          renderItem={({item}) => <View></View>}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}
