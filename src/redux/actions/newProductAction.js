export const setNewProduct = (payload) => ({
    type: "SET_NEW_PRODUCT",
    payload,
});

export const addPhoto = (photoUri) => ({
    type: "ADD_PHOTO",
    payload: photoUri,
});

export const removePhoto = (index) => ({
    type: "REMOVE_PHOTO",
    payload: index,
});

export const delImg = (photoUri) => ({
    type: "IMG_TO_DELETE",
    payload: photoUri,
});

export const clearNewProduct = () => ({
    type: "CLEAR_NEW_PRODUCT",
});