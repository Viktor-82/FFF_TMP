import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ADD_PRODUCT = 'ADD_PRODUCT';
export const SET_PRODUCTS = 'SET_PRODUCTS';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';

// Типы действий для асинхронного запроса
export const FETCH_MY_FARM_PRODUCTS_REQUEST = 'FETCH_MY_FARM_PRODUCTS_REQUEST';
export const FETCH_MY_FARM_PRODUCTS_SUCCESS = 'FETCH_MY_FARM_PRODUCTS_SUCCESS';
export const FETCH_MY_FARM_PRODUCTS_FAILURE = 'FETCH_MY_FARM_PRODUCTS_FAILURE';

// Добавить один товар
export const addProduct = (product) => ({
    type: ADD_PRODUCT,
    payload: product,
});

// Установить список товаров (например, при загрузке с сервера)
export const setProducts = (products) => ({
    type: SET_PRODUCTS,
    payload: products,
});

export const updateProduct = (product) => ({
   type: UPDATE_PRODUCT,
   payload: product,
});

// Получить продукты фермы по farmId
export const fetchMyFarmProducts = (farmId) => async (dispatch) => {
    dispatch({ type: FETCH_MY_FARM_PRODUCTS_REQUEST });
    try {
        console.log('productAction farmId', farmId);
        const token = await AsyncStorage.getItem('authToken');
        console.log('Отправляемые данные:', { farmId });

        const { data } = await axios.get(
            `https://marketplace-usa-backend-1.onrender.com/api/products/get-products/${farmId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log('productsAction. Ответ сервера:', data);

        // Сохраняем продукты в Redux state
        dispatch({ type: FETCH_MY_FARM_PRODUCTS_SUCCESS, payload: data });
        dispatch(setProducts(data.combinedProducts)); // Обновляем состояние products

        return data; // Возвращаем данные продуктов для дальнейшего использования
    } catch (error) {
        console.error("Ошибка загрузки продуктов фермы:", error);
        dispatch({ type: FETCH_MY_FARM_PRODUCTS_FAILURE, payload: error.message });
        throw error; // Пробрасываем ошибку для обработки в вызывающем коде
    }
};