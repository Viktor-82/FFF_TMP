export const FETCH_COMMUNITY_SUCCESS = 'FETCH_COMMUNITY_SUCCESS';
export const FETCH_COMMUNITY_FAILURE = 'FETCH_COMMUNITY_FAILURE';
export const UPDATE_ITEM = 'UPDATE_ITEM';

export const fetchCommunitySuccess = (tab, data) => ({
    type: FETCH_COMMUNITY_SUCCESS,
    tab,
    payload: data,
});

export const fetchCommunityFailure = (tab, error) => ({
    type: FETCH_COMMUNITY_FAILURE,
    tab,
    payload: error,
});

export const updateItem = (tab, item) => ({
    type: UPDATE_ITEM,
    tab,
    payload: item,
});

