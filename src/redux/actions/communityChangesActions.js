export const UPDATE_COMMUNITY_CHANGES = "UPDATE_COMMUNITY_CHANGES";
export const CLEAR_COMMUNITY_CHANGES = "CLEAR_COMMUNITY_CHANGES";

// Добавление изменений в состояние
export const updateCommunityChanges = (_id, updatedFields) => ({
    type: UPDATE_COMMUNITY_CHANGES,
    payload: { _id, updatedFields },
});

// Очистка состояния после успешного обновления на сервере
export const clearCommunityChanges = () => ({
    type: CLEAR_COMMUNITY_CHANGES,
});