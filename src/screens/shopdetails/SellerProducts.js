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

export default function SellerProductsScreen({navigation, route}) {
  const {userLoggedIn, shop, isCustomer, metaData} = route.params;
  let user = userLoggedIn.user;

  const [productsList, setProductsList] = useState([]);
  const [filterProductsList, setFilterProductsList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [currectProduct, setCurrectProduct] = useState([]);

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
    let found = false;
    let list = [];
    addedItems.forEach(element => {
      if (element.id === item.id) {
        found = true;
      }
    });

    if (found) {
      list = addedItems.filter(prd => prd.id !== item.id);
      setAddedItems(list);
    } else {
      //console.log(item);
      setAddedItems([...addedItems, item]);
    }
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
      {/* {showMoreOptions ? (
        <View
          style={{
            position: 'absolute',
            zIndex: 2,
            backgroundColor: 'white',
            bottom: 0,
            width: '100%',
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: '#D5DBDB',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 17,
                color: 'black',
                fontFamily: 'Poppins-Regular',
              }}>
              More Options
            </Text>
            <TouchableWithoutFeedback onPress={() => setShowMoreOptions(false)}>
              <AntDesign name="close" size={20} color={'black'} />
            </TouchableWithoutFeedback>
          </View>

          <View
            style={{
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowMoreOptions(false);
                navigation.navigate('CreateProductScreen', {
                  userLoggedIn,
                  metaData,
                  item: currectProduct,
                });
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                  borderBottomWidth: 1,
                  borderBottomColor: '#D5DBDB',
                  paddingBottom: 5,
                }}>
                Update
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowMoreOptions(false);
                _deleteProduct(currectProduct);
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 17,
                  marginTop: 10,
                  color: 'black',
                  fontFamily: 'Poppins-Regular',
                }}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null} */}
      {!isCustomer ? (
        <HeaderComp
          backPress={true}
          userLoggedIn={userLoggedIn}
          title={'Shop Products'}
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
              Select Products you wanted to Buy
            </Text>
          </View>
        ) : null}
        <View style={{marginTop: 10, flex: 0.9}}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={filterProductsList}
            renderItem={({item}) => (
              <ProductComp
                isCustomer={isCustomer}
                metaData={metaData}
                openImage={item => {
                  setCurrectProduct(item);
                  setShowFullImage(true);
                }}
                moreOptions={item => {
                  setShowMoreOptions(true);
                  setCurrectProduct(item);
                }}
                shop={shop}
                item={item}
                navigation={navigation}
                addProduct={item => _addProduct(item)}
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
