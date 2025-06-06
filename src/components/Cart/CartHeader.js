import React from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native"; // Заменяем useNavigate на useNavigation
import { colors } from "../../assets/styles/colors";
import { View, Text, TouchableOpacity } from 'react-native'; // Добавляем TouchableOpacity для кнопки

// Компонент CartHeader
// ОТВЕТСТВЕННОСТИ:
// 1. Отображает верхнюю часть корзины: заголовок "Cart", адрес доставки и сортировку.
// 2. Остается закрепленным в верхней части экрана при прокрутке содержимого корзины.
// 3. Обрабатывает сортировку товаров через передачу `activeSort` и `setActiveSort` в родительский компонент.
// 4. Содержит кнопку "Back" для возврата на предыдущую страницу.
//
// ИСПОЛЬЗУЕТСЯ:
// В компоненте `CartPage.js` как часть отображения страницы корзины.

const HeaderContainer = styled.View`
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  background-color: ${colors.neutral.white};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const TopBar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const BackButton = styled(TouchableOpacity)`
  background: none;
  border: none;
`;

const BackButtonText = styled.Text`
  color: ${colors.green};
  font-size: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.brown.earth};
`;

const DeliveryInfo = styled.Text`
  font-size: 16px;
  color: ${colors.brown.beige};
`;

const DeliveryText = styled.Text`
  font-weight: bold;
  color: ${colors.green};
`;

const SortContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.brown.beige};
`;

const SortButton = styled(TouchableOpacity)`
  padding: 10px;
`;

const SortButtonText = styled.Text`
  font-size: 16px;
  color: ${props => (props.active ? colors.brown.earth : colors.brown.beige)};
  font-weight: ${props => (props.active ? "bold" : "normal")};
`;

const Underline = styled.View`
  height: 2px;
  background-color: ${colors.yellowOrange.golden};
  margin-top: 5px;
  display: ${props => (props.active ? "flex" : "none")};
`;

const CartHeader = ({ activeSort, setActiveSort }) => {
    const navigation = useNavigation(); // Используем useNavigation вместо useNavigate

    return (
        <HeaderContainer>
            {/* Верхняя строка */}
            <TopBar>
                <BackButton onPress={() => navigation.goBack()}>
                    <BackButtonText>{"<"}</BackButtonText>
                </BackButton>
                <Title>Cart</Title>
            </TopBar>

            {/* Информация о доставке */}
            <DeliveryInfo>
                Delivery in <DeliveryText onPress={() => console.log("Change address")}>46005</DeliveryText>
            </DeliveryInfo>

            {/* Сортировка */}
            <SortContainer>
                <SortButton onPress={() => setActiveSort("added")}>
                    <SortButtonText active={activeSort === "added"}>AS THEY WERE ADDED</SortButtonText>
                    <Underline active={activeSort === "added"} />
                </SortButton>
                <SortButton onPress={() => setActiveSort("category")}>
                    <SortButtonText active={activeSort === "category"}>BY CATEGORY</SortButtonText>
                    <Underline active={activeSort === "category"} />
                </SortButton>
            </SortContainer>
        </HeaderContainer>
    );
};

export default CartHeader;