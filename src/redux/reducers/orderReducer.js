// import {
//     FETCH_ORDERS_REQUEST,
//     FETCH_ORDERS_SUCCESS,
//     FETCH_ORDERS_FAILURE,
//     SAVE_ORDER_RESPONSE,
//     CLEAR_LAST_ORDER,
// } from '../actions/orderActions';
//
// const initialState = {
//     activeOrders: { loading: false, error: null, data: [], lastFetched: null },
//     completedOrders: { loading: false, error: null, data: [], lastFetched: null },
//     lastOrder: null, // Добавляем для хранения последнего ответа
// };
//
// const orderReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case FETCH_ORDERS_REQUEST: {
//             const key = action.status === 'active' ? 'activeOrders' : 'completedOrders';
//             return {
//                 ...state,
//                 [key]: { ...state[key], loading: true, error: null },
//             };
//         }
//         case FETCH_ORDERS_SUCCESS: {
//             const key = action.payload.status === 'active' ? 'activeOrders' : 'completedOrders';
//             return {
//                 ...state,
//                 [key]: {
//                     loading: false,
//                     error: null,
//                     data: action.payload.orders,
//                     lastFetched: action.payload.timestamp,
//                 },
//             };
//         }
//         case FETCH_ORDERS_FAILURE: {
//             const key = action.payload.status === 'active' ? 'activeOrders' : 'completedOrders';
//             return {
//                 ...state,
//                 [key]: { loading: false, error: action.payload.error, data: [] },
//             };
//         }
//         case SAVE_ORDER_RESPONSE:
//             return {
//                 ...state,
//                 lastOrder: action.payload,
//             };
//         case CLEAR_LAST_ORDER:
//             return {
//                 ...state,
//                 lastOrder: null
//             };
//         default:
//             return state;
//     }
// };
//
// export default orderReducer;


import {
    FETCH_ORDERS_REQUEST,
    FETCH_ORDERS_SUCCESS,
    FETCH_ORDERS_FAILURE,
    SAVE_ORDER_RESPONSE,
    CLEAR_LAST_ORDER,
} from '../actions/orderActions';

const initialState = {
    newOrders: { loading: false, error: null, data: [], lastFetched: null },
    packedOrders: { loading: false, error: null, data: [], lastFetched: null },
    shippedOrders: { loading: false, error: null, data: [], lastFetched: null },
    lastOrder: null, // для хранения последнего ответа
};

const orderReducer = (state = initialState, action) => {
    // Определяем ключ в зависимости от переданного статуса
    let key;
    const currentStatus = action.type === FETCH_ORDERS_REQUEST ? action.status : (action.payload && action.payload.status);
    // switch (action.type === FETCH_ORDERS_REQUEST ? action.status : action.payload.status) {
    switch (currentStatus) {
        case 'new':
            key = 'newOrders';
            break;
        case 'packed':
            key = 'packedOrders';
            break;
        case 'shipped':
            key = 'shippedOrders';
            break;
        default:
            key = 'newOrders'; // на всякий случай
    }

    switch (action.type) {
        case FETCH_ORDERS_REQUEST:
            return {
                ...state,
                [key]: { ...state[key], loading: true, error: null },
            };
        case FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                [key]: {
                    loading: false,
                    error: null,
                    data: action.payload.orders,
                    lastFetched: action.payload.timestamp,
                },
            };
        case FETCH_ORDERS_FAILURE:
            return {
                ...state,
                [key]: { loading: false, error: action.payload.error, data: [] },
            };
        case SAVE_ORDER_RESPONSE:
            return {
                ...state,
                lastOrder: action.payload,
            };
        case CLEAR_LAST_ORDER:
            return {
                ...state,
                lastOrder: null,
            };
        default:
            return state;
    }
};

export default orderReducer;