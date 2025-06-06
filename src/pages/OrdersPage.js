import React from "react";
import Orders from "../components/Orders/Orders";
import styled from "styled-components/native";
import { View, Text, ScrollView } from 'react-native';
import BottomNavigation from "../components/Shared/BottomNavigation";

// Стили для контейнера страницы заказов
const OrderPageContainer = styled(View)`
  flex: 1;
  background-color: #fff;
`;

const ScrollContainer = styled(ScrollView).attrs(() => ({
    contentContainerStyle: {
        padding: 18, // Указываем padding через атрибуты
    },
}))`
  flex: 1;
`;

// Стили для заголовка
const Header = styled(Text)`
  margin: 25px 0; /* 1.5625rem = 25px */
  font-size: 24px; /* 1.5rem = 24px */
  font-weight: bold;
`;

const OrdersPage = () => {
    return (
        <OrderPageContainer>
            <ScrollContainer keyboardShouldPersistTaps="handled">
            <Header>Orders</Header>
            <Orders />
            </ScrollContainer>
            <BottomNavigation/>
        </OrderPageContainer>
    );
};

export default OrdersPage;