import { FETCH_ADDRESSES_SUCCESS, UPDATE_LOCATION } from '../actions/addressActions';

const initialState = {
    list: [] // Начальное состояние для списка адресов
};

const addressReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ADDRESSES_SUCCESS:
            return { ...state, list: action.payload }; // Обновление списка адресов
        case UPDATE_LOCATION:
            return {
                ...state,
                list: [...state.list, action.payload] // Добавление нового адреса в список
            };
        default:
            return state;
    }
};

export default addressReducer;
