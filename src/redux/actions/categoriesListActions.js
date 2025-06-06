export const SET_CATEGORIES_LIST = 'SET_CATEGORIES_LIST';

export const setCategoriesList = (categories, subcategories) => ({
    type: 'SET_CATEGORIES_LIST',
    payload: { categories, subcategories },
});