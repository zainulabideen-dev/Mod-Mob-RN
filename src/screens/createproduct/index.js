import {View, Text, Alert, TouchableOpacity, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import ImagePickerComp from '../../components/ImagePickerComp';
import InputTextComp from '../../components/InputTextComp';
import {COLORS} from '../../config/colors';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import HeaderComp from '../../components/HeaderComp';
import {toastShow} from '../../config/toastmessage';
import {CREATE_PRODUCT, UPDATE_PRODUCT, axiosClient} from '../../config/apis';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import ButtonCompReact from '../../components/ButtomCompReact';
import {SearchSelectionModal} from '../../modals/SearchSelectionModal';
import {_getFromAsyncStorage} from '../../config/asyncstorage';
import {ColorPickerModal} from '../../modals/ColorPickerModal';

export default function CreateProductScreen({navigation, route}) {
  const {userLoggedIn, item, metaData} = route.params;
  let user = userLoggedIn.user;
  let shop = userLoggedIn.shop;

  const [showLoader, setShowLoader] = useState(false);
  const [showSearchSelection, setShowSearchSelection] = useState(false);

  const [productImage, setProductImage] = useState();
  const [name, setName] = useState('');
  const [ammount, setAmmount] = useState(1);
  const [unit, setUnit] = useState('KG');
  const [price, setPrice] = useState(0);
  const [itemPrice, setItemPrice] = useState(0);
  const [productSize, setProductSize] = useState([]);
  const [productColors, setProductColors] = useState([]);
  const [showProductColorPicker, setShowProductColorPicker] = useState(false);

  useEffect(() => {
    console.log(item);
    if (item !== undefined) {
      setName(item.name);
      setAmmount(parseInt(item.ammount));
      setUnit(item.unit);
      setPrice(parseInt(item.price));
      setItemPrice(parseInt(item.price));

      setProductSize(item.size.split(','));
      if (item.colors !== '') {
        setProductColors(item.colors.split(','));
      }
    }
  }, []);

  async function _uploadOptions() {
    Alert.alert('Upload Image', 'Please provide your product image', [
      {
        text: 'Open Camera',
        onPress: () => _pickImage(true),
        style: 'cancel',
      },
      {text: 'Open Gallery', onPress: () => _pickImage(false)},
      {
        text: 'Close',
        onPress: () => console.log(true),
        style: 'cancel',
      },
    ]);
  }

  async function _pickImage(camera) {
    if (camera) {
      const result = await launchCamera();
      if (result.didCancel) {
        return;
      }
      setProductImage(result);
    } else {
      const result = await launchImageLibrary();
      if (result.didCancel) {
        return;
      }
      setProductImage(result);
    }
  }

  async function _createNewProduct() {
    if (item === undefined) {
      if (productImage === undefined) {
        toastShow('error', 'please provide product image');
        return;
      }
    }
    if (name.length === 0) {
      toastShow('error', 'please provide product name');
      return;
    }
    if (ammount === undefined) {
      toastShow('error', 'please provide product ammount');
      return;
    }
    if (unit === undefined) {
      toastShow('error', 'please provide product unit');
      return;
    }
    if (price === undefined) {
      toastShow('error', 'please provide product price');
      return;
    }

    const formData = new FormData();
    formData.append('userId', user.id);
    formData.append('name', name);
    formData.append('ammount', ammount);
    formData.append('unit', unit);
    formData.append('price', price);
    //formData.append('inStock', 'Yes');
    formData.append('size', productSize, toString());
    formData.append('colors', productColors.toString());
    formData.append('platform', 'mob');

    if (productImage !== undefined) {
      formData.append('productImage', {
        uri: productImage.assets[0].uri,
        type: productImage.assets[0].type,
        name: productImage.assets[0].fileName,
      });
    }

    let END_POINT = '';
    if (item === undefined) {
      END_POINT = CREATE_PRODUCT;
    } else {
      END_POINT = UPDATE_PRODUCT;
      formData.append('productId', item.id);
      formData.append('productURL', item.photo);
    }

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(END_POINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: user?.token,
        },
      });
      if (status == 200) {
        setShowLoader(false);
        console.log(data);
        if (data.status == '200') {
          toastShow('success', data.message);
          Alert.alert('Alert', data.message, [
            {text: 'OK', onPress: () => navigation.goBack()},
          ]);
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (e) {
      setShowLoader(false);
      console.log('error get shop categories api => ', error.response);
      toastShow('error', 'System error get shop categories');
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <ColorPickerModal
        onClose={() => setShowProductColorPicker(false)}
        visible={showProductColorPicker}
        onCofirm={color => {
          if (!productColors.includes(color)) {
            setProductColors([...productColors, color]);
          }
          setShowProductColorPicker(false);
        }}
      />
      <SearchSelectionModal
        title={'Select 1 Option'}
        data={metaData.productUnits}
        visible={showSearchSelection}
        onSelected={item => {
          setUnit(item.name);
          setShowSearchSelection(false);
        }}
        onCloseModal={() => setShowSearchSelection(false)}
      />
      <HeaderComp
        title={item === undefined ? 'Add New Product' : 'Update Product'}
        navigation={navigation}
        backPress={true}
        userLoggedIn={userLoggedIn}
      />
      <AppLoaderComp visible={showLoader} />
      <ScrollView
        style={{
          flex: 1,
          padding: 15,
        }}>
        <View style={{flexDirection: 'row'}}>
          <View style={{}}>
            <View style={{width: 100, height: 100, marginTop: 10}}>
              <Text
                style={{
                  fontFamily: 'Poppins-Regular',
                  fontSize: 12,
                }}>
                Product Image
              </Text>
              <ImagePickerComp
                image={
                  productImage !== undefined
                    ? productImage.assets[0].uri
                    : item !== undefined
                    ? item.photo
                    : undefined
                }
                onPress={() => _uploadOptions()}
                label={''}
              />
            </View>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <InputTextComp
            value={name}
            placeholder={'Product Name'}
            onChangeText={text => setName(text)}
            hint={'Product Name'}
          />
          <InputTextComp
            value={unit}
            placeholder={'Unit'}
            onChangeText={text => {
              setUnit(text);
            }}
            hint={'Like KG, Mg, Litter, Piece etc (optional)'}
          />
          <InputTextComp
            value={ammount.toString()}
            keyboardType={'number-pad'}
            placeholder={'Stock'}
            onChangeText={text => {
              setAmmount(text);
            }}
            hint={'Stock'}
          />
          <InputTextComp
            value={itemPrice.toString()}
            keyboardType={'number-pad'}
            placeholder={'Price'}
            onChangeText={text => {
              setItemPrice(text);
              if (text.length > 0) {
                setPrice(parseInt(text));
              } else {
                setPrice(0);
              }
            }}
            hint={'Price (as per 1 unit)'}
          />

          <Text
            style={{
              marginTop: 10,
              fontSize: 17,
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            Select Size (Optional)
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 3,
            }}>
            {['S', 'M', 'L', 'XL'].map((item, i) => {
              let bol = false;
              if (productSize.includes(item)) {
                bol = true;
              }
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    if (productSize.includes(item)) {
                      let updatedDays = productSize.filter(
                        each => each !== item,
                      );
                      setProductSize(updatedDays);
                    } else {
                      setProductSize([...productSize, item]);
                    }
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.gray_100,
                      borderRadius: 5,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      marginRight: 5,
                      backgroundColor: bol ? '#5DADE2' : 'transparent',
                    }}>
                    <Text
                      style={{
                        color: bol ? 'white' : 'black',
                        fontFamily: 'Poppins-Regular',
                      }}>
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text
            style={{
              marginTop: 10,
              fontSize: 17,
              color: 'black',
              fontFamily: 'Poppins-Regular',
            }}>
            Select Color (Optional)
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 3,
            }}>
            {productColors.map((item, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    if (productColors.includes(item)) {
                      let colorList = productColors.filter(
                        item2 => item2 !== item,
                      );
                      setProductColors(colorList);
                    }
                  }}>
                  <View
                    style={{
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.gray_100,
                      borderRadius: 5,
                      paddingVertical: 5,
                      paddingHorizontal: 17,
                      marginRight: 5,
                      backgroundColor: item,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        fontFamily: 'Poppins-Regular',
                      }}>
                      -
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity onPress={() => setShowProductColorPicker(true)}>
              <View
                style={{
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.gray_100,
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 17,
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20,
                    fontFamily: 'Poppins-Regular',
                  }}>
                  +
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <ButtonCompReact
            label={item === undefined ? 'Create Product' : 'Update Product'}
            bgColor={COLORS.blue_200}
            extraStyle={{marginTop: 20, marginBottom: 30}}
            onPress={() => _createNewProduct()}
          />
        </View>
      </ScrollView>
    </View>
  );
}
