import axios from 'axios';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Типы действий
export const FETCH_ADDRESSES_SUCCESS = 'FETCH_ADDRESSES_SUCCESS';
export const SET_ACTIVE_ADDRESS = 'SET_ACTIVE_ADDRESS';
export const UPDATE_LOCATION = 'UPDATE_LOCATION'; // Добавлено: Новый тип действия для обновления адреса

// Действие для получения адресов пользователя и установки активного адреса, если адрес единственный
export const fetchAndSetDefaultAddress = () => async (dispatch) => {
        console.log('fetchAndSetDefaultAddress ВЫЗВАН');
    try {
        const token = await AsyncStorage.getItem('authToken'); // Получаем токен из localStorage или другого источника
        // const response = await axios.get('https://marketplace-usa-backend-1.onrender.com/get-user-addresses', {
        const response = await axios.get('https://marketplace-usa-backend-1.onrender.com/api/farmers/farms', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); // Запрос на сервер для получения адресов
        const resData = response.data; // приходят составные данные. меняю строку доступа
        // const addresses = response.data;
        const addresses = resData.mongoFarms;
        console.log(addresses, 'DATA FROM SERVER');

        dispatch({ type: FETCH_ADDRESSES_SUCCESS, payload: addresses }); // Сохранение адресов в Redux

        if (addresses.length === 1 && !addresses[0].isActive) {
            dispatch(activateAddress(addresses[0]._id));
            console.log("Активирован единственный адрес:", addresses[0]._id, typeof (addresses[0]._id));
        }
    } catch (error) {
        console.error("Failed to fetch account_page", error);
    }
};

// Действие для получения ферм без установки активной для просмотра фермы
export const fetchAddresses = () => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        // const response = await axios.get('https://marketplace-usa-backend-1.onrender.com/get-user-addresses', {
        const response = await axios.get('https://marketplace-usa-backend-1.onrender.com/api/farmers/farms', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }); // Запрос на сервер для получения адресов
        // const addresses = response.data;
        const resData = response.data; // приходят составные данные. меняю строку доступа
        const addresses = resData.mongoFarms;
        console.log('Сработала функция fetchAddresses');
        console.log('resData', resData);
        console.log(addresses, 'МАССИВ ЗНАЧЕНИЙ');

        dispatch({ type: FETCH_ADDRESSES_SUCCESS, payload: addresses }); // Сохранение адресов в Redux
        return addresses; // Возвращаем массив адресов для дальнейшего использования
    } catch (error) {
        console.error("Failed to fetch account_page", error);
    }
};

// Действие для обновления адреса в Redux
export const updateLocation = (locationData) => ({
    type: UPDATE_LOCATION,
    payload: locationData,
});

// Действие для установки активного адреса
export const setActiveAddress = (address) => ({
    type: SET_ACTIVE_ADDRESS,
    payload: address,
});

export const activateAddress = (addressId) => async (dispatch, getState) => {
    const state = getState();
    const isAlreadyActive = state.addresses.list.some(address => address._id === addressId && address.isActive);

    if (isAlreadyActive) return; // Прекращаем выполнение, если адрес уже активен

    console.log(addressId, 'ID ADDRESS');
    try {
        const token = await AsyncStorage.getItem('authToken');
        await axios.put(`https://marketplace-usa-backend-1.onrender.com/api/farmers/activate-farm-address/${addressId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch(fetchAndSetDefaultAddress()); // Обновляем адреса после активации
    } catch (error) {
        console.error("Failed to activate address:", error);
    }
};

// Действие для удаления адреса
export const deleteAddress = (addressId) => async (dispatch) => {
    console.log(addressId, 'ID ADDRESS');
    try {
        // Логика для запроса на сервер на удаление адреса
        const token = await AsyncStorage.getItem('authToken');
        await axios.delete(`https://marketplace-usa-backend-1.onrender.com/delete-user-address/${addressId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        dispatch(fetchAndSetDefaultAddress()); // Обновляем адреса после удаления
        Toast.show({ // Используем Toast из react-native-toast-message
            type: 'info', // Тип сообщения (success, error, info)
            text1: 'Address deleted', // Заголовок
            text2: 'The address has been successfully deleted.', // Описание (опционально)
        });
    } catch (error) {
        console.error("Failed to delete address:", error);
    }
};
