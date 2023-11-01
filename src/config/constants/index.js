import Entypo from 'react-native-vector-icons/Entypo';
import Geocoder from 'react-native-geocoding';
import Config from 'react-native-config';

export const APP_NAME = 'Meri Online Dukan';
export const DeActivateShopText =
  'Are you sure you want to de activate your shop? After de activating customers can not see your shop.\n\nYou can also re activate your shop again.';
export const createNewShopText = `Hello! Wlecome to ${APP_NAME}. Do you want to become an online Seller and Create your own online shop?`;

export const OnBoardingData = [
  {
    id: 1,
    heading: 'Create Your Online Shop / Store',
    subHeading:
      'Hi Do you have any shop and you want to sell your products online? If not then make it online right now!',
    image: require('../../assets/01_Onboard.jpeg'),
    nextImage: require('../../assets/next.png'),
    color: '#7e89fd',
    headingColor: 'white',
    textColor: 'white',
  },
  {
    id: 2,
    heading: 'Buy Products from Online Seller',
    subHeading:
      'Customer Or App Users can easily buy their favourite products online from their favourite store Or Shop',
    image: require('../../assets/02_Onboard.jpeg'),
    nextImage: require('../../assets/next-black.png'),
    color: '#feead2',
    headingColor: 'black',
    textColor: 'black',
  },
  {
    id: 3,
    heading: 'Rating and Reviews',
    subHeading:
      'Customer Or App Users can also give Rating Reviews to the Shops Or Stores. Each shop or store will appear on the top a/c to their performance based on Customer Reviews Ratings',
    image: require('../../assets/03_Onboard.png'),
    nextImage: require('../../assets/next-black.png'),
    color: '#cad9fa',
    headingColor: 'black',
    textColor: 'black',
  },
];

export const CUSTOMER_NAV = [
  {
    id: 1,
    heading: 'NearBy Shops',
    screen: 'OnlineSellerScreen',
    image: require('../../assets/map-pointer.png'),
    isCustomer: true,
  },
  {
    id: 2,
    heading: 'Placed Orders',
    screen: 'PlaceOrdersScreen',
    image: require('../../assets/to-do-list.png'),
    isCustomer: true,
  },
  {
    id: 3,
    heading: 'Favourite Shops',
    screen: 'FavouriteSellerScreen',
    image: require('../../assets/heart.png'),
    isCustomer: true,
  },
];

export const SELLER_NAV = [
  {
    id: 1,
    heading: 'My Shop Info',
    screen: 'SellerInfoScreen',
    image: require('../../assets/map-pointer.png'),
    isCustomer: false,
  },
  {
    id: 2,
    heading: 'Products',
    screen: 'SellerProductsScreen',
    image: require('../../assets/products.png'),
    isCustomer: false,
  },
  {
    id: 3,
    heading: 'Orders',
    screen: 'PlaceOrdersScreen',
    image: require('../../assets/to-do-list.png'),
    isCustomer: false,
  },
  {
    id: 4,
    heading: 'Customers',
    screen: 'ShopCustomersScreen',
    image: require('../../assets/target.png'),
    isCustomer: false,
  },
  {
    id: 5,
    heading: 'Delivery Areas',
    screen: 'DeliveryAreasScreen',
    image: require('../../assets/tracking.png'),
    isCustomer: false,
  },
  {
    id: 6,
    heading: 'Reviews & Ratings',
    screen: 'SellerRatingsScreen',
    image: require('../../assets/rating.png'),
    isCustomer: false,
  },
  {
    id: 7,
    heading: 'De Activate Shop',
    screen: '',
    image: require('../../assets/switch.png'),
    isCustomer: false,
  },
];

export const asyncStorageKeys = {
  onBoarding: 'onBoarding',
  user: 'user',
  currentShop: 'currentShop',
  metaData: 'metaData',
};

export const placeOrderStatus = [
  'Recieved',
  'Accepted',
  'Packed',
  'On the way',
  'delivered',
];

export const placeOrderStatusCustomer = [
  'Pending',
  'Accepted',
  'Packed',
  'On the way',
  'delivered',
];

export const shopCurrencyList = [
  {id: 1, name: 'PKR', photo: ''},
  {id: 2, name: 'USD', photo: ''},
];

export const shopSettings = [
  {
    id: 1,
    heading: 'Update Shop',
    subHeading:
      'Hi Do you have any shop and you want to sell your products online? If not then make it online right now!',
    image: <Entypo name="shop" size={20} />,
    color: 'black',
  },
  {
    id: 2,
    heading: 'Delivery Areas',
    subHeading:
      'Are you sure you want to de activate your shop? After de activating customers can not see your shop.\n\nYou can also re activate your shop again.',
    image: <Entypo name="location-pin" size={20} />,
    color: 'black',
  },
  {
    id: 3,
    heading: 'Reviews',
    subHeading:
      'Are you sure you want to de activate your shop? After de activating customers can not see your shop.\n\nYou can also re activate your shop again.',
    image: <Entypo name="heart" size={20} />,
    color: 'black',
  },
  {
    id: 4,
    heading: 'De Activate Shop',
    subHeading:
      'Are you sure you want to de activate your shop? After de activating customers can not see your shop.\n\nYou can also re activate your shop again.',
    image: <Entypo name="shop" size={20} />,
    color: 'red',
  },
];

export function _formatTime(timeString) {
  const [hourString, minute] = timeString.split(':');
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ':' + minute + (hour < 12 ? ' AM' : ' PM');
}

export function formatDate(newDate) {
  const months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
  };
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const d = newDate;
  const year = d.getFullYear();
  const date = d.getDate();
  const monthIndex = d.getMonth();
  const monthName = months[d.getMonth()];
  const dayName = days[d.getDay()]; // Thu
  const formatted = `${dayName} ${monthName} ${date}, ${year}`;
  return formatted.toString();
}

export const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export async function _getAddressFromLatLong(marker) {
  Geocoder.init(Config.GOOGLE_MAPS_API_KEY);

  let address = null;
  try {
    let json = await Geocoder.from(marker.latitude, marker.longitude);
    if (json) {
      let district = json.results[json.results.length - 3].formatted_address;

      let fetchedAddress = json.results[0].formatted_address;
      address = fetchedAddress
        .substring(fetchedAddress.indexOf(',') + 1)
        .trim();
    }
  } catch (error) {
    console.log('Geocode error => ', error);
  }

  return address;
}

export function _numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function _constGetSize(x) {
  if (x === 'S') {
    return '- Small';
  } else if (x === 'M') {
    return '- Medium';
  } else if (x === 'L') {
    return '- Large';
  } else if (x === 'XL') {
    return '- Extra Large';
  } else if (x === '') {
    return '';
  } else {
    return '';
  }
}

export function _constCheckOutOfStock(item, totalPrdList, addedPrdList) {
  let orignalProd = totalPrdList.filter(prd => prd.id === item.id)[0];
  let addedProd = addedPrdList.filter(prd => prd.id === item.id)[0];

  let orignalPrdStock = parseInt(orignalProd?.inStock);
  let addedPrdStock = parseInt(addedProd?.ammount);

  if (addedPrdStock >= orignalPrdStock) {
    return true;
  } else {
    return false;
  }
}
