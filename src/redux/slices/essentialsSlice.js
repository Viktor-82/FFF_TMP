import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Асинхронный экшен для добавления в избранное
export const addFavorite = createAsyncThunk(
    'essentials/addFavorite',
    async ({ productId, productName }, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            await axios.post(
                'https://marketplace-usa-backend-1.onrender.com/api/favorites',
                { productId, productName },
                // { productId: Number(productId), productName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return productId;
            // return Number(productId);
        } catch (error) {
            console.error('Ошибка при добавлении в избранное:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

// Асинхронный экшен для удаления из избранного
export const removeFavorite = createAsyncThunk(
    'essentials/removeFavorite',
    async (productId, { rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            await axios.delete(
                'https://marketplace-usa-backend-1.onrender.com/api/favorites',
                {
                    headers: { Authorization: `Bearer ${token}` },
                    // data: { productId },
                    data: { productId: Number(productId) },
                }
            );
            // return productId;
            return Number(productId);
        } catch (error) {
            console.error('Ошибка при удалении из избранного:', error);
            return rejectWithValue(error.response.data);
        }
    }
);

/*Функция получает данные сервера по избранным товарам, сравнивает с доступными в
* локации продуктами по двум параметрам - id и name и возвращает essentials.items избранных
* для данной локации */
export const fetchFavorites = createAsyncThunk(
    'essentials/fetchFavorites',
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            const response = await axios.get('https://marketplace-usa-backend-1.onrender.com/api/favorites', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const favoritesFromServer = response.data; // Массив объектов { productId, productName }

            // Получаем текущие продукты из состояния Redux
            const state = getState();
            const products = state.product.items || [];

            // Сравниваем и извлекаем id совпадающих продуктов по id и name
            const favoriteIds = favoritesFromServer
                .filter(fav =>
                    products.some(
                        prod =>
                            // prod.id === +fav.productId &&
                            prod.id === Number(fav.productId) &&
                            prod.name === fav.productName
                    )
                )
                // .map(fav => fav.productId);
                .map(fav => Number(fav.productId));

            return favoriteIds; // Возвращаем массив id избранных продуктов
        } catch (error) {
            console.error('Ошибка при получении избранных товаров:', error);
            return rejectWithValue(error.response.data || 'Ошибка сервера');
        }
    }
);



const essentialsSlice = createSlice({
    name: "essentials",
    initialState: {
        items: [], // Здесь хранятся id избранных товаров
        loading: false,
        error: null,
    },
    reducers: {
        // Если нужны синхронные экшены, можно оставить здесь
    },
    extraReducers: (builder) => {
        builder
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.items = state.items.filter((id) => id !== action.payload);
            })
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = action.payload; // Обновляем essentials.items массивом id
            })
            .addMatcher(
                (action) => action.type.startsWith('essentials/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('essentials/') && action.type.endsWith('/fulfilled'),
                (state) => {
                    state.loading = false;
                }
            )
            .addMatcher(
                (action) => action.type.startsWith('essentials/') && action.type.endsWith('/rejected'),
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export default essentialsSlice.reducer;
