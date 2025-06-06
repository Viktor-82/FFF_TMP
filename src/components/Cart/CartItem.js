import React, { useState } from "react";
import { useSelector } from "react-redux";
import QuantityControl from "../Shared/QuantityControl";
import styled from "styled-components/native";
import { View, Text, Image } from 'react-native';
import { colors } from "../../assets/styles/colors";

// Стили для контейнера CartItem
const CartItemContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 15px 0; /* 0.9375rem = 15px */
  border-bottom-width: 1px; /* 0.0625rem = 1px */
  border-bottom-color: #e0e0e0;
  gap: 10px; /* 0.625rem = 10px */
`;

// Стили для изображения товара
const ImageContainer = styled(View)`
  width: 65px; /* 4.0625rem = 65px */
  height: 65px;
`;

const ProductImage = styled(Image)`
  width: 100%;
  height: 100%;
  border-radius: 5px; /* 0.3125rem = 5px */
`;

// Стили для блока информации о товаре
const InfoContainer = styled(View)`
  flex: 1;
  flex-direction: column;
  gap: 5px; /* 0.3125rem = 5px */
`;

const Name = styled(Text)`
  font-size: 16px; /* 1rem = 16px */
  font-weight: bold;
  //white-space: nowrap;
  //overflow: hidden;
  //text-overflow: ellipsis;
`;

const PriceContainer = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  gap: 5px; /* 0.3125rem = 5px */
`;

const OldPrice = styled(Text)`
  font-size: 14px; /* 0.9rem = 14px */
  color: #b0b0b0;
  text-decoration: line-through;
`;

const NewPrice = styled(Text)`
  font-size: 19px; /* 1.2rem = 19px */
  font-weight: bold;
  color: red;
`;

const NormalPrice = styled(Text)`
  font-size: 19px; /* 1.2rem = 19px */
  font-weight: bold;
  color: ${colors.green.olive};
`;

const PriceQuantityWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

// Стили для блока управления количеством
const QuantityContainer = styled(View)`
  align-items: center;
  justify-content: flex-end;
`;

const CartItem = ({ product }) => {
    const { id, name, price, discountPrice } = product;
    const [quantity, setQuantity] = useState(0);

    // Извлекаем изображения из Redux
    const productImages = useSelector((state) => state.product.images[id] || []);
    const productImage =
        productImages.length > 0 ? productImages[0] : "https://via.placeholder.com/50";

    return (
        <CartItemContainer>
            {/* Изображение товара */}
            <ImageContainer>
                <ProductImage source={{ uri: productImage }} />
            </ImageContainer>

            {/* Информация о товаре */}
            <InfoContainer>
                <Name numberOfLines={1}>{name}</Name>
                <PriceQuantityWrapper>
                    <PriceContainer>
                        {discountPrice ? (
                            <>
                                <OldPrice>${price}</OldPrice>
                                <NewPrice>${discountPrice}</NewPrice>
                            </>
                        ) : (
                            <NormalPrice>${price}</NormalPrice>
                        )}
                    </PriceContainer>
                    {/* Управление количеством */}
                    <QuantityContainer>
                        <QuantityControl
                            productId={+id}
                            initialQuantity={quantity}
                            onAdd={(newQuantity) => setQuantity(newQuantity)}
                            onRemove={() => setQuantity(0)}
                            onChange={(newQuantity) => setQuantity(newQuantity)}
                            isCart={true}
                        />
                    </QuantityContainer>
                </PriceQuantityWrapper>
            </InfoContainer>
        </CartItemContainer>
    );
};

export default CartItem;