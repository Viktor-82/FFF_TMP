import {
    fetchNearbyProducts,
    setCategorySubcategoryData,
    setSubcategoryProductData,
    setProductImages,
} from '../redux/actions/productActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchImageLinks } from './imageService';
import { fetchTemporaryLinks } from './temporaryLinkService';
import { fetchFavorites } from '../redux/slices/essentialsSlice'; // Импортируем асинхронный экшен fetchFavorites

export const loadProductsData = async (dispatch, userLocation, radiusInMiles) => {
    if (userLocation) {
        try {
            const products = await dispatch(fetchNearbyProducts(userLocation, radiusInMiles));
            if (products && products.length > 0) {
                processProducts(dispatch, products);
                await dispatch(fetchFavorites());
            }
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        }
    }
};

// Определяем функцию processProducts
const processProducts = async (dispatch, products) => {
    const categorySubcategoriesMap = {};
    products.forEach((product) => {
        const { category, subcategory } = product;
        if (category && subcategory) {
            if (!categorySubcategoriesMap[category]) {
                categorySubcategoriesMap[category] = new Set();
            }
            categorySubcategoriesMap[category].add(subcategory);
        }
    });
    // Преобразуем множества в массивы
    Object.keys(categorySubcategoriesMap).forEach((category) => {
        categorySubcategoriesMap[category] = Array.from(categorySubcategoriesMap[category]);
    });
    // Сохраняем данные в Redux
    dispatch(setCategorySubcategoryData(categorySubcategoriesMap));

    // Создаем мапу подкатегорий и продуктов
    const subcategoryProductsMap = {};
    products.forEach((product) => {
        const { subcategory } = product;
        if (subcategory) {
            if (!subcategoryProductsMap[subcategory]) {
                subcategoryProductsMap[subcategory] = [];
            }
            subcategoryProductsMap[subcategory].push(product);
        }
    });
    // Сохраняем данные в Redux
    dispatch(setSubcategoryProductData(subcategoryProductsMap));

    // Обработка изображений продуктов
    try {
        const tokenExpiration = await AsyncStorage.getItem('authToken'); // Добавляем await
        const processedProducts = await fetchImageLinks(products, tokenExpiration); // Добавляем await
        const updatedProducts = await fetchTemporaryLinks(processedProducts); // Добавляем await
        console.log('Продукты с временными ссылками:', updatedProducts);
        dispatch(setProductImages(updatedProducts));
    } catch (error) {
        console.error('Ошибка получения временных ссылок:', error);
    }
};

