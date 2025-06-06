import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function fetchTemporaryLinks(processedProducts, expirationTime) {
    try {
        const token = await AsyncStorage.getItem('authToken'); // Получаем токен
        console.log("Отправляем токен:", token);
        console.log("Отправляем продукты:", processedProducts);
        console.log("Время действия ссылки:", expirationTime);

        const response = await axios.post(
            "https://marketplace-usa-backend-1.onrender.com/api/image/temporary-links",
            { products: processedProducts, expirationTime }, // Передаем продукты и время действия
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Ответ от сервера:", response.data); // Логируем ответ от сервера
        return response.data;
    } catch (error) {
        console.error("Ошибка при запросе временных ссылок:", error);
        throw error;
    }
}
