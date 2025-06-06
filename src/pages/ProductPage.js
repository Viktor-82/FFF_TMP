import React, { useState } from "react";
import { View, SafeAreaView, ScrollView, Platform } from 'react-native';
import styled from "styled-components/native";
import { useRoute } from '@react-navigation/native';
import BackButton from "../components/Buttons/BackButton";
import HeartButton from "../components/Buttons/HeartButton";
import ShareButton from "../components/Buttons/ShareButton";
import ProductDetails from "../components/Products/ProductDetails";
import ProductSlider from "../components/Products/ProductSlider";
import QuantityControl from "../components/Shared/QuantityControl";
import { colors } from "../assets/styles/colors";

// // Безопасная область
// const SafeContainer = styled(SafeAreaView)`
//   flex: 1;
//   background-color: ${colors.neutral.white};
// `;

// Контейнер для кнопок
const ButtonContainer = styled.View`
  position: absolute;
  flex-direction: row;
  top: 15px;
  justify-content: space-between;
  width: 100%;
  z-index: 2;
  //pointer-events: none; /* Пропускаем клики */
`;

const BackButtonContainer = styled.View`
  pointer-events: auto; /* Включаем клики только на кнопке */
  margin-left: 15px;
`;

const ShareButtonContainer = styled.View`
  pointer-events: auto; /* Включаем клики */
  margin-right: 15px;
  flex-direction: row;
  gap: 10px;
`;

const PageContainer = styled.View`
  position: relative;
  z-index: 0; /* Устанавливаем общий уровень */
  background-color: ${colors.neutral.white};
`;

const SliderWrapper = styled.View`
position: absolute;
  top: 0;
  width: 100%;
  height: 300px;
`

const ContentContainer = styled.View`
  z-index: 10; 
  position: relative;
  background-color: ${colors.neutral.white};
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  overflow: hidden;
  margin-top: 286px;
  height: 100%;
`;

// Стили для тени
const shadowStyle = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    android: {
        elevation: 10,
    },
});

const FixedQuantityControl = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 20px 20px 20px;
  background-color: ${colors.neutral.white};
  ${Platform.OS === 'android' ? 'elevation: 10;' : ''} /* Тень для Android */
  z-index: 10;
`;

const ProductPage = () => {
    const route = useRoute();
    // const { id } = route.params;
    const { id } = route.params;
    const [quantity, setQuantity] = useState(0);

    return (
        // <SafeContainer>

        <PageContainer>
            <ScrollView contentContainerStyle={{ paddingBottom: '100%' }}>
            {/*<ScrollView >*/}
            <ButtonContainer>
                <BackButtonContainer>
                <BackButton />
                </BackButtonContainer>
                <ShareButtonContainer>
                {/*<HeartButton productId={id} />*/}
                <HeartButton />
                <ShareButton />
                </ShareButtonContainer>
             </ButtonContainer>
            {/* Слайдер */}
            <SliderWrapper>
                {/*<ProductSlider productId={id} />*/}
                <ProductSlider/>
            </SliderWrapper>

            {/* Содержимое */}
            <ContentContainer>
                {/*<ProductDetails productId={id} />*/}
                <ProductDetails />
            </ContentContainer>
            </ScrollView>

            {/* Управление количеством */}
            <FixedQuantityControl>
                <QuantityControl
                    productId={+id}
                    initialQuantity={quantity}
                    onAdd={(newQuantity) => setQuantity(newQuantity)}
                    onRemove={() => setQuantity(0)}
                    onChange={(newQuantity) => setQuantity(newQuantity)}
                    isProductPage={true}
                />
            </FixedQuantityControl>
        </PageContainer>
// </SafeContainer>
    );
};

export default ProductPage;

