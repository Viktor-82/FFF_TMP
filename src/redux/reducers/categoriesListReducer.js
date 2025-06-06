import { SET_CATEGORIES_LIST } from '../actions/categoriesListActions';

const initialState = {
    categoriesList: [], // Список всех категорий [ { id, name }, ... ]
    subcategoriesList: {}, // Объект { category_id: [subcategory_name, ...], ... }
};

const categoriesListReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_CATEGORIES_LIST':
            return {
                ...state,
                categoriesList: action.payload.categories,
                subcategoriesList: action.payload.subcategories,
            };
        default:
            return state;
    }
};

export default categoriesListReducer;