import React from 'react';
import { useNavigation } from '@react-navigation/native'; // Заменяем useNavigate на useNavigation
import { useDispatch } from 'react-redux';
import { clearUser } from '../../redux/actions/userActions';
import axiosInstance from '../../utils/api';
import { showToast } from '../Shared/Notification';
import { TouchableOpacity, Text } from 'react-native'; // Добавляем TouchableOpacity и Text для кнопки
import AsyncStorage from '@react-native-async-storage/async-storage'; // Заменяем localStorage и sessionStorage на AsyncStorage

const Logout = () => {
    const navigation = useNavigation(); // Используем useNavigation вместо useNavigate
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axiosInstance.post('/logout'); // Запрос на сервер для завершения сессии, если необходимо
            await AsyncStorage.removeItem('authToken'); // Удаляем токен из AsyncStorage
            dispatch(clearUser()); // Очищает данные пользователя в Redux
            navigation.navigate('Login'); // Перенаправление на страницу входа
            showToast('You have successfully logged out of your account', 'success');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            showToast('Error when exiting. Try again.', 'error');
        }
    };

    return (
        <TouchableOpacity onPress={handleLogout} style={{ padding: 10 }}>
            <Text style={{ fontSize: 16 }}>Log out</Text>
        </TouchableOpacity>
    );
};

export default Logout;