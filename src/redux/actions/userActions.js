export const SET_USER = 'SET_USER';
export const CLEAR_USER = 'CLEAR_USER';

export const setUser = (userData) => ({
    type: 'SET_USER',
    payload: userData,
});

export const clearUser = () => ({
    type: 'CLEAR_USER',
});

export const logoutUser = () => ({
    type: 'LOGOUT_USER',
});