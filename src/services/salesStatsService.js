import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSalesStats = async (dateRange, farmId) => {
    const { startDate, endDate } = dateRange;

    const query = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        farmId: farmId,
    }).toString();

    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
        throw new Error('Токен отсутствует. Пожалуйста, войдите в систему.');
    }

    try {
        const response = await axios.get(
            `https://marketplace-usa-backend-1.onrender.com/api/orders/get-sales-stats?${query}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log('getSalesStats Data', response.data);

        if (response.status !== 200) {
            throw new Error(`Ошибка сервера: ${response.statusText}`);
        }
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        throw error;
    }
};