const initialState = {
    categories: [], // Начальное значение для списка категорий
    activeCategory: null, // Для отслеживания активной категории
};

const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return {
                ...state,
                categories: action.payload,
            };
        case 'SET_ACTIVE_CATEGORY':
            return {
                ...state,
                activeCategory: action.payload,
            };
        default:
            return state;
    }
};

export default categoryReducer;
