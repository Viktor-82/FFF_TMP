import React, { useState, useEffect, useRef } from 'react';
import { REACT_APP_GOOGLE_MAPS_API_KEY } from '@env';
import {
    View,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    PermissionsAndroid,
    Platform,
    Alert,
    StyleSheet
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocation } from '../../redux/actions/locationActions';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
// import Toast from 'react-native-toast-message';
import { showToast } from '../Shared/Notification';
import styled from 'styled-components/native';
import { colors } from '../../assets/styles/colors';
import Geolocation from '@react-native-community/geolocation'; // <-- Используем эту библиотеку
import {extractRegionData} from "../../services/getRegionSubregion";

// Импорт SVG-иконок
import IncreaseMap from '../../img/map_icons/increase_map_36.svg';
import DecreaseMap from '../../img/map_icons/decrease_map_36.svg';
import SetPoint from '../../img/map_icons/set_point_36.svg';
import FindLocation from '../../img/map_icons/find_location_36.svg';

// ---------------------
// Стилизованные компоненты
// ---------------------
const Container = styled.View`
  flex: 1;
  width: 100%;
  padding: ${({ isFullScreen }) => (isFullScreen ? 0 : 20)}px;
  background-color: ${colors.neutral.white};
  position: relative;
`;

const MapContainer = styled.View`  
  position: ${({ isFullScreen }) => (isFullScreen ? 'absolute' : 'relative')};
  top: ${({ isFullScreen }) => (isFullScreen ? '0' : 'auto')};
  left: ${({ isFullScreen }) => (isFullScreen ? '0' : 'auto')};
  right: ${({ isFullScreen }) => (isFullScreen ? 0 : 'auto')};
  bottom: ${({ isFullScreen }) => (isFullScreen ? 0 : 'auto')};
  z-index: ${({ isFullScreen }) => (isFullScreen ? '9999' : '1')};
  width: 100%;
  height: ${({ isFullScreen, mapHeight }) => (isFullScreen ? '100%' : `${mapHeight}px`)};
`;

const InputLabel = styled.Text`
  font-size: 14px;
  color: ${colors.brown.earth};
  margin-top: 10px;
`;

const Input = styled.TextInput`
  padding: 10px;
  border: 1px solid ${colors.brown.beige};
  border-radius: 8px;
  background-color: ${colors.neutral.white};
  margin-top: 5px;
  font-size: 16px;
  width: 100%;
`;

const HalfWidthInput38 = styled(View)`
  width: 38%;
`;

const HalfWidthInput58 = styled(View)`
  width: 58%;
`;

const Button = styled.TouchableOpacity`
  background-color: ${({ disabled }) => (disabled ? colors.green.lightGreen : colors.green.grass)};
  color: ${({ disabled }) => (disabled ? colors.brown.earth : colors.neutral.white)};
  padding: 12px 34px;
  border-radius: 8px;
  align-items: center;
  margin-top: 28px;
`;

const ButtonText = styled.Text`
  color: ${({ disabled }) => (disabled ? colors.brown.earth : colors.neutral.white)};
  font-size: 16px;
`;

const MapButton = styled.TouchableOpacity`
  position: absolute;
  bottom: ${({ position }) => `${position}px`};
  right: 10px;
  background-color: ${({ active }) => (active ? colors.brown.earth : colors.neutral.white)};
  padding: 3px;
  border-radius: 5px;
  z-index: 2;
`;

const LabelButton = styled(Button)`
  background-color: ${({ selected }) => (selected ? colors.green.grass : colors.green.lightGreen)};
  margin: 5px;
`;

const ModalOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled.View`
  background-color: ${colors.neutral.white};
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-height: 80%;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: 7px;
  right: 20px;
`;

const CloseButtonText = styled.Text`
  font-size: 24px;
`;

