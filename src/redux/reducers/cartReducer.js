import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_PRODUCT_STOCK,
    UPDATE_RESERVATION_RESULT,
    UPDATE_CART_ITEMS,
    SET_PAYMENT_INTERVAL_ID,
    CLEAR_CART,
} from '../actions/cartActions';

const initialState = {
    items: {}, // { productId: { quantity, price } }
    productStock: {}, // { productId: stock }
    reservationResult: {}, // { productId: result }
    paymentIntervalId: null, // Добавляем новое поле для хранения идентификатора таймера
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART: {
            const { productId, quantity, price } = action.payload;
            return {
                ...state,
                items: {
                    ...state.items,
                    [productId]: {
                        quantity,
                        price,
                    },
                },
            };
        }

        case REMOVE_FROM_CART: {
            const { [action.payload]: removedItem, ...restItems } = state.items;
            const { [action.payload]: removedStock, ...restStock } = state.productStock;

            return {
                ...state,
                items: restItems,
                productStock: restStock,
            };
        }

        case UPDATE_PRODUCT_STOCK: {
            const { productId, stock } = action.payload;
            return {
                ...state,
                productStock: {
                    ...state.productStock,
                    [productId]: stock,
                },
            };
        }

        case UPDATE_RESERVATION_RESULT: {
            return {
                ...state,
                reservationResult: action.payload, // Полностью заменяем reservationResult
            };
        }


        case UPDATE_CART_ITEMS: {
            const { productId, quantity } = action.payload;
            return {
                ...state,
                items: {
                    ...state.items,
                    [productId]: {
                        ...state.items[productId],
                        quantity,
                    },
                },
            };
        }

        case SET_PAYMENT_INTERVAL_ID: {
            return {
                ...state,
                paymentIntervalId: action.payload,
            };
        }


        case CLEAR_CART: {
            return {
                ...state,
                items: {}, // Очистка корзины
                reservationResult: {}, // Сброс результатов резервирования
            };
        }

        default:
            return state;
    }
};

export default cartReducer;
