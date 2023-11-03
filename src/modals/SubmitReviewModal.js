import React, {useEffect, useState} from 'react';
import {
  Modal,
  StatusBar,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {COLORS} from '../config/colors';
import ButtonCompReact from '../components/ButtomCompReact';
import Entypo from 'react-native-vector-icons/Entypo';
import {Rating} from 'react-native-ratings';

export const SubmitReviewModal = ({visible, submit, onCloseModal}) => {
  const [review, setReview] = useState('');
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    setReview('');
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible}>
      <StatusBar backgroundColor={'black'} />
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
          justifyContent: 'center',
          padding: 15,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 20,
                fontFamily: 'Poppins-Regular',
              }}>
              Submit Review
            </Text>
            <TouchableOpacity onPress={() => onCloseModal()}>
              <Entypo name="cross" size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 180,
              marginTop: 10,
              paddingVertical: 5,
              paddingHorizontal: 5,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              backgroundColor: '#E5E8E8',
              borderRadius: 5,
            }}>
            <TextInput
              multiline
              maxLength={240}
              style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                maxHeight: 120,
              }}
              placeholder="Type your review ..."
              onChangeText={text => {
                if (text.length <= 20) {
                  setError(
                    'Please write at least a sentence greater then 20 letters',
                  );
                } else {
                  setError('');
                }
                setReview(text);
              }}
            />
          </View>
          <Text
            style={{
              textAlign: 'right',
              fontFamily: 'Poppins-Regular',
            }}>
            {review.length}/240
          </Text>
          <Text style={{color: 'red', fontFamily: 'Poppins-Regular'}}>
            {error.length > 1 ? error : ''}
          </Text>
          <Rating
            type="star"
            ratingCount={5}
            imageSize={40}
            showRating
            onFinishRating={val => setRating(val)}
          />
          <ButtonCompReact
            label={'Submit'}
            bgColor={COLORS.green_100}
            extraStyle={{marginTop: 20}}
            onPress={() => {
              if (review.length >= 20) {
                submit({review, rating});
              } else {
                setError('Review must contain 20 letters');
              }
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.8,
  },
  map: {flex: 1},
});
