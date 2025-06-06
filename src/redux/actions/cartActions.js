// src/redux/actions/cartActions.js

export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_PRODUCT_STOCK = 'UPDATE_PRODUCT_STOCK'; // Новое действие
export const CLEAR_CART = 'CLEAR_CART';
export const UPDATE_RESERVATION_RESULT = 'UPDATE_RESERVATION_RESULT';
export const UPDATE_CART_ITEMS = 'UPDATE_CART_ITEMS'; // Новый тип действия
export const SET_PAYMENT_INTERVAL_ID = 'SET_PAYMENT_INTERVAL_ID';

export const addToCart = (productId, quantity, price) => ({
    type: ADD_TO_CART,
    payload: { productId, quantity, price },
});

export const removeFromCart = (productId) => ({
    type: REMOVE_FROM_CART,
    payload: productId,
});

// Экшен для обновления stock продукта
export const updateProductStock = (productId, stock) => ({
    type: UPDATE_PRODUCT_STOCK,
    payload: { productId, stock },
});

export const clearCart = () => ({
    type: CLEAR_CART,
});
// Обновление резервов для корзины
export const updateReservationResult = (result) => ({
    type: UPDATE_RESERVATION_RESULT,
    payload: result,
});

// Новый экшен для обновления количества товара в корзине
export const updateCartItems = (productId, quantity) => ({
    type: UPDATE_CART_ITEMS,
    payload: { productId, quantity },
});

// Очистка интервала в случае отмены резерва руками
export const setPaymentIntervalId = (intervalId) => ({
    type: SET_PAYMENT_INTERVAL_ID,
    payload: intervalId,
});