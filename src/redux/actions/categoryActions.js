export const fetchCategories = () => async (dispatch) => {
    try {
        const response = await fetch('/api/categories'); // Убедись, что этот эндпоинт работает
        const data = await response.json();
        dispatch({
            type: 'SET_CATEGORIES',
            payload: data,
        });
    } catch (error) {
        console.error('Ошибка загрузки категорий:', error);
    }
};

export const setActiveCategory = (categoryId) => {
    return {
        type: 'SET_ACTIVE_CATEGORY',
        payload: categoryId,
    };
};
