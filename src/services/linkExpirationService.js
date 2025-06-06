import { jwtDecode } from 'jwt-decode'; // Убедитесь, что этот пакет установлен (npm install jwt-decode)

/**
 * Рассчитывает время окончания ссылки на основе JWT.
 *
 * @param {string} token - JWT токен.
 * @param {number} bufferSeconds - Дополнительное время в секундах (по умолчанию 5 минут).
 * @returns {number} - Время действия ссылки в секундах.
 */
function getLinkExpirationTime(token, bufferSeconds = 300) {
    try {
        // Декодируем токен
        const decoded = jwtDecode(token);

        if (!decoded.exp) {
            throw new Error("Поле 'exp' отсутствует в токене");
        }

        const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
        const expTime = decoded.exp; // Время истечения токена (в секундах)

        // Вычисляем оставшееся время действия токена
        const remainingTime = expTime - currentTime;

        if (remainingTime <= 0) {
            throw new Error("Срок действия токена истек");
        }

        // Добавляем буферное время (по умолчанию 5 минут) и возвращаем
        return Math.max(remainingTime + bufferSeconds, 0); // Не возвращаем отрицательное время
    } catch (error) {
        console.error("Ошибка при декодировании JWT:", error.message);
        return 0; // Если токен недействителен или отсутствует, возвращаем 0
    }
}

// export default getLinkExpirationTime;
export { getLinkExpirationTime };

