import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import ProductComp from '../../components/ProductComp';
import SearchComp from '../../components/SearchComp';
import {COLORS} from '../../config/colors';
import {
  DELETE_PRODUCT,
  SHOP_PRODCUTS,
  _getAxiosHeaders,
  axiosClient,
} from '../../config/apis';
import {toastShow} from '../../config/toastmessage';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import ButtonCompReact from '../../components/ButtomCompReact';
import HeaderComp from '../../components/HeaderComp';
import {ShowFullImageModal} from '../../modals/ShowFullImageModal';
import MoreOptionsComp from '../../components/MoreOptionsComp';
import AddToCardComp from '../../components/AddToCardComp';
import {_constCheckOutOfStock} from '../../config/constants';

export default function SellerProductsScreen({navigation, route}) {
  const {userLoggedIn, shop, isCustomer, metaData, addSales} = route.params;
  let user = userLoggedIn.user;

  const [productsList, setProductsList] = useState([]);
  const [filterProductsList, setFilterProductsList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [currectProduct, setCurrectProduct] = useState([]);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _getProducts();
    });
    return unsubscribe;
  }, [navigation]);

  async function _getProducts() {
    let params = {
      userId: user.id,
      apiToken: user.token,
      shopId: shop.id,
      platform: 'mob',
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        SHOP_PRODCUTS,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          setProductsList(data.data);
          setFilterProductsList(data.data);
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error sign in api => ', error);
      toastShow('error', 'System error sign in');
    }
  }

  function _addProduct(item) {
    if (_constCheckOutOfStock(item, productsList, addedItems)) {
      toastShow('error', 'out of stock');
      return;
    }
    let prdAddedItem = addedItems.filter(prd => prd.id === item.id);
    let orignalProd = productsList.filter(prd => prd.id === item.id)[0];
    if (prdAddedItem.length === 0) {
      let addItem = {
        id: item?.id,
        rowId: addedItems.length + 1,
        ammount: 1,
        name: item?.name,
        photo: item?.photo,
        price: item?.price,
        shopId: shop?.id,
        colors: item?.colors,
        size: item?.size,
      };
      let updatedList = [...addedItems, addItem];
      setAddedItems(updatedList);
      _calcTotalPrice(updatedList);
    } else {
      let updatedList = [];
      addedItems.forEach(element => {
        if (element.id === item.id) {
          element.ammount = parseInt(element?.ammount) + 1;
          element.price =
            parseInt(element?.price) + parseInt(orignalProd?.price);
        }
        updatedList.push(element);
      });
      setAddedItems(updatedList);
      _calcTotalPrice(updatedList);
    }
  }

  function _minusProduct(item) {
    let prdAddedItem = addedItems.filter(prd => prd.id === item.id)[0];
    let orignalProd = productsList.filter(prd => prd.id === item.id)[0];
    if (prdAddedItem === undefined) return;
    if (prdAddedItem?.ammount === 1) {
      let updatedList = addedItems.filter(prd => prd.id !== item.id);
      setAddedItems(updatedList);
      _calcTotalPrice(updatedList);
    } else if (prdAddedItem?.ammount > 1) {
      let updatedList = [];
      addedItems.forEach(element => {
        if (element.id === item.id) {
          element.ammount = parseInt(element?.ammount) - 1;
          element.price =
            parseInt(element?.price) - parseInt(orignalProd?.price);
        }
        updatedList.push(element);
      });
      setAddedItems(updatedList);
      _calcTotalPrice(updatedList);
    }
  }

  function _calcTotalPrice(updatedList) {
    let totalPrice = 0;
    updatedList.forEach(element => {
      totalPrice += parseInt(element?.price);
    });
    setTotalPrice(totalPrice);
  }

  async function _deleteProduct(item) {
    let params = {
      userId: user.id,
      productId: item.id,
      platform: 'mob',
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        DELETE_PRODUCT,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          let remainingProducts = [];
          productsList.forEach(element => {
            if (element.id !== item.id) {
              remainingProducts.push(element);
            }
          });
          setProductsList(remainingProducts);
          setFilterProductsList(remainingProducts);
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error sign in api => ', error);
      toastShow('error', 'System error sign in');
    }
  }

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

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <AppLoaderComp visible={showLoader} />
      {currectProduct !== undefined ? (
        <ShowFullImageModal
          visible={showFullImage}
          currectProduct={currectProduct}
          closeModal={() => setShowFullImage(false)}
        />
      ) : null}
      {showMoreOptions ? (
        <MoreOptionsComp
          list={['Update', 'Delete']}
          showHide={bol => setShowMoreOptions(bol)}
          onPress={item => {
            if (item === 'Update') {
              setShowMoreOptions(false);
              navigation.navigate('CreateProductScreen', {
                userLoggedIn,
                metaData,
                item: currectProduct,
              });
            } else if (item === 'Delete') {
              setShowMoreOptions(false);
              _deleteProduct(currectProduct);
            }
          }}
        />
      ) : null}
      {showAddToCart ? (
        <AddToCardComp
          product={currectProduct}
          addedItems={addedItems}
          addToCart={item => {
            setShowAddToCart(false);
            toastShow('success', 'Added to Cart');
            setAddedItems([...addedItems, item]);
          }}
          shop={shop}
          showHide={bol => setShowAddToCart(bol)}
        />
      ) : null}
      {!isCustomer ? (
        <HeaderComp
          backPress={true}
          userLoggedIn={userLoggedIn}
          title={'Shop Products'}
          navigation={navigation}
        />
      ) : null}

      {addSales ? (
        <HeaderComp
          backPress={true}
          userLoggedIn={userLoggedIn}
          title={'Add Sales'}
          navigation={navigation}
        />
      ) : null}

      <View style={{flex: 1, padding: 15}}>
        <SearchComp onTextChange={text => searchProducts(text)} />
        {isCustomer ? (
          <View
            style={{
              backgroundColor: 'white',
              justifyContent: 'space-between',
              flexDirection: 'row',
              padding: 7,
              marginTop: 10,
            }}>
            <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
              {`Total Items: ${addedItems.length}`}
            </Text>
            <Text style={{color: 'black', fontFamily: 'Poppins-Regular'}}>
              {`Total Price: ${totalPrice} ${shop?.currency.toUpperCase()}`}
            </Text>
          </View>
        ) : null}
        <View style={{marginTop: 10, flex: 0.9}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filterProductsList}
            renderItem={({item}) => (
              <ProductComp
                shop={shop}
                item={item}
                isCustomer={isCustomer}
                moreOptions={item => {
                  setShowMoreOptions(true);
                  setCurrectProduct(item);
                }}
                openImage={item => {
                  setCurrectProduct(item);
                  setShowFullImage(true);
                }}
                addToCart={item => _addProduct(item)}
                minusToCart={item => _minusProduct(item)}
                addedItems={addedItems}
              />
            )}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={{flex: 0.1, justifyContent: 'flex-end'}}>
          <ButtonCompReact
            label={isCustomer ? 'Continue' : 'Add Product'}
            bgColor={COLORS.blue_200}
            onPress={() => {
              if (isCustomer) {
                if (addedItems.length > 0) {
                  navigation.navigate('SelectedItemsScreen', {
                    itemsList: addedItems,
                    userLoggedIn,
                    shop,
                    metaData,
                    productsList,
                    addSales,
                  });
                } else {
                  toastShow('error', 'Please Select Products');
                }
              } else {
                navigation.navigate('CreateProductScreen', {
                  item: undefined,
                  userLoggedIn,
                  metaData,
                });
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}
