import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native"; // Используем навигацию из React Navigation
import {View, Text, Image, TouchableOpacity, Platform} from "react-native";
import styled from "styled-components/native";
import { colors } from "../../assets/styles/colors";
import QuantityControl from "../Shared/QuantityControl";

// Стили для тени
const shadowStyle = Platform.select({
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    android: {
        elevation: 5,
    },
});

// Контейнер карточки
const ProductCardContainer = styled.View`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border: 1px solid ${colors.neutral.lightGray};
  border-radius: 12px;
  ${Platform.OS === 'android' ? 'elevation: 5;' : ''} /* Тень для Android */
  width: 182px;
  background-color: ${colors.neutral.white};
  overflow: hidden;
`;

// Изображение товара
const ProductImage = styled.Image`
  width: 100%;
  aspect-ratio: 1; // стиль для квадратной картинки native
  border-radius: 8px;
`;

// Информация о товаре
const ProductInfo = styled.View`
  align-items: center; /* Центрируем дочерние элементы */
  width: 100%;
`;

const ProductName = styled.Text`
  font-size: 18px;
  color: ${colors.brown.earth};
  margin: 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

const ProductDescription = styled.Text`
  font-size: 14px;
  color: ${colors.green.grass};
  margin: 5px 0 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

const PriceContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: ${({ hasQuantity }) => (hasQuantity ? "space-between" : "center")}; /* Центрируем, если нет количества */
  margin: ${({ hasQuantity }) => (hasQuantity ? "0" : "7px 0 2px 0")};
  align-items: baseline;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: ${colors.green.grass};
`;

const PriceText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  flex: 1; /* Расширяется, если справа есть количество */
  text-align: ${({ hasQuantity }) => (hasQuantity ? "left" : "center")};
  color: ${colors.green.grass};
`;

const QuantityContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: baseline;
`;

const QuantityText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.brown.earth};
`;

const UnitText = styled.Text`
  font-size: 16px;
  color: ${colors.brown.earth};
`;

// const ProductCard = ({ product }) => {
const ProductCard = ({ product }) => {
    console.log('call from ProductCard', product);
    const [quantity, setQuantity] = useState(0);
    const navigation = useNavigation();

    // Извлекаем данные из Redux
    // const productImages = useSelector((state) => (product ? state.product.images[product.id] : []));
    const productImages = useSelector((state) => (product ? state.newProduct.photo : []));
    const cartItem = useSelector((state) => state.cart.items[product.id] || {});
    const getQuantity = cartItem.quantity || 0;

    // Проверяем, что product определён
    if (!product) {
        return null;
    }

    // Инициализируем необходимые переменные
    // const productId = product.id;
    const productName = product.name;
    const price = product.price;
    const unitDescr = product.unit_description;
    const unit = product.unit;
    const productImage = productImages.length > 0 ? productImages[0] : 'https://via.placeholder.com/150';
    const currency = '$';

    const handleNavigate = () => {
        // navigation.navigate('ProductDetail', { id: product.id }); // Переход на экран деталей товара
        navigation.navigate('ProductDetail', product); // Переход на экран деталей товара
    };

    return (
        <ProductCardContainer>
            <TouchableOpacity onPress={handleNavigate}>
                <ProductImage
                    source={{ uri: productImage }}
                    resizeMode="cover"
                />
            </TouchableOpacity>
            <ProductInfo>
                <ProductName>{productName}</ProductName>
                <ProductDescription>{unitDescr}</ProductDescription>
                <PriceContainer hasQuantity={getQuantity > 0}>
                    <PriceText hasQuantity={getQuantity > 0}>
                        {currency} {price} {getQuantity <= 0 && <>/ {unit}</>}
                    </PriceText>
                    {getQuantity > 0 && (
                        <QuantityContainer>
                            <QuantityText>{getQuantity}</QuantityText>
                            <UnitText>{unit}</UnitText>
                        </QuantityContainer>
                    )}
                </PriceContainer>
            </ProductInfo>
            <QuantityControl
                // productId={productId}
                initialQuantity={quantity}
                onAdd={(newQuantity) => setQuantity(newQuantity)}
                onRemove={() => setQuantity(0)}
                onChange={(newQuantity) => setQuantity(newQuantity)}
                displayQuantityOutside
                isProductCard={true}
            />
        </ProductCardContainer>
    );
};

export default ProductCard;