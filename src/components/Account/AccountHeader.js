import React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import { View, Text } from 'react-native'; // Добавляем View и Text для React Native

/**
 * AccountHeader
 * Компонент для отображения имени пользователя и адреса доставки.
 * Используется в `AccountPage` для верхней части страницы.
 * Данные о пользователе берутся из Redux.
 */

// Стили для контейнера заголовка
const HeaderContainer = styled.View`
  padding: 20px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #e0e0e0;
`;

const UserName = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 0;
  padding-left: 20px;
`;

// Адрес доставки
const DeliveryInfo = styled.Text`
  font-size: 16px;
  color: #6B8E23;
  margin: 5px 0 0;
`;

const AccountHeader = () => {
    // Получаем данные пользователя из Redux
    const userName = useSelector((state) => state.user.name);
    const deliveryAddress = useSelector((state) => state.user.deliveryAddress);

    return (
        <HeaderContainer>
            <UserName>{userName}</UserName>
            <DeliveryInfo>Delivery in {deliveryAddress}</DeliveryInfo>
        </HeaderContainer>
    );
};

export default AccountHeader;