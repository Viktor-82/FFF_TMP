import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper'; // Используем библиотеку для слайдера
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import { colors } from '../../assets/styles/colors';

// Обёртка для стилей Swiper
const StyledSwiperContainer = styled.View`
  height: 300px; /* Высота слайдера */
  width: 100%;
`;

// const ProductSlider = ({ productId }) => {
const ProductSlider = () => {
    // const images = useSelector((state) => state.product.images[productId] || []);
    const images = useSelector((state) => state.newProduct.photo || []);

    console.log('Изображения для продукта:', images);

    // Проверка на случай отсутствия изображений
    if (images.length === 0) {
        return <Text>Изображения для этого продукта отсутствуют.</Text>;
    }

    return (
        <StyledSwiperContainer>
            <Swiper
                showsPagination={true}
                paginationStyle={{ bottom: 19 }}
                // dotColor={colors.brown.lightEarth}
                // activeDotColor={colors.green.olive}
                loop={false}
                dot={<View style={{
                    width: 16,
                    height: 6,
                    backgroundColor: colors.brown.lightEarth,
                    borderRadius: 3,
                    marginHorizontal: 4
                }} />}
                activeDot={<View style={{
                    width: 24,
                    height: 6,
                    backgroundColor: colors.green.olive,
                    borderRadius: 3,
                    marginHorizontal: 4
                }} />}
            >
                {images.map((image, index) => (
                    <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: image }}
                            style={{ width: Dimensions.get('window').width, height: 300, resizeMode: 'cover' }}
                        />
                    </View>
                ))}
            </Swiper>
        </StyledSwiperContainer>
    );
};

export default ProductSlider;