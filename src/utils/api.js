// native
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking } from 'react-native';
import { showToast } from '../components/Shared/Notification';
import { REACT_APP_API_BASE_URL } from '@env';
const API_BASE_URL = REACT_APP_API_BASE_URL || 'https://your-backend-api.com';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Добавляем перехватчик для добавления токена авторизации
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken'); // Используем AsyncStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Перехватчик ответов
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = error.response?.data?.message || 'Произошла ошибка, попробуйте снова.';
        showToast(errorMessage, 'error');  // Выводим ошибку через Toast
        return Promise.reject(error);
    }
);

// Экспортируем axiosInstance вместо axios
export default axiosInstance;

// === Аутентификация ===
// Функция для авторизации через Google с передачей rememberMe
export const authGoogle = async (rememberMe) => {
    const state = encodeURIComponent(JSON.stringify({ rememberMe }));
    const url = `${API_BASE_URL}/auth/google/client?state=${state}`;
    await Linking.openURL(url); // Открываем URL через Linking
};

// Функция для авторизации через Facebook с передачей rememberMe
export const authFacebook = async (rememberMe) => {
    const state = encodeURIComponent(JSON.stringify({ rememberMe }));
    const url = `${API_BASE_URL}/auth/facebook/client?state=${state}`;
    await Linking.openURL(url); // Открываем URL через Linking
};

// Функция для логина с передачей rememberMe
export const login = async (email, password, rememberMe) => {
    console.log('call from api.js', API_BASE_URL);
    return axiosInstance.post(`${API_BASE_URL}/login`, { email, password, rememberMe });
};

// Функция выхода из приложения
export const logout = () => axiosInstance.post(`${API_BASE_URL}/logout`);

// Функция для регистрации с передачей rememberMe
export const register = async (userData, rememberMe) => {
    console.log('call from api.js', API_BASE_URL);
    return axiosInstance.post(`${API_BASE_URL}/register`, { ...userData, rememberMe });
};

// Функция восстановления пароля
export const resetPassword = (email) => {
    return axiosInstance.post(`${API_BASE_URL}/auth/reset-password`, { email });
};

// === Профиль пользователя ===
export const getUserProfile = () => {
    return axiosInstance.get(`${API_BASE_URL}/me`);
};

// Смена пароля пользователем
export const updateUserProfile = (profileData) => {
    return axiosInstance.put(`${API_BASE_URL}/change-password`, profileData);
};

// Удаление аккаунта
export const deleteUser = (profileData) => {
    return axiosInstance.put(`${API_BASE_URL}/delete-account`, profileData);
};

// === Товары ===
export const getProducts = (params) => {
    return axiosInstance.get(`${API_BASE_URL}/products`, { params });
};

export const getProductDetails = (productId) => {
    return axiosInstance.get(`${API_BASE_URL}/products/${productId}`);
};

// === Корзина ===
export const getCartItems = () => {
    return axiosInstance.get(`${API_BASE_URL}/cart`);
};

export const addToCart = (productId, quantity) => {
    return axiosInstance.post(`${API_BASE_URL}/cart`, { productId, quantity });
};

export const updateCartItem = (itemId, quantity) => {
    return axiosInstance.put(`${API_BASE_URL}/cart/${itemId}`, { quantity });
};

export const removeCartItem = (itemId) => {
    return axiosInstance.delete(`${API_BASE_URL}/cart/${itemId}`);
};

// === Заказы ===
export const createOrder = (orderData) => {
    return axiosInstance.post(`${API_BASE_URL}/orders`, orderData);
};

export const getOrderHistory = () => {
    return axiosInstance.get(`${API_BASE_URL}/orders`);
};

export const getOrderDetails = (orderId) => {
    return axiosInstance.get(`${API_BASE_URL}/orders/${orderId}`);
};

// === Отзывы ===
export const submitReview = (productId, reviewData) => {
    return axiosInstance.post(`${API_BASE_URL}/products/${productId}/reviews`, reviewData);
};

export const getReviews = (productId) => {
    return axiosInstance.get(`${API_BASE_URL}/products/${productId}/reviews`);
};

// === Уведомления ===
export const subscribeToNotifications = (settings) => {
    return axiosInstance.post(`${API_BASE_URL}/notifications/subscribe`, settings);
};

export const getNotifications = () => {
    return axiosInstance.get(`${API_BASE_URL}/notifications`);
};