export const UPDATE_PRODUCT_CHANGES = "UPDATE_PRODUCT_CHANGES";
export const CLEAR_PRODUCT_CHANGES = "CLEAR_PRODUCT_CHANGES";

// Добавление изменений в состояние
export const updateProductChanges = (product_id, updatedFields) => ({
    type: UPDATE_PRODUCT_CHANGES,
    payload: { product_id, updatedFields },
});

// Очистка состояния после успешного обновления на сервере
export const clearProductChanges = () => ({
    type: CLEAR_PRODUCT_CHANGES,
});
