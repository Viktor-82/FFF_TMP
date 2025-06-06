// import React from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     Image,
//     PermissionsAndroid,
//     Platform
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { useDispatch } from 'react-redux';
// import styled from 'styled-components/native';
// // import Toast from 'react-native-toast-message';
// import { showToast } from '../Shared/Notification';
// // import Geolocation from 'react-native-geolocation-service'; // <-- Комментируем, не удаляем
// import Geolocation from '@react-native-community/geolocation'; // <-- Новый импорт
// import { colors } from '../../assets/styles/colors';
// import { updateLocation } from '../../redux/actions/locationActions';
// import mapImage from '../../img/Map2_1.jpg';
// import axios from 'axios';
// import { REACT_APP_GOOGLE_MAPS_API_KEY } from '@env';
// import {extractRegionData} from "../../services/getRegionSubregion";
//
// // Стили для контейнера компонента
// const Container = styled.View`
//   flex: 1;
//   align-items: center;
//   justify-content: center;
//   padding: 20px;
//   background-color: ${colors.neutral.white};
// `;
//
// // Стили для заголовка
// const Title = styled.Text`
//   color: ${colors.green.grass};
//   font-size: 24px;
//   font-weight: bold;
//   margin-bottom: 10px;
// `;
//
// // Стили для описания
// const Description = styled.Text`
//   color: ${colors.brown.earth};
//   font-size: 16px;
//   margin-bottom: 20px;
//   text-align: center;
// `;
//
// // Стили для кнопки "Allow Location Access"
// const Button = styled.TouchableOpacity`
//   background-color: ${colors.green.grass};
//   padding: 15px 30px;
//   border-radius: 8px;
//   margin-bottom: 15px;
// `;
//
// const ButtonText = styled.Text`
//   color: ${colors.neutral.white};
//   font-size: 16px;
//   text-align: center;
// `;
//
// // Стили для кнопки ручного ввода адреса
// const ManualEntry = styled.TouchableOpacity`
//   padding: 10px;
// `;
//
// const ManualEntryText = styled.Text`
//   color: ${colors.brown.earth};
//   font-size: 14px;
//   text-decoration: underline;
// `;
//
// // Стили для кружка с картой
// const MapCircle = styled.View`
//   width: 150px;
//   height: 150px;
//   border-radius: 75px;
//   overflow: hidden;
//   margin-bottom: 20px;
//   background-color: ${colors.neutral.lightGray};
//   justify-content: center;
//   align-items: center;
// `;
//
// const LocationPermission = () => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();
//
//     // Запрос разрешений для Android
//     const requestLocationPermission = async () => {
//         if (Platform.OS === 'android') {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//                 {
//                     title: 'Location Permission',
//                     message: 'This app needs access to your location.',
//                     buttonNeutral: 'Ask Me Later',
//                     buttonNegative: 'Cancel',
//                     buttonPositive: 'OK',
//                 },
//             );
//             return granted === PermissionsAndroid.RESULTS.GRANTED;
//         } else {
//             return true; // Для iOS запрос разрешения происходит автоматически
//         }
//     };
//
//     const fetchAddressFromCoordinates = async (latitude, longitude) => {
//         try {
//             const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
//                 params: {
//                     latlng: `${latitude},${longitude}`,
//                     key: REACT_APP_GOOGLE_MAPS_API_KEY,
//                 },
//             });
//
//             const data = response.data;
//             const { region, subregion, city, houseNum } = extractRegionData(response.data);
//             console.log('страна, штат', region, subregion, city, street, houseNum);
//
//             if (data.status === 'OK' && data.results.length > 0) {
//                 let address = '';
//                 // let street = '';
//                 let postcode = '';
//
//                 for (const result of data.results) {
//                     const addressComponents = result.address_components;
//
//                     const getComponent = (types) => {
//                         for (let type of types) {
//                             const component = addressComponents.find((comp) => comp.types.includes(type));
//                             if (component) return component.long_name;
//                         }
//                         return '';
//                     };
//
//                     // const tempStreet = getComponent(['route', 'street_address']);
//                     const tempPostcode = getComponent(['postal_code']);
//
//                     if (tempStreet && tempPostcode) {
//                         // street = tempStreet;
//                         postcode = tempPostcode;
//                         address = result.formatted_address;
//                         break;
//                     }
//                 }
//
//                 if ( !postcode) {
//                 if (!postcode) {
//                     for (const result of data.results) {
//                         const addressComponents = result.address_components;
//
//                         const getComponent = (types) => {
//                             for (let type of types) {
//                                 const component = addressComponents.find((comp) => comp.types.includes(type));
//                                 if (component) return component.long_name;
//                             }
//                             return '';
//                         };
//
//                         // if (!street) {
//                         //     street = getComponent(['route', 'street_address']) || '';
//                         // }
//                         if (!postcode) {
//                             postcode = getComponent(['postal_code']) || '';
//                         }
//                         // if (street && postcode) {
//                         if (postcode) {
//                             address = result.formatted_address;
//                             break;
//                         }
//                     // }
//                 }
//
//                 navigation.navigate('LocationForm', { address, postcode, region, subregion, city, street, houseNum, latitude, longitude });
//             // } else {
//             //     showToast('Failed to get address details.', 'error');
//             // }
//         } catch (error) {
//             showToast('Error while retrieving address information.', 'error');
//         }
//     };
//
//     const handleAllowLocation = () => {
//         Geolocation.getCurrentPosition(
//             (position) => {
//                 const { latitude, longitude, accuracy } = position.coords;
//                 dispatch(updateLocation({ latitude, longitude }));
//                 fetchAddressFromCoordinates(latitude, longitude);
//
//                 if (accuracy && accuracy > 20) {
//                     showToast('Unable to pinpoint location. The approximate location is displayed.', 'warning');
//                 }
//             },
//             (error) => {
//                 showToast('Failed to get location.', 'error');
//             },
//             { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//         );
//     };
//
//     const handleManualEntry = () => {
//         navigation.navigate('LocationForm');
//     };
//
//     return (
//         <Container>
//             <MapCircle>
//                 <Image source={mapImage} style={{ width: '100%', height: '100%' }} />
//             </MapCircle>
//
//             <Title>What is Your Location?</Title>
//             <Description>
//                 We need to know your location in order to suggest nearby farm products.
//             </Description>
//
//             <Button onPress={handleAllowLocation}>
//                 <ButtonText>Allow Location Access</ButtonText>
//             </Button>
//
//             <ManualEntry onPress={handleManualEntry}>
//                 <ManualEntryText>Enter Location Manually</ManualEntryText>
//             </ManualEntry>
//         </Container>
//     );
// };
//
// export default LocationPermission;


import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
// import Toast from 'react-native-toast-message';
import { showToast } from '../Shared/Notification';
// import Geolocation from 'react-native-geolocation-service'; // <-- Комментируем, не удаляем
import Geolocation from '@react-native-community/geolocation'; // <-- Новый импорт
import { colors } from '../../assets/styles/colors';
import { updateLocation } from '../../redux/actions/locationActions';
import mapImage from '../../img/Map2_1.jpg';
import axios from 'axios';
import { REACT_APP_GOOGLE_MAPS_API_KEY } from '@env';
import { extractRegionData } from "../../services/getRegionSubregion";

// Стили для контейнера компонента
const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: ${colors.neutral.white};
`;

// Стили для заголовка
const Title = styled.Text`
  color: ${colors.green.grass};
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

// Стили для описания
const Description = styled.Text`
  color: ${colors.brown.earth};
  font-size: 16px;
  margin-bottom: 20px;
  text-align: center;
`;

// Стили для кнопки "Allow Location Access"
const Button = styled.TouchableOpacity`
  background-color: ${colors.green.grass};
  padding: 15px 30px;
  border-radius: 8px;
  margin-bottom: 15px;
`;

const ButtonText = styled.Text`
  color: ${colors.neutral.white};
  font-size: 16px;
  text-align: center;
`;

// Стили для кнопки ручного ввода адреса
const ManualEntry = styled.TouchableOpacity`
  padding: 10px;
`;

const ManualEntryText = styled.Text`
  color: ${colors.brown.earth};
  font-size: 14px;
  text-decoration: underline;
`;

// Стили для кружка с картой
const MapCircle = styled.View`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: ${colors.neutral.lightGray};
  justify-content: center;
  align-items: center;
`;

const LocationPermission = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Запрос разрешений для Android
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app needs access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            return true; // Для iOS запрос разрешения происходит автоматически
        }
    };

    const fetchAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: REACT_APP_GOOGLE_MAPS_API_KEY,
                },
            });

            const data = response.data;
            const { region, subregion, city, street, houseNum } = extractRegionData(response.data);
            console.log('страна, штат', region, subregion, city, street, houseNum);

            if (data.status === 'OK' && data.results.length > 0) {
                let address = '';
                let postcode = '';

                for (const result of data.results) {
                    const addressComponents = result.address_components;

                    const getComponent = (types) => {
                        for (let type of types) {
                            const component = addressComponents.find((comp) => comp.types.includes(type));
                            if (component) return component.long_name;
                        }
                        return '';
                    };

                    postcode = getComponent(['postal_code']);

                    if (postcode) {
                        address = result.formatted_address;
                        break;
                    }
                }

                if (!postcode) {
                    for (const result of data.results) {
                        const addressComponents = result.address_components;
                        const getComponent = (types) => {
                            for (let type of types) {
                                const component = addressComponents.find((comp) => comp.types.includes(type));
                                if (component) return component.long_name;
                            }
                            return '';
                        };

                        if (!postcode) {
                            postcode = getComponent(['postal_code']) || '';
                        }

                        if (postcode) {
                            address = result.formatted_address;
                            break;
                        }
                    }
                }

                navigation.navigate('LocationForm', { address, postcode, region, subregion, city, street, houseNum, latitude, longitude });
            } else {
                showToast('Failed to get address details.', 'error');
            }
        } catch (error) {
            showToast('Error while retrieving address information.', 'error');
        }
    };

    const handleAllowLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                dispatch(updateLocation({ latitude, longitude }));
                fetchAddressFromCoordinates(latitude, longitude);

                if (accuracy && accuracy > 20) {
                    showToast('Unable to pinpoint location. The approximate location is displayed.', 'warning');
                }
            },
            (error) => {
                showToast('Failed to get location.', 'error');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const handleManualEntry = () => {
        navigation.navigate('LocationForm');
    };

    return (
        <Container>
            <MapCircle>
                <Image source={mapImage} style={{ width: '100%', height: '100%' }} />
            </MapCircle>

            <Title>What is Your Location?</Title>
            <Description>
                We need to know your location in order to suggest nearby farm products.
            </Description>

            <Button onPress={handleAllowLocation}>
                <ButtonText>Allow Location Access</ButtonText>
            </Button>

            <ManualEntry onPress={handleManualEntry}>
                <ManualEntryText>Enter Location Manually</ManualEntryText>
            </ManualEntry>
        </Container>
    );
};

export default LocationPermission;
