import React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import Tabs from "../Shared/Tabs";
import { View, Text } from 'react-native';
import { colors } from "../../assets/styles/colors";

// Контейнер для деталей продукта
const DetailsContainer = styled(View)`
  background-color: ${colors.neutral.white};
  border-radius: 18px 18px 0 0; /* 1.125rem = 18px */
  padding: 20px; /* 1.25rem = 20px */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); /* 0.125rem = 2px, 0.625rem = 10px */
  min-height: calc(100vh - 304px); /* 19rem = 304px */
`;

// Заголовок
const Title = styled(Text)`
  font-size: 24px; /* 1.5rem = 24px */
  font-weight: bold;
  color: ${colors.brown.earth};
  text-align: center;
`;

// Обертка для подзаголовка и цены
const SubTitlePriceWrapper = styled(View)``;

// Обертка для информации о продукте
const ProductInfoWrapper = styled(View)`
  margin: 15px 0 10px 0; /* 0.9375rem = 15px, 0.625rem = 10px */
  flex-direction: row;
  justify-content: space-between;
  padding: 0 28px; /* 1.75rem = 28px */
`;

// Подзаголовок
const SubTitle = styled(Text)`
  font-size: 16px; /* 1rem = 16px */
  color: ${colors.green.grass};
  margin: 5px 0; /* 0.3125rem = 5px */
`;

// Цена
const Price = styled(Text)`
  font-size: 24px; /* 1.5rem = 24px */
  color: ${colors.green.olive};
  margin: 10px 0; /* 0.625rem = 10px */
`;

// Рейтинг
const Rating = styled(View)`
  flex-direction: row;
  align-items: center;
  font-size: 16px; /* 1rem = 16px */
  color: ${colors.brown.earth};
`;

const Stars = styled(Text)`
  margin-right: 5px; /* 0.3125rem = 5px */
  color: ${colors.yellowOrange.golden};
`;

// const ProductDetails = ({ productId }) => {
const ProductDetails = () => {
    // const id = parseInt(productId);
    // const product = useSelector((state) =>
    //     state.product.items.find((item) => item.id === id)
    // );
    const product = useSelector((state) => state.newProduct );

    if (!product) {
        return <Text>Product not found</Text>;
    }

    const { name, price, unit_description, unit, description } = product;

    return (
        <DetailsContainer>
            {/* Название и описание */}
            <Title>{name}</Title>

            {/* Информация о продукте */}
            <ProductInfoWrapper>
                <SubTitlePriceWrapper>
                    {unit_description && (
                        <SubTitle>
                            {unit_description} | $ {price}/{unit}
                        </SubTitle>
                    )}
                    <Price>$ {price}/unit</Price>
                </SubTitlePriceWrapper>

                {/* Рейтинг */}
                <Rating>
                    <Stars>⭐⭐⭐⭐⭐</Stars>
                    {/*{rating} ({reviews} reviews)*/}
                </Rating>
            </ProductInfoWrapper>

            {/* Вкладки */}
            <Tabs
                tabs={[
                    { title: "Description", content: <Text>{description}</Text> },
                    { title: "Review", content: <Text>User reviews...</Text> },
                    { title: "Discussion", content: <Text>Product discussions...</Text> },
                ]}
            />
        </DetailsContainer>
    );
};

export default ProductDetails;