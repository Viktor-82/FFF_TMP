import React from 'react';
// import { View, Text, FlatList } from 'react-native';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import ProductCard from '../components/Products/ProductCard';
import BackButton from '../components/Buttons/BackButton';

// Стили для контейнера
const ProductsContainer = styled.View`
  flex: 1;
  padding: 20px;
  //justify-content: start;
`;

// const ProductsCardWrapper = styled.View`
//   flex: 1;
//   justify-content: center;
//   align-items: center; /* Центрирует контент по горизонтали */
// `;

const ProductsCardWrapper = styled(View)`
  margin-top: 20px;
  padding: 1px; 
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 4px; 
`;

const SubcategoryProductsPage = () => {
    const route = useRoute();
    const { subcategory } = route.params; // Получаем параметр subcategory

    // Получаем продукты подкатегории из Redux
    const products = useSelector(
        (state) => state.product.subcategoryProductsMap[subcategory] || []
    );

    return (
        <ScrollView>
            <ProductsContainer>
                <BackButton />
                {products.length === 0 ? (
                    <Text>No products available</Text>
                ) : (
                    // <FlatList
                    //     data={products}
                    //     keyExtractor={(item) => item.id.toString()}
                    //     renderItem={({ item }) => <ProductCard product={item} />}
                    //     numColumns={2} // Два столбца
                    //     columnWrapperStyle={{
                    //         justifyContent: products.length === 1 ? "center" : "space-between", // Центрируем, если одна карточка
                    //         gap: 20, // Расстояние между карточками в ряду
                    //     }}
                    //     contentContainerStyle={{
                    //         paddingBottom: 20,
                    //         alignItems: products.length === 1 ? "center" : "stretch", // Центрируем список при одной карточке
                    //         gap: 20, // Расстояние между рядами карточек
                    //     }}
                    // />
                    <ProductsCardWrapper>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </ProductsCardWrapper>
                )}
            </ProductsContainer>
        </ScrollView>
    );
};

export default SubcategoryProductsPage;
