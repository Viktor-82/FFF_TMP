// src/redux/reducers/locationReducer.js

import { UPDATE_LOCATION } from '../actions/locationActions';

const initialState = {
    address: '',
    street: '',
    postCode: '',
    apartment: '',
    latitude: null,
    longitude: null,
};

const locationReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_LOCATION:
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export default locationReducer;
