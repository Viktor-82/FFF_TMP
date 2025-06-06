// src/redux/reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './userReducer'; // Импортируйте здесь свои редьюсеры
import locationReducer from './locationReducer';
import addressReducer from "./addressReducer";
import categoryReducer from "./categoryReducer";
import productReducer from "./productReducer";
import productsReducer from "./productsReducer";
import cartReducer from "./cartReducer";
import essentialsSlice from "../slices/essentialsSlice";
import searchSlice from "../slices/searchSlice";
import orderReducer from './orderReducer';
import resetReducer from "./resetReducer";
import { RESET_STORE } from '../actions/resetActions';
import newProductReducer from "./newProductReducer";
import productChangesReducer from "./productChangesReducer";
import categoriesListReducer from "./categoriesListReducer";
import salesStatsReducer from "./salesStatsReducer";
import communityReducer from "./communityReducer";
import communityAddInfoReducer from "./communityAddInfoReducer";
import communityChangesReducer from "./communityChangesReducer";

// const rootReducer = combineReducers({
const appReducer = combineReducers({
    user: userReducer, // Название и импорт редьюсера
    location: locationReducer,
    addresses: addressReducer,
    category: categoryReducer,
    product: productReducer,
    products: productsReducer,
    cart: cartReducer,
    essentials: essentialsSlice, // Указываем essentials как ключ
    search: searchSlice,
    orders: orderReducer,
    reset: resetReducer,
    newProduct: newProductReducer,
    productChanges: productChangesReducer,
    categories: categoriesListReducer,
    sales: salesStatsReducer,
    community: communityReducer,
    communityAddInfo: communityAddInfoReducer,
    communityChanges: communityChangesReducer,
    // добавьте другие редьюсеры, если есть
});

// Глобальный сброс всего Redux
const rootReducer = (state, action) => {
    if (action.type === RESET_STORE) {
        state = undefined; // Полностью очищает Redux-хранилище
    }
    return appReducer(state, action);
};


export default rootReducer;
