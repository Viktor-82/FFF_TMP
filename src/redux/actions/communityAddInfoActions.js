export const setCommunityAddInfo = (payload) => ({
    type: "SET_COMMUNITY_ADD_INFO",
    payload,
});

export const addCommunityAddPhoto = (photoUri) => ({
    type: "ADD_COMMUNITY_ADD_PHOTO",
    payload: photoUri,
});

export const removeCommunityAddPhoto = (index) => ({
    type: "REMOVE_COMMUNITY_ADD_PHOTO",
    payload: index,
});

export const delCommunityAddImg = (photoUri) => ({
    type: "DEL_COMMUNITY_ADD_IMG",
    payload: photoUri,
});

export const clearCommunityAddInfo = () => ({
    type: "CLEAR_COMMUNITY_ADD_INFO",
});