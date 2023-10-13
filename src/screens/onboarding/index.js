import {
  View,
  Text,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {OnBoardingData, asyncStorageKeys} from '../../config/constants';
import {_storeIntoAsyncStorage} from '../../config/asyncstorage';

export default function OnBoardingScreen({navigation}) {
  const scrollx = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);
  const {width, height} = Dimensions.get('screen');
  const [statusBarColor, setStatusBarColor] = useState(OnBoardingData[0].color);

  const onViewableItemsChanged = info => {
    setCurrentIndex(info.viewableItems[0].index);
  };

  useEffect(() => {
    setStatusBarColor(OnBoardingData[currentIndex].color);
  }, [currentIndex]);

  const viewabilityConfigCallbackPairs = useRef([{onViewableItemsChanged}]);

  const OnBoardingItem = ({item}) => {
    return (
      <View
        style={{
          width,
          height,
          backgroundColor: item.color,
          justifyContent: 'center',
          padding: 20,
          flex: 1,
        }}>
        <View style={{flex: 0.4, justifyContent: 'center'}}>
          <Image
            source={item.image}
            style={{
              width: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <View style={{flex: 0.6}}>
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Poppins-Regular',
              color: item.headingColor,
              textAlign: 'center',
            }}>
            {item.heading}
          </Text>
          <Text
            style={{
              color: item.textColor,
              marginTop: 5,
              textAlign: 'center',
              fontFamily: 'Poppins-Regular',
            }}>
            {item.subHeading}
          </Text>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => scrollTo()}>
              <Image
                style={{
                  width: 60,
                  height: 60,
                }}
                source={item.nextImage}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const Indicator = ({scrollx}) => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          flexDirection: 'row',
        }}>
        {OnBoardingData.map((_, i) => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
          const scale = scrollx.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: 'clamp',
          });
          const opacity = scrollx.interpolate({
            inputRange,
            outputRange: [0.6, 0.9, 0.8],
            extrapolate: 'clamp',
          });
          return (
            <Animated.View
              key={`ind=${i}`}
              style={{
                height: 10,
                width: 10,
                borderRadius: 5,
                backgroundColor: 'black',
                margin: 10,
                transform: [{scale}],
                opacity,
              }}
            />
          );
        })}
      </View>
    );
  };

  async function scrollTo() {
    if (currentIndex < OnBoardingData.length - 1) {
      slideRef.current.scrollToIndex({index: currentIndex + 1});
    } else {
      await _storeIntoAsyncStorage(asyncStorageKeys.onBoarding, 'finished');
      navigation.replace('SignInScreen');
    }
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <StatusBar backgroundColor={statusBarColor} />
      <Animated.FlatList
        ref={slideRef}
        data={OnBoardingData}
        keyExtractor={item => item.id}
        renderItem={({item}) => <OnBoardingItem item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollx}}}],
          {useNativeDriver: false},
        )}
        bounces={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      <Indicator scrollx={scrollx} />
    </View>
  );
}
