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
import { loadProductsData } from "../services/productService";
import { colors } from "../assets/styles/colors";
import {useNavigation, useRoute} from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { fetchCategories } from "../services/categoryService";
import { fetchMyFarmProducts } from "../redux/actions/productsAction";
import WarehouseProductCard from "../components/Cart/WarehouseProductCard";
import { clearNewProduct } from "../redux/actions/newProductAction";

// Стили для контейнера страницы
const PageContainer = styled(View)`
  flex: 1;
  background-color: #FDFDFD;
`;

// Стили для заголовка
const Header = styled(Text)`
  font-size: 24px;
  font-weight: bold;
`;

const FarmId = styled(Text)`
  font-size: 18px;
  font-weight: bold;
`;

const TopContainer = styled(View)`
  position: relative;
  height: auto;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: ${({ hasFarmId }) => (hasFarmId ? "0 10px" : "10px")};
  width: 100%;
`;

const Divider = styled.View`
  position: absolute;
  height: 1px;
  width: 120%;
  background-color: whitesmoke;
  bottom: 0;
`;

const UploadButton = styled.TouchableOpacity`
  background-color: ${({ disabled }) => (disabled ? colors.green.lightGreen : colors.green.grass)};
  padding: 5px 9px 5px 5px;
  border-radius: 8px;
  align-items: center;
  //margin-top: 5px;
  //width: 32%;
  width: 130px;
`;

const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
`;


const SubmitButtonText = styled.Text`
  color: ${({ isDisabled }) => (isDisabled ? colors.brown.earth : colors.neutral.white)};
  font-size: 16px;
  margin-left: 2px;
`;

const BottomContainer = styled.View`
  height: 70px;
`;

const WarehousePage = () => {
    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.addresses.list);
    const products = useSelector((state) => state.products.items || []);  // адаптирую и использую
    const isLoading = useSelector((state) => state.product.loading);
    const error = useSelector((state) => state.product.error);
    const selectedCategory = useSelector((state) => state.product.selectedCategory);

    const navigation = useNavigation();

    const activeAddress = addresses.find((address) => address.isActive);
    const userLocation = activeAddress ? activeAddress.coordinates : null;
    const radiusInMiles = 10;

    const farmId = addresses.find(item => item.isActive === true)?.farmId;

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

    useEffect(() => {
        console.log('вызов useEffect');
        console.log('farmId:', farmId);
        if (farmId) {
            dispatch(fetchMyFarmProducts(farmId));  // только такой вызов работает
        } else {
            console.log('farmId не определен, запрос не выполнен');
        }
    // }, [dispatch, farmId]);
    }, [farmId]);

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

    const handleAddProduct = async () => {
        try {
            await fetchCategories(dispatch); // Вызов сервиса для загрузки категорий
            // await fetchCategories(); // Вызов сервиса для загрузки категорий
            const flag = false;
            dispatch(clearNewProduct());
            navigation.navigate('EditableWarehouse', flag); // Навигация после успешной загрузки
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Функция для редактирования продукта
    const handleEditProduct = (product, flag) => {
        navigation.navigate("EditableWarehouse", { product, flag });
    };

    // Функция для просмотра продукта как клиент
    const handleViewAsCustomer = (product) => {
        navigation.navigate("ProductDetails", { product });
    };

    return (
        <PageContainer>
            {/*<SearchBar />*/}
            {/*<Header>Your Products</Header>*/}
            {farmId &&
                <TopContainer hasFarmId={!!farmId}>
                    <View>
                        <Header>Your Products</Header>
                        <FarmId>Farm ID: {farmId}</FarmId>}
                    </View>
                    {/*<FarmId>farm:{farmId}</FarmId>*/}
                    <UploadButton onPress={handleAddProduct}>
                        <ButtonContent>
                            <Icon name="add" size={20} color="white" />
                            <SubmitButtonText>Add Product</SubmitButtonText>
                        </ButtonContent>
                    </UploadButton>
                    <Divider />
                </TopContainer>
            }

            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text>Error loading categories: {error}</Text>
            ) : products.length === 0 ? (
                <Text>No products available</Text>
            ) : (
                <ScrollView>
                    {products.map((product) => (
                        <WarehouseProductCard
                            key={product.product_id}
                            product={{
                                ...product,
                                photo: product.images?.[0]?.url || "", // передаем первое изображение
                            }}
                            onEdit={(prod, flg) => handleEditProduct(prod, flg)}
                            onViewAsCustomer={() => handleViewAsCustomer(product)}
                        />
                    ))}
                </ScrollView>
            )}
            <BottomContainer />
            <BottomNavigation />
        </PageContainer>
    );
};

export default WarehousePage;