import React, {useEffect, useState} from 'react';
import {View, Text, Image, FlatList} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {COLORS} from '../../config/colors';
import {
  GET_REVIEW,
  SUBMIT_REVIEW,
  _getAxiosHeaders,
  axiosClient,
} from '../../config/apis';
import {AppLoaderComp} from '../../components/AppLoaderComp';
import {toastShow} from '../../config/toastmessage';
import {SubmitReviewModal} from '../../modals/SubmitReviewModal';
import ButtonCompReact from '../../components/ButtomCompReact';
import HeaderComp from '../../components/HeaderComp';

export default function SellerRatingsScreen({navigation, route}) {
  const {userLoggedIn, shop, isCustomer} = route.params;
  let user = userLoggedIn.user;

  const [showLoader, setShowLoader] = useState(false);
  const [reviewList, setReviewList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [ratingRatio, setRatingRatio] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      _getReviews();
    });
    return unsubscribe;
  }, [navigation]);

  async function _getReviews() {
    let params = {
      userId: user.id,
      platform: 'mob',
      shopId: shop.id,
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        GET_REVIEW,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          setReviewList(data.data);
          setRatingRatio(data.ratings);
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error get reviews api => ', error);
      toastShow('error', 'System error get reviews');
    }
  }

  async function _submitReview(review, ratings) {
    let params = {
      userId: user.id,
      review,
      ratings,
      shopId: shop.id,
    };

    try {
      setShowLoader(true);
      const {data, status} = await axiosClient.post(
        SUBMIT_REVIEW,
        params,
        _getAxiosHeaders(user?.token),
      );
      if (status == 200) {
        setShowLoader(false);
        if (data.status === '200') {
          toastShow('success', data.message);
          setTimeout(() => {
            _getReviews();
          }, 2000);
        } else {
          toastShow('error', data.message);
        }
      }
    } catch (error) {
      setShowLoader(false);
      console.log('error get reviews api => ', error);
      toastShow('error', 'System error get reviews');
    }
  }

  const ReviewItemComp = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 15,
          borderRadius: 5,
          marginBottom: 10,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
              source={{uri: item.photo}}
            />
            <View>
              <Text style={{marginLeft: 10, color: 'black', fontWeight: '600'}}>
                {item.name}
              </Text>
              <Text style={{marginLeft: 10}}>{item.currentDate}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AntDesign size={20} name="star" color={COLORS.yellow_100} />
            <Text style={{marginLeft: 5, color: 'black'}}>{item.rating}</Text>
          </View>
        </View>
        <Text
          style={{
            color: 'black',
            marginTop: 20,
          }}>
          {item.review}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      {!isCustomer ? (
        <HeaderComp
          navigation={navigation}
          title={'Reviews'}
          backPress={true}
          userLoggedIn={userLoggedIn}
        />
      ) : null}
      <AppLoaderComp visible={showLoader} />
      <SubmitReviewModal
        visible={showModal}
        onCloseModal={() => setShowModal(false)}
        submit={item => {
          _submitReview(item.review, item.rating);
          setShowModal(false);
        }}
      />
      <View style={{flex: 1, padding: 15}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
          }}>
          <Text
            style={{
              color: 'black',
            }}>
            {reviewList.length} {reviewList.length <= 1 ? 'Review' : 'Reviews'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <AntDesign size={20} name="star" color={COLORS.yellow_100} />
            <Text style={{marginLeft: 5, color: 'black'}}>{ratingRatio}</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <View style={{flex: 0.9, paddingVertical: 10}}>
            <FlatList
              data={reviewList}
              renderItem={({item}) => <ReviewItemComp item={item} />}
              keyExtractor={item => item.id}
            />
          </View>
          <View style={{flex: 0.1, justifyContent: 'flex-end'}}>
            {isCustomer ? (
              <ButtonCompReact
                onPress={() => setShowModal(true)}
                label={'Submit Review'}
                bgColor={COLORS.blue_200}
              />
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
}
