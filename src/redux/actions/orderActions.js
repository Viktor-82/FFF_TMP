export const FETCH_ORDERS_REQUEST = 'FETCH_ORDERS_REQUEST';
export const FETCH_ORDERS_SUCCESS = 'FETCH_ORDERS_SUCCESS';
export const FETCH_ORDERS_FAILURE = 'FETCH_ORDERS_FAILURE';
export const SAVE_ORDER_RESPONSE = 'SAVE_ORDER_RESPONSE';
export const CLEAR_LAST_ORDER = "CLEAR_LAST_ORDER";

export const fetchOrdersRequest = (status) => ({
    type: FETCH_ORDERS_REQUEST,
    status,
});

export const fetchOrdersSuccess = (status, orders, timestamp) => ({
    type: FETCH_ORDERS_SUCCESS,
    payload: { status, orders, timestamp },
});

export const fetchOrdersFailure = (status, error) => ({
    type: FETCH_ORDERS_FAILURE,
    payload: { status, error },
});

export const saveOrderResponse = (orderResponse) => ({
    type: SAVE_ORDER_RESPONSE,
    payload: orderResponse,
});

export const clearLastOrder = () => ({
    type: CLEAR_LAST_ORDER,
});