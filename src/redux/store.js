import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import reactotron from '../../reactotronConfig';  // Импортируем Reactotron

// Создаем хранилище с поддержкой Reactotron
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Подключаем middleware по умолчанию
    enhancers: (getDefaultEnhancers) => {
        // Добавляем Reactotron как усилитель (enhancer)
        if (reactotron.createEnhancer) {
            return getDefaultEnhancers().concat(reactotron.createEnhancer());
        }
        return getDefaultEnhancers();
    },
    devTools: {
        name: 'FarmFresh App', // Имя вашего приложения в DevTools
        trace: true, // Включает трассировку действий
    },
});

// Логируем начальное состояние хранилища в Reactotron
reactotron.log('Redux store initialized:', store.getState());

export default store;