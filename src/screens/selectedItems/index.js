import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import SearchComp from '../../components/SearchComp';
import {COLORS} from '../../config/colors';
import {_getAxiosHeaders} from '../../config/apis';
import ButtonCompReact from '../../components/ButtomCompReact';
import HeaderComp from '../../components/HeaderComp';
import SelectedItemComp from '../../components/SelectedItemComp';
import {toastShow} from '../../config/toastmessage';
import {_numberWithCommas} from '../../config/constants';

export default function SelectedItemsScreen({navigation, route}) {
  const {shop, itemsList, productsList} = route.params;

  const [filterProductsList, setFilterProductsList] = useState(itemsList);
  const [addedItems, setAddedItems] = useState(itemsList);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let price = 0;
    addedItems.forEach(element => {
      price += parseInt(element?.price);
    });
    setTotalPrice(price);
  }, [addedItems]);

  function searchProducts(text) {
    if (text.length > 0 && productsList.length > 0) {
      if (text) {
        const filterData = productsList.filter(function (item) {
          const pname = item.name.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
          const textSearch = text.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase();
          return pname.includes(textSearch);
        });

        setFilterProductsList(filterData);
      }
    } else if (text.length === 0) {
      setFilterProductsList(productsList);
    }
  }

  function _calculate(addedItems, val, item) {
    let updatedAddedItems = [];
    let objProduct = productsList.filter(prd => prd.id === item.id)[0];
    let totalPrice = 0;
    let am = isNaN(parseInt(val)) ? 0 : parseInt(val);
    let calcStock = parseInt(objProduct?.remainStock) - am;

    if (calcStock < 0) {
      toastShow('error', 'Out of stock');
      return;
    }

    addedItems.forEach(element => {
      if (element.id === item.id) {
        element.ammount = val;
        try {
          let price1Item = parseInt(objProduct.price);
          let price = price1Item * am;
          element.price = price;
          element.stockLeft = calcStock;
        } catch (e) {
          console.log(e);
        }
      }
      try {
        totalPrice += parseInt(element.price);
      } catch (e) {
        console.log(e);
      }
      updatedAddedItems.push(element);
    });
    setAddedItems(updatedAddedItems);
    setFilterProductsList(updatedAddedItems);
  }

  function _setColorSizes(addedItems, val, item, type = 'C') {
    let updatedAddedItems = [];
    addedItems.forEach(element => {
      if (element.id === item.id) {
        if (type === 'C') {
          element.colors = val.toString();
        } else {
          element.size = val.toString();
        }
      }
      updatedAddedItems.push(element);
    });
    setAddedItems(updatedAddedItems);
  }

  function _continue() {
    if (addedItems.length === 0) {
      toastShow('Please select at least 1 product');
      return;
    }

    let stopElement = null;
    let msg = '';
    addedItems.forEach(element => {
      let product = productsList.filter(prd => prd.id === element.id)[0];
      let pClr = product?.colors.split(',');
      let eClr = element?.colors.split(',');

      // console.log(`===${element?.name} COLOR===`);
      // console.log(pClr, eClr);

      if (pClr.toString() !== '' && eClr.toString() === '') {
        stopElement = element;
        msg = `please select ${element?.name} color`;
      }

      let pSize = product?.size.split(',');
      let eSize = element?.size.split(',');

      // console.log(`===${element?.name} SIZE===`);
      // console.log(pSize, eSize);

      if (pSize.toString() !== '' && eSize.toString() === '') {
        stopElement = element;
        msg = `please select ${element?.name} size`;
      }
    });

    if (stopElement !== null) {
      toastShow('error', msg);
      return;
    }

    navigation.navigate('PlaceOrderScreen', {
      totalPrice,
      items: addedItems,
      shop,
    });
  }

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <HeaderComp
        backPress={true}
        title={'Shop Products'}
        navigation={navigation}
      />
      <View style={{flex: 1, padding: 15}}>
        <SearchComp onTextChange={text => searchProducts(text)} />

        <View
          style={{
            backgroundColor: 'white',
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: 7,
            marginTop: 10,
          }}>
          <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
            {`Total Price = ${_numberWithCommas(totalPrice)} ${shop.currency}`}
          </Text>
          <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
            {`Total Items = ${itemsList.length}`}
          </Text>
        </View>
        <View style={{marginTop: 10, flex: 0.9}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filterProductsList}
            renderItem={({item}) => (
              <SelectedItemComp
                shop={shop}
                item={item}
                productsList={productsList}
                onChangeAmount={val => {
                  _calculate(addedItems, val, item);
                }}
                onColorSizeSelected={(val, type) => {
                  _setColorSizes(addedItems, val, item, type);
                }}
                removeItem={item => {
                  let list = addedItems.filter(adt => adt.id !== item.id);
                  console.log(list.length, addedItems.length);
                  setAddedItems(list);
                  setFilterProductsList(list);
                }}
              />
            )}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={{flex: 0.1, justifyContent: 'flex-end'}}>
          <ButtonCompReact
            label={'Continue'}
            bgColor={COLORS.blue_200}
            onPress={() => _continue()}
          />
        </View>
      </View>
    </View>
  );
}
