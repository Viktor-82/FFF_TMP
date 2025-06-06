import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Добавляем константы типов действий
export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';

// Другие константы действий
export const SET_CATEGORY_SUBCATEGORY_DATA = 'SET_CATEGORY_SUBCATEGORY_DATA';
export const SET_SUBCATEGORY_PRODUCT_DATA = 'SET_SUBCATEGORY_PRODUCT_DATA';
export const SET_SELECTED_CATEGORY = 'SET_SELECTED_CATEGORY';
export const SET_PRODUCT_IMAGES = "SET_PRODUCT_IMAGES";

export const fetchNearbyProducts = (location, radiusInMiles) => async (dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    try {
        const token = await AsyncStorage.getItem('authToken');
        console.log('Отправляемые данные:', { location, radiusInMiles });
        const { data } = await axios.post(
            "https://marketplace-usa-backend-1.onrender.com/api/products/products-by-location",
            { location, radiusInMiles },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        console.log('Ответ сервера:', data);
        dispatch({ type: FETCH_PRODUCTS_SUCCESS, payload: data });

        // Инициализируем stock продуктов в cartReducer
        data.forEach((product) => {
            dispatch(updateProductStock(product.id, product.stock));
        });

        return data; // Возвращаем данные продуктов
    } catch (error) {
        console.error("Ошибка загрузки продуктов:", error);
        dispatch({ type: FETCH_PRODUCTS_FAILURE, payload: error.message });
        throw error; // Пробрасываем ошибку для обработки в вызывающем коде
    }
};

export const setSubcategoryProducts = (products) => ({
    type: "SET_SUBCATEGORY_PRODUCTS",
    payload: products,
});

// Экшен для сохранения данных категорий и подкатегорий
export const setCategorySubcategoryData = (categorySubcategoriesMap) => ({
    type: SET_CATEGORY_SUBCATEGORY_DATA,
    payload: categorySubcategoriesMap,
});

// Экшен для сохранения данных подкатегорий и продуктов
export const setSubcategoryProductData = (subcategoryProductsMap) => ({
    type: SET_SUBCATEGORY_PRODUCT_DATA,
    payload: subcategoryProductsMap,
});

export const setSelectedCategory = (category) => ({
    type: SET_SELECTED_CATEGORY,
    payload: category,
});

// Action для обновления ссылок на изображения продуктов
export const setProductImages = (imageLinks) => ({
    type: SET_PRODUCT_IMAGES,
    payload: imageLinks,
});

export const updateProductStock = (productId, stock) => ({
    type: 'UPDATE_PRODUCT_STOCK',
    payload: { productId, stock },
});

export const removeProduct = (productId) => ({
    type: 'REMOVE_PRODUCT',
    payload: productId,
});
