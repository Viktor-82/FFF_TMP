import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCategoriesList} from "../redux/actions/categoriesListActions";
// import { useDispatch } from 'react-redux';

export const fetchCategories = async (dispatch) => {
// export const fetchCategories = async () => {
//     const dispatch = useDispatch();
    try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios.get('https://marketplace-usa-backend-1.onrender.com/api/products/get-categories', {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;

        console.log('Категории/субкатегории с сервера', data);
        console.log('Содержимое dispatch', dispatch);

        const categoriesList = data.map((item) => ({
            id: item.id,
            name: item.name,
            has_other: item.has_other,
        }));
        const subcategoriesList = data.reduce((acc, item) => {
            acc[item.id] = item.subcategories.map((sub) => ({
                id: sub.id,
                name: sub.name,
                has_other: sub.has_other,
            }));
            return acc;
        }, {});

        dispatch(setCategoriesList(categoriesList, subcategoriesList));
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};