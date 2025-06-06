// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// // Получает токен из AsyncStorage
// export const getToken = () => {
//     return AsyncStorage.getItem('authToken');
// };
// // Сохраняет токен в AsyncStorage
// export const setToken = async (token, rememberMe = false) => {
//     await AsyncStorage.setItem('authToken', token);
// };
// // Удаляет токен из AsyncStorage
// export const removeToken = () => {
//     AsyncStorage.removeItem('authToken');
// };
// // Проверяет, истек ли срок действия токена, расшифровывая его и проверяя поле exp
// export const isTokenExpired = (token) => {
//     if (!token) return true;
//     try {
//         const { exp } = JSON.parse(atob(token.split('.')[1]));
//         return Date.now() >= exp * 1000;
//     } catch (error) {
//         console.error("Error decoding token", error);
//         return true;
//     }
// };
// // Удаляет токен и перенаправляет на страницу логина, запоминая последнюю посещенную страницу
// export const handleTokenExpiration = (navigation, lastPage = '/') => {
//     removeToken();
//     navigation('/login', { state: { from: lastPage } });
// };
// // Инициализирует токен при входе и проверяет его срок действия
// export const initializeToken = (token, rememberMe = false, navigation, lastPage = '/') => {
//     if (isTokenExpired(token)) {
//         handleTokenExpiration(navigation, lastPage);
//     } else {
//         setToken(token, rememberMe);
//     }
// };
// // Периодически проверяет истечение срока действия токена и выполняет выход, если срок истек
// export const startTokenExpirationCheck = (navigation, interval = 5 * 60 * 1000) => {
//     const checkInterval = setInterval(() => {
//         const token = getToken();
//         if (!token || isTokenExpired(token)) {
//             handleTokenExpiration(navigation);
//             clearInterval(checkInterval); // Останавливаем проверку после истечения
//         }
//     }, interval);
//
//     return checkInterval;
// };

import AsyncStorage from '@react-native-async-storage/async-storage';

// Получает токен из AsyncStorage
export const getToken = async () => {
    return await AsyncStorage.getItem('authToken');
};

// Сохраняет токен в AsyncStorage
export const setToken = async (token, rememberMe = false) => {
    await AsyncStorage.setItem('authToken', token);
    console.log('call from tokenManager');
};

// Удаляет токен из AsyncStorage
export const removeToken = async () => {
    await AsyncStorage.removeItem('authToken');
};

// Проверяет, истек ли срок действия токена
export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const { exp } = JSON.parse(atob(token.split('.')[1]));
        return Date.now() >= exp * 1000;
    } catch (error) {
        console.error("Error decoding token", error);
        return true;
    }
};

// Удаляет токен и перенаправляет на страницу логина
export const handleTokenExpiration = async (navigation, lastPage = '/') => {
    await removeToken();
    navigation.navigate('Login', { from: lastPage }); // Используйте navigation.navigate для React Native
};

// Инициализирует токен при входе и проверяет его срок действия
export const initializeToken = async (token, rememberMe = false, navigation, lastPage = '/') => {
    if (isTokenExpired(token)) {
        await handleTokenExpiration(navigation, lastPage);
    } else {
        await setToken(token, rememberMe);
    }
};

// Периодически проверяет истечение срока действия токена
export const startTokenExpirationCheck = (navigation, interval = 5 * 60 * 1000) => {
    const checkInterval = setInterval(async () => {
        const token = await getToken();
        if (!token || isTokenExpired(token)) {
            await handleTokenExpiration(navigation);
            clearInterval(checkInterval);
        }
    }, interval);

    return checkInterval;
};