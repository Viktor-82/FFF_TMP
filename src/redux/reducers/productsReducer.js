import {
    ADD_PRODUCT,
    SET_PRODUCTS,
    UPDATE_PRODUCT,
    FETCH_MY_FARM_PRODUCTS_REQUEST,
    FETCH_MY_FARM_PRODUCTS_SUCCESS,
    FETCH_MY_FARM_PRODUCTS_FAILURE,
} from '../actions/productsAction';

const initialState = {
    items: [],
    loading: false, // Статус загрузки
    error: null,    // Ошибка, если есть
};

const productsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MY_FARM_PRODUCTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_MY_FARM_PRODUCTS_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload, // Можно убрать, если используете только SET_PRODUCTS
            };
        case FETCH_MY_FARM_PRODUCTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case ADD_PRODUCT:
            return {
                ...state,
                items: [...state.items, action.payload],
            };
        case SET_PRODUCTS:
            return {
                ...state,
                items: action.payload,
            };
        case UPDATE_PRODUCT:
            return {
                ...state,
                items: state.items.map(item =>
                    item.product_id === action.payload.product_id ? action.payload : item
                ),
            };
        default:
            return state;
    }
};

export default productsReducer;