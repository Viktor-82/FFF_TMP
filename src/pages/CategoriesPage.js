import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/native";
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from "../components/Shared/SearchBar";
import BottomNavigation from "../components/Shared/BottomNavigation";
import CategoryItem from "../components/Categories/CategoryItem";
import SubcategoryList from "../components/Categories/SubcategoryList";
import { setSelectedCategory } from "../redux/actions/productActions";
import BottomBar from "../components/Shared/BottomBar";
import { loadProductsData } from "../services/productService";

// Стили для контейнера страницы
const PageContainer = styled(View)`
  flex: 1;
  background-color: #FDFDFD;
`;

// Стили для заголовка
const Header = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  padding: 10px 20px; 
  z-index: 10;
`;

const CategoriesPage = () => {
    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.addresses.list);
    const products = useSelector((state) => state.product.items || []);
    const isLoading = useSelector((state) => state.product.loading);
    const error = useSelector((state) => state.product.error);
    const selectedCategory = useSelector((state) => state.product.selectedCategory);

    const activeAddress = addresses.find((address) => address.isActive);
    const userLocation = activeAddress ? activeAddress.coordinates : null;
    const radiusInMiles = 10;

    // Добавлена проверка времени последнего обновления данных
    useEffect(() => {
        const fetchData = async () => {
            if (userLocation) {
                const lastUpdate = await AsyncStorage.getItem("lastProductsUpdate");
                const oneDayInMs = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

                if (!lastUpdate || Date.now() - lastUpdate > oneDayInMs) {
                    await loadProductsData(dispatch, userLocation, radiusInMiles);
                    await AsyncStorage.setItem("lastProductsUpdate", Date.now().toString());
                }
            }
        };

        fetchData();
    }, [dispatch, userLocation]);

    // Извлечение уникальных категорий из списка продуктов
    const categories = [...new Set(products.map((product) => product.category))];

    // Обработчик клика по категории
    const handleCategoryClick = (category) => {
        if (selectedCategory === category) {
            dispatch(setSelectedCategory(null)); // Сворачиваем подкатегории
        } else {
            dispatch(setSelectedCategory(category)); // Устанавливаем выбранную категорию
        }
    };

    return (
        <PageContainer>
            {/*<SearchBar />*/}
            <Header>Your Products</Header>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text>Error loading categories: {error}</Text>
            ) : categories.length === 0 ? (
                <Text>No categories available</Text>
            ) : (
                <ScrollView>
                    {categories.map((category, index) => {
                        const isActive = selectedCategory === category;
                        return (
                            <View key={index}>
                                <CategoryItem
                                    category={{ name: category }}
                                    isActive={isActive}
                                    onClick={() => handleCategoryClick(category)}
                                />
                                {isActive && <SubcategoryList category={category} />}
                            </View>
                        );
                    })}
                </ScrollView>
            )}
            {/*<BottomBar />*/}
            <BottomNavigation />
        </PageContainer>
    );
};

export default CategoriesPage;