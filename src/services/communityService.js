import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../components/Shared/Notification';

export const getCommunityInfo = async (type, farmId) => {
    console.log('getCommunityInfo', type, farmId);
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
        throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');
    }
    try {
        const response = await axios.get(
            `https://marketplace-usa-backend-1.onrender.com/api/farmers/get-community-info`,
            {
                params: { type, farmId },
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('getCommunityInfo', response.data);

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }
        return response.data; // Ожидаем массив информации
    } catch (error) {
        console.error('Ошибка при получении информации community:', error);
        throw error;
    }
};