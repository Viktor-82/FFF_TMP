import { RESET_STORE } from '../actions/resetActions';

const initialState = {
    reset: false
};

const resetReducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_STORE:
            return { reset: true }; // Просто флаг сброса
        default:
            return state;
    }
};

export default resetReducer;


