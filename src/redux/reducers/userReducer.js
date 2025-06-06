import { SET_USER, CLEAR_USER } from '../actions/userActions';

// Для хранения имени пользователя
const initialState = {
    username: '',
    email: '',
    id: null, // добавлено
    role: '', // добавлено
};

const userReducer = (state = initialState, action) => {
    console.log('Action payload:', action.payload); // Отладочный вывод

    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                username: action.payload.username,
                email: action.payload.email,
                id: action.payload.id, // добавлено
                role: action.payload.role, // добавлено
            };
        case CLEAR_USER:
            return initialState;
        default:
            return state;
    }
};

export default userReducer;
