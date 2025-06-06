import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WEBP_SUPPORT_KEY = "webpSupport"; // Ключ для хранения результата
let cachedWebPSupport = null; // Кэш в памяти для минимизации обращений

/**
 * Определяет, нужно ли запускать тест на поддержку WebP.
 * Проверяет платформу, браузер, версию ОС.
 *
 * @returns {boolean} - true, если требуется тест WebP, иначе false.
 */
function shouldRunWebPTest() {
    if (typeof window !== "undefined") {
        const userAgent = navigator.userAgent;

        // Проверка для iOS устройств
        if (/iPhone|iPad|iPod/.test(userAgent)) {
            const iOSVersionMatch = userAgent.match(/OS (\d+)_/);
            if (iOSVersionMatch) {
                const iOSVersion = parseInt(iOSVersionMatch[1], 10);
                return iOSVersion < 14; // Тест нужен, если версия ниже iOS 14
            }
        }

        // Современные браузеры, которые поддерживают WebP
        if (/Chrome\/|Firefox\/|Edge\/|Safari\//.test(userAgent)) {
            return false; // Тест не нужен
        }

        // Для других случаев тест требуется
        return true;
    }

    if (typeof Platform !== "undefined") {
        // React Native платформа
        if (Platform.OS === "ios") {
            const iOSVersion = parseInt(Platform.constants.osVersion.split(".")[0], 10);
            return iOSVersion < 14; // Тест нужен, если версия ниже iOS 14
        }

        if (Platform.OS === "android") {
            return false; // WebP поддерживается на Android, тест не нужен
        }
    }

    // Для неизвестных платформ тест требуется
    return true;
}

/**
 * Выполняет тест на поддержку WebP путем запроса тестового изображения через axios.
 *
 * @returns {Promise<boolean>} - true, если WebP поддерживается, иначе false.
 */
async function runWebPTest() {
    try {
        // Добавлено: теперь запрос выполняется с `responseType: 'blob'`, чтобы явно получать изображение
        const response = await axios.get("https://marketplace-usa-backend-1.onrender.com/api/products/check-webp", {
            responseType: "blob", // Получаем бинарный ответ
        });

        // Проверяем, что сервер вернул корректное изображение WebP
        if (response.status === 200 && response.data.type === "image/webp") {
            return true;
        }
    } catch (error) {
        console.error("WebP test failed:", error);
    }

    return false;
}

/**
 * Проверяет поддержку WebP с использованием кэша.
 * Если кэш найден, возвращает его.
 * Если нет, выполняет тест и сохраняет результат.
 *
 * @returns {Promise<boolean>} - true, если WebP поддерживается, иначе false.
 */
async function checkWebPSupport() {
    if (cachedWebPSupport !== null) {
        return cachedWebPSupport; // Используем кэш из памяти
    }

    let storedSupport;

    // Добавлено: проверка localStorage для Web
    if (typeof window !== "undefined" && window.localStorage) {
        storedSupport = localStorage.getItem(WEBP_SUPPORT_KEY);
        if (storedSupport !== null) {
            cachedWebPSupport = JSON.parse(storedSupport);
            return cachedWebPSupport;
        }
    }

    // React Native: используем AsyncStorage
    if (typeof Platform !== "undefined") {
        storedSupport = await AsyncStorage.getItem(WEBP_SUPPORT_KEY);
        if (storedSupport !== null) {
            cachedWebPSupport = JSON.parse(storedSupport);
            return cachedWebPSupport;
        }
    }

    // Если данных в кэше нет, запускаем проверку
    const isSupported = shouldRunWebPTest() ? await runWebPTest() : true;

    // Сохраняем результат в кэш и долгосрочное хранилище
    cachedWebPSupport = isSupported;

    // Добавлено: сохранение результата в localStorage для Web
    if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(WEBP_SUPPORT_KEY, JSON.stringify(isSupported));
    } else if (typeof Platform !== "undefined") {
        await AsyncStorage.setItem(WEBP_SUPPORT_KEY, JSON.stringify(isSupported));
    }

    return isSupported;
}

export { shouldRunWebPTest, runWebPTest, checkWebPSupport };


// // Это новый код
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
//
// const WEBP_SUPPORT_KEY = "webpSupport";
// let cachedWebPSupport = null;
//
// async function checkWebPSupport() {
//     if (cachedWebPSupport !== null) {
//         return cachedWebPSupport;
//     }
//
//     const storedSupport = await AsyncStorage.getItem(WEBP_SUPPORT_KEY);
//     if (storedSupport !== null) {
//         cachedWebPSupport = JSON.parse(storedSupport);
//         return cachedWebPSupport;
//     }
//
//     try {
//         const response = await axios.get("http://localhost:5000/api/products/check-webp");
//         cachedWebPSupport = response.data.supported;
//         await AsyncStorage.setItem(WEBP_SUPPORT_KEY, JSON.stringify(cachedWebPSupport));
//         return cachedWebPSupport;
//     } catch (error) {
//         console.error("WebP check failed:", error);
//         return false;
//     }
// }
//
// export { checkWebPSupport };
