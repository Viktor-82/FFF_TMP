import React from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Products/ProductCard";
import styled from "styled-components/native";
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';

// Стили для контейнера избранных товаров
const EssentialsContainer = styled(View)`
  padding: 1px; 
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 4px; 
`;

const EssentialsBuffer = styled(View)`
  height: 125px;
`;

const MyEssentials = () => {
    // Получаем идентификаторы избранных товаров
    const essentialIds = useSelector((state) => state.essentials.items);
    console.log(essentialIds, 'ESSENTIALS IDS');

    // Получаем все товары из общего хранилища
    const allProducts = useSelector((state) => state.product.items); // Подкорректируйте путь, если он другой
    console.log(allProducts, 'ALL PRODUCTS');

    // Проверяем, загружены ли данные
    if (!allProducts || allProducts.length === 0) {
        return <ActivityIndicator size="large" color="#0000ff" />; // Индикатор загрузки
    }

    // Фильтруем товары по идентификаторам
    const essentials = allProducts.filter((product) =>
        essentialIds.map(Number).includes(product.id) // Приводим все идентификаторы из essentialIds к числам
    );

    // Проверяем, есть ли избранные товары
    if (essentials.length === 0) {
        return <Text>You do not have any favorite products.</Text>;
    }

    // Рендерим товары
    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <EssentialsContainer>
                {essentials.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </EssentialsContainer>
            <EssentialsBuffer/>
        </ScrollView>
    );
};

export default MyEssentials;