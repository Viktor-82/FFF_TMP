import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { colors } from '../../assets/styles/colors';

// Стили для контейнера с анимацией
const CartSummaryContainer = styled(Animated.View)`
  flex-direction: row;
  flex-grow: 1;
  align-items: center;
  margin-right: 12px;
  justify-content: space-between;
  background-color: ${colors.yellowOrange.golden};
  padding: 6px 10px;
  border-radius: 10px;
  position: absolute;
  bottom: 60px;
  left: 3px;
  width: 66.3%;
`;

// Стили для текста
const CartInfo = styled(View)`
  flex-direction: row;
  align-items: center;
  font-size: 16px;
`;

const CartIcon = styled(Text)`
  font-size: 24px;
  margin-right: 10px;
`;

const ItemsCostWrapper = styled(View)`
  margin-left: 8px;
`;

const CartInfoItems = styled(Text)`
  font-size: 16px;
  color: ${colors.brown.earth};
`;

const CartInfoCost = styled(Text)`
  font-size: 16px;
  color: ${colors.brown.earth};
`;

// Стили для кнопки "View Cart"
const ViewCartButton = styled(TouchableOpacity)`
  background-color: ${colors.green.grass};
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
`;

const ViewCartButtonText = styled(Text)`
  color: ${colors.neutral.white};
  font-size: 16px;
`;

const CartSummary = ({ itemCount, totalCost }) => {
    const slideAnim = useRef(new Animated.Value(100)).current; // Начальное значение за пределами экрана
    const navigation = useNavigation();

    const handleNavigate = () => {
        navigation.navigate('Cart'); // Переход на ProductPage с id
    };

    useEffect(() => {
        // Анимация появления
        Animated.timing(slideAnim, {
            toValue: 0, // Конечное положение (0 = на экране)
            duration: 400, // Длительность анимации
            useNativeDriver: true, // Использование нативного драйвера для повышения производительности
        }).start();
    }, []);

    return (
        <CartSummaryContainer
            style={{
                transform: [{ translateY: slideAnim }], // Применяем анимацию
            }}
        >
            <CartInfo>
                <CartIcon>🛒</CartIcon>
                <ItemsCostWrapper>
                    <CartInfoItems>{itemCount} unit{itemCount !== 1 && 's'}</CartInfoItems>
                    <CartInfoCost>Total cost: ${totalCost.toFixed(2)}</CartInfoCost>
                </ItemsCostWrapper>
            </CartInfo>
            {/*<ViewCartButton onPress={() => alert('View Cart pressed!')}>*/}
            <ViewCartButton onPress={handleNavigate}>
                <ViewCartButtonText>View {"\n"} Cart</ViewCartButtonText>
            </ViewCartButton>
        </CartSummaryContainer>
    );
};

export default CartSummary;