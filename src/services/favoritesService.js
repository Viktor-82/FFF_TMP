import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchUserFavorites = async (userId, token) => {
    try {
        const token = await AsyncStorage.getItem('authToken'); // Получаем токен из localStorage или другого источника
        const response = await axios.get(`https://marketplace-usa-backend-1.onrender.com/api/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data, 'CALL FAVORITES SERVICE');
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке избранных продуктов:", error);
        return [];
    }
};
