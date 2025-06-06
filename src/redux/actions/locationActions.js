// src/redux/actions/locationActions.js

/**
 * Экшен для обновления информации о местоположении пользователя.
 * Действие принимает объект с данными о местоположении и адресе.
 */

export const UPDATE_LOCATION = 'UPDATE_LOCATION';

export const updateLocation = (locationData) => ({
    type: UPDATE_LOCATION,
    payload: locationData,
});
