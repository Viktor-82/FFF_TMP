import { checkWebPSupport } from "./webpSupportService";
import { getDeviceType } from "./deviceTypeService";
import { getLinkExpirationTime } from "./linkExpirationService";

/**
 * Обрабатывает изображения для каждого продукта, выбирая нужный формат и размер.
 *
 * @param {Array} products - Массив продуктов с путями к изображениям.
 * @param {string} tokenExpiration - Время действия токена.
 * @returns {Promise<Array>} - Массив обработанных продуктов с нужными изображениями и временем действия.
 */
async function fetchImageLinks(products, tokenExpiration) {
    const deviceType = getDeviceType(); // mobile или desktop
    const supportsWebP = await checkWebPSupport(); // true или false
    const expirationTime = getLinkExpirationTime(tokenExpiration); // Время действия ссылки

    // Формируем новый массив продуктов
    const processedProducts = products.map((product) => {
        // Отфильтровываем пути изображений по критериям
        const filteredImages = product.images.filter((imagePath) => {
            const isCorrectFormat = supportsWebP
                ? imagePath.endsWith(".webp")
                : imagePath.endsWith(".jpg");
            const isCorrectSize = deviceType === "mobile"
                ? imagePath.includes("_mobile")
                : imagePath.includes("_desktop");
            return isCorrectFormat && isCorrectSize;
        });

        // Логируем результат фильтрации
        console.log(
            `Обработанный продукт (ID: ${product.id}):`,
            filteredImages
        );

        return {
            id: product.id, // ID продукта
            images: filteredImages, // Отфильтрованные изображения
            expirationTime, // Время действия ссылки
        };
    });

    console.log("Результат обработки всех продуктов:", processedProducts);

    return processedProducts;
}

export { fetchImageLinks };
