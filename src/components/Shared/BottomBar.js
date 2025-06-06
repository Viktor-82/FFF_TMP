import React from "react";
import styled from "styled-components/native";
import { useSelector } from "react-redux";
import CartSummary from "./CartSummary";
import DeliverTo from "./DeliverTo";
import { View } from 'react-native';

// Общий контейнер
const BottomBarContainer = styled(View)`
  position: absolute;
  bottom: 6px; /* 4rem = 64px */
  left: 0;
  width: 100%;
  //flex-direction: row;
  justify-content: space-between;
  //padding: 10px; /* 0.625rem = 10px */
  z-index: 1000;
`;

function BottomBar({ onViewCart }) {
    // Извлекаем данные корзины из Redux
    const cartItems = useSelector((state) => state.cart.items);

    // Если cartItems — объект, преобразуйте его в массив
    const cartItemsArray = Object.values(cartItems);
    console.log(cartItemsArray, 'CART ITEMS ARRAY');

    // Считаем общее количество товаров
    const itemCount = cartItemsArray.reduce((total, item) => total + item.quantity, 0);
    console.log(itemCount, 'TOTAL ITEM COUNT');

    // Считаем общую стоимость товаров
    const totalCost = cartItemsArray.reduce(
        (total, item) => total + item.quantity * parseFloat(item.price),
        0
    );
    console.log(totalCost, 'TOTAL COST');

    // Извлекаем список адресов
    const activeAddress = useSelector((state) =>
        state.addresses.list.find((address) => address.isActive)
    );

    return (
        <BottomBarContainer>
            <CartSummary
                itemCount={itemCount}
                totalCost={totalCost}
                onViewCart={onViewCart}
            />
            <DeliverTo address={activeAddress?.label || "No address selected"} />
        </BottomBarContainer>
    );
}

export default BottomBar;