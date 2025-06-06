import {
    FETCH_SALES_STATS_REQUEST,
    FETCH_SALES_STATS_SUCCESS,
    FETCH_SALES_STATS_FAILURE,
} from '../actions/salesStatsActions';

const initialState = {
    loading: false,
    error: null,
    data: [],  // Например, массив объектов, по одному на выбранный товар
};

const salesStatsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SALES_STATS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_SALES_STATS_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                data: action.payload,
            };
        case FETCH_SALES_STATS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                data: [],
            };
        default:
            return state;
    }
};

export default salesStatsReducer;
