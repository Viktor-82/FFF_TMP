import {
    FETCH_COMMUNITY_SUCCESS,
    FETCH_COMMUNITY_FAILURE,
    UPDATE_ITEM,
} from '../actions/communityActions';

const initialSubState = {
    data: [],
    loading: false,
    error: null,
};

const initialState = {
    plans: { ...initialSubState },
    reviews: { ...initialSubState },
    history: { ...initialSubState },
};

const communityReducer = (state = initialState, action) => {
    const { type, payload, tab } = action;

    switch (type) {
        case FETCH_COMMUNITY_SUCCESS:
            return {
                ...state,
                [tab]: {
                    data: payload,
                    loading: false,
                    error: null,
                },
            };
        case FETCH_COMMUNITY_FAILURE:
            return {
                ...state,
                [tab]: {
                    ...state[tab],
                    loading: false,
                    error: payload,
                },
            };
        case UPDATE_ITEM:
            console.log("UPDATE_ITEM reducer", tab, payload);

            return {
                ...state,
                [tab]: {
                    ...state[tab],
                    data: {
                        ...state[tab].data,
                        items: state[tab].data.items.map(existingItem =>
                            existingItem._id === payload._id ? payload : existingItem
                        ),
                    },
                    loading: false,
                    error: null,
                },
            };

        default:
            return state;
    }
};

export default communityReducer;