const ErrorMessage = styled.Text`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

// ---------------------
// Компонент LocationForm
// ---------------------
const LocationForm = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();

    const { id } = route.params || {};
    const addresses = useSelector((state) => state.addresses.list);

    // Используем lat/lng в state, чтобы быть совместимыми со "старым проектом"
    const [address, setAddress] = useState(route.params?.address || '');
    const [postcode, setPostcode] = useState(route.params?.postcode || '');
    const [region, setRegion] = useState(route.params?.region || '');
    const [subregion, setSubregion] = useState(route.params?.subregion || '');
    const [city, setCity] = useState(route.params?.city || '');
    const [street, setStreet] = useState(route.params?.street || '');
    const [houseNum, setHouseNum] = useState(route.params?.houseNum || '');
    const [phone, setPhone] = useState('');
    const [farmName, setFarmName] = useState('');
    const [description, setDescription] = useState('');
    const [label, setLabel] = useState('');

    // Храним координаты именно как lat/lng
    const [coordinates, setCoordinates] = useState({
        lat: route.params?.lat || 0,
        lng: route.params?.lng || 0,
    });

    const [isInteractive, setIsInteractive] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [mapHeight, setMapHeight] = useState(400);

    const [isCustomLabelModalOpen, setIsCustomLabelModalOpen] = useState(false);
    const [customLabel, setCustomLabel] = useState('');
    const [customLabelError, setCustomLabelError] = useState(false);
    // Добавлен стейт для ошибки номера телефона
    const [phoneError, setPhoneError] = useState(false);

    const isProgrammaticUpdate = useRef(false);

    // =========================================
    // 1. Прямое геокодирование (адрес -> lat/lng)
    // =========================================
    const geocodeAddress = async () => {
        const fullAddress = `${address}, ${postcode}`;
        try {
            const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: fullAddress,
                    key: REACT_APP_GOOGLE_MAPS_API_KEY,
                },
            });
            const data = response.data;
            if (data.status === 'OK') {
                const location = data.results[0].geometry.location;
                setCoordinates({ lat: location.lat, lng: location.lng });

                const { region, subregion, city, street, houseNum } = extractRegionData(data);
                setRegion(region);
                setSubregion(subregion);
                setCity(city);
                setStreet(street);
                setHouseNum(houseNum);
            } else {
                showToast('Failed to obtain coordinates for the address', 'error');
            }
        } catch (error) {
            showToast('Error while geocoding address', 'error');
        }
    };

    useEffect(() => {
        if (address && postcode && !isProgrammaticUpdate.current) {
            geocodeAddress();
        }
    }, [address, postcode]);

    // =========================================
    // 2. Обратное геокодирование (lat/lng -> адрес)
    // =========================================
    const fetchAddressFromCoordinates = async (lat, lng) => {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const data = response.data;

            if (data.status === 'OK') {
                updateAddressFields(data.results[0]);

                const { region, subregion, city, street, houseNum } = extractRegionData(data);
                setRegion(region);
                setSubregion(subregion);
                setCity(city);
                setStreet(street);
                setHouseNum(houseNum);
            } else {
                showToast('Failed to fetch address. Please try again.', 'error');
            }
        } catch (error) {
            showToast('Error fetching address information.', 'error');
        }
    };

    const updateAddressFields = (result) => {
        const addressComponents = result.address_components;
        const getComponent = (type) =>
            addressComponents.find((component) => component.types.includes(type))?.long_name || '';

        isProgrammaticUpdate.current = true;

        setAddress(result.formatted_address);
        setPostcode(getComponent('postal_code'));

        setTimeout(() => {
            isProgrammaticUpdate.current = false;
        }, 0);
    };

    // =========================================
    // 3. Нажатие на карту
    // =========================================
    const handleMapPress = (e) => {
        if (isInteractive) {
            const { latitude, longitude } = e.nativeEvent.coordinate;
            setCoordinates({ lat: latitude, lng: longitude });
            fetchAddressFromCoordinates(latitude, longitude);
        }
    };

    // =========================================
    // 4. Автоопределение
    // =========================================
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This app needs access to your location to detect your position.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn('Permission request error:', err);
                return false;
            }
        }
        return true;
    };

    const handleAutoDetect = async () => {
        const hasPermission = await requestLocationPermission();
        if (!hasPermission) {
            showToast('Location permission denied', 'error');
            return;
        }

        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCoordinates({ lat: latitude, lng: longitude });
                fetchAddressFromCoordinates(latitude, longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                Alert.alert(
                    'Error',
                    error.code === 1
                        ? 'Permission denied. Please enable location services.'
                        : 'Failed to fetch location. Please try again.'
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
            }
        );
    };

// Функция для проверки формата номера телефона
    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^\+\d{10,15}$/; // Ожидает номер в формате +1234567890
        return phoneRegex.test(phone);
    };

// Обработчик изменения номера телефона
    const handlePhoneChange = (text) => {
        setPhone(text);
        setPhoneError(!validatePhoneNumber(text)); // Обновляем ошибку валидации
    };

    // =========================================
    // 5. Сохранение (lat/lng)
    // =========================================
    const handleNextStep = async () => {
        if (!validatePhoneNumber(phone)) {
            setPhoneError(true);
            showToast('Invalid phone number format. Use +1234567890', 'error');
            return;
        }

        const locationData = {
            address,
            postcode,
            phone,
            farmName,
            description,
            region,
            subregion,
            city,
            street,
            houseNum,
            coordinates: {
                lat: coordinates.lat,
                lng: coordinates.lng,
            },
        };
        try {
            // navigation.navigate('MyAddress', { fromLocationFormPage: true }); // не удалять!
            navigation.navigate('Upload', locationData);
        } catch (error) {
            // console.error('Error saving location:', error);
            // await AsyncStorage.setItem('unsyncedLocationData', JSON.stringify(locationData));
            // showToast('Failed to save location. Data saved locally.', 'error');
        }
    };

    // =========================================
    // 6. Редактирование (id)
    // =========================================
    const fetchAddressData = (editId) => {
        const addressToEdit = addresses.find((item) => item._id === editId);
        if (addressToEdit) {
            setAddress(addressToEdit.address);
            setPostcode(addressToEdit.postcode);
            setLabel(addressToEdit.label);

            // Если в Redux тоже хранится lat/lng
            if (addressToEdit.coordinates?.lat && addressToEdit.coordinates?.lng) {
                setCoordinates({
                    lat: addressToEdit.coordinates.lat,
                    lng: addressToEdit.coordinates.lng,
                });
            }
        }
    };

    useEffect(() => {
        if (id) {
            fetchAddressData(id);
        }
    }, [id]);

    // =========================================
    // 7. Лейблы
    // =========================================
    const handleLabelSelection = (labelType) => {
        if (labelType === 'Other') {
            setIsCustomLabelModalOpen(true);
        } else {
            setLabel(labelType);
        }
    };

    const handleCustomLabelSave = () => {
        if (!customLabel.trim()) {
            setCustomLabelError(true);
            return;
        }
        setLabel(customLabel.trim());
        setCustomLabel('');
        setCustomLabelError(false);
        setIsCustomLabelModalOpen(false);
    };

    const isFormValid = address.trim() && postcode.trim() && phone.trim() && farmName.trim() && description.trim();

    // =========================================
    // Рендер
    // =========================================
    return (
        <Container isFullScreen={isFullScreen}>
            <MapContainer isFullScreen={isFullScreen} mapHeight={mapHeight}>
                <MapView
                    style={{ flex: 1 }}
                    // Здесь для карты нужно { latitude, longitude } — берем из lat/lng
                    region={{
                        latitude: coordinates.lat,
                        longitude: coordinates.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    onPress={handleMapPress}
                >
                    {/* Marker тоже ожидает { latitude, longitude } */}
                    <Marker
                        coordinate={{
                            latitude: coordinates.lat,
                            longitude: coordinates.lng,
                        }}
                    />
                </MapView>

                {/* Кнопка SetPoint */}
                <MapButton
                    active={isInteractive}
                    position={70}
                    onPress={() => setIsInteractive(!isInteractive)}
                >
                    <SetPoint
                        width={36}
                        height={36}
                        fill={isInteractive ? colors.neutral.white : colors.brown.earth}
                    />
                </MapButton>

                {/* Кнопка FullScreen */}
                <MapButton
                    active={isFullScreen}
                    position={130}
                    onPress={() => setIsFullScreen(!isFullScreen)}
                >
                    {isFullScreen ? (
                        <DecreaseMap
                            width={36}
                            height={36}
                            fill={isFullScreen ? colors.neutral.white : colors.brown.earth}
                        />
                    ) : (
                        <IncreaseMap
                            width={36}
                            height={36}
                            fill={isFullScreen ? colors.neutral.white : colors.brown.earth}
                        />
                    )}
                </MapButton>

                {/* Кнопка Auto-Detect */}
                <MapButton position={10} onPress={handleAutoDetect}>
                    <FindLocation width={36} height={36} fill={colors.brown.earth} />
                </MapButton>
            </MapContainer>

            {/* Форма */}
            {!isFullScreen && (
                <>
                    <InputLabel>Address</InputLabel>
                    <Input value={address} onChangeText={setAddress} />

                    <Row>
                        <HalfWidthInput38>
                            <InputLabel>Post Code</InputLabel>
                            <Input value={postcode} onChangeText={setPostcode} />
                        </HalfWidthInput38>
                        <HalfWidthInput58>
                            <InputLabel>Contact Phone</InputLabel>
                            {/*<Input value={phone} onChangeText={setPhone} />*/}
                            <Input
                                value={phone}
                                onChangeText={handlePhoneChange} // Используем обновленный обработчик
                                placeholder="+1234567890"
                                keyboardType="phone-pad"
                                style={phoneError ? { borderColor: 'red' } : {}}
                            />
                            {phoneError && <ErrorMessage>Invalid phone number format. Use +1234567890</ErrorMessage>}
                        </HalfWidthInput58>
                    </Row>

                    <InputLabel>Farm Name</InputLabel>
                    <Input value={farmName} onChangeText={setFarmName} />

                    <InputLabel>Description</InputLabel>
                    <Input value={description} onChangeText={setDescription} />

                    <Button onPress={handleNextStep} disabled={!isFormValid}>
                        <ButtonText disabled={!isFormValid}>Next Step</ButtonText>
                    </Button>
                </>
            )}

            {/* Модалка для Custom Label */}
            <Modal visible={isCustomLabelModalOpen} transparent>
                <ModalOverlay>
                    <ModalContent>
                        <CloseButton onPress={() => setIsCustomLabelModalOpen(false)}>
                            <CloseButtonText>×</CloseButtonText>
                        </CloseButton>
                        <InputLabel>Custom Label</InputLabel>
                        <Input
                            value={customLabel}
                            onChangeText={(text) => {
                                setCustomLabel(text);
                                if (customLabelError) setCustomLabelError(false);
                            }}
                            style={{ borderColor: customLabelError ? 'red' : colors.brown.beige }}
                        />
                        {customLabelError && <ErrorMessage>The field must not be empty</ErrorMessage>}
                        <Button onPress={handleCustomLabelSave}>
                            <ButtonText>OK</ButtonText>
                        </Button>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </Container>
    );
};

export default LocationForm;