import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, Text, Platform } from 'react-native';

import CartItem from "../components/Cart/CartItem";
import ConfirmOrderButton from "../components/Cart/ConfirmOrderButton";
import OrderConfirmationModal from "../components/Cart/OrderConfirmationModal";
import BackButton from "../components/Buttons/BackButton";

import { confirmOrder, saveOrderToLocalStorage } from '../services/orderService';
import {
    updateProductStock,
    removeFromCart,
    updateReservationResult,
    updateCartItems
} from '../redux/actions/cartActions';
import { removeProduct } from "../redux/actions/productActions";

import { colors } from "../assets/styles/colors";

const CartContainer = styled.View`
  flex: 1; /* Заменяем height: 100vh */
  flex-direction: column;
  background-color: ${colors.neutral.white};
`;

const CartHeaderContent = styled.View`
  padding: 20px 20px 0 20px;
`;

const CartDivider = styled.View`
  margin-top: 20px;
  height: 2px;
  background-color: ${colors.brown.lightEarth};  
`;

const CartContent = styled.View`
  flex: 1;
  /* В React Native вместо overflow-y: auto используется ScrollView, 
     либо просто flex, если вы используете FlatList. */
  padding: 10px 20px;
`;

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

const CartFooterContainer = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 15px 20px;
  ${Platform.OS === 'android' ? 'elevation: 5;' : ''}
`;

const TotalCostText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
`;

const CartPage = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();

    // Здесь вместо location.state (веб) используем route.params (React Native)
    // { isOpen, totalCost } передаются через navigation.navigate('CartPage', { isOpen: true, totalCost: 100 })
    const { isOpen, totalCost } = route.params || {};

    const cartItemsObject = useSelector((state) => state.cart.items || {});
    const products = useSelector((state) => state.product.items || []);
    const reservationResult = useSelector((state) => state.cart.reservationResult || {});

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderResult, setOrderResult] = useState(null);

    // Аналог useEffect(() => { if (location.state?.isOpen && ...) }, [location.state])
    useEffect(() => {
        // Если isOpen === true и totalCost !== undefined, сразу открываем модалку
        if (isOpen && typeof totalCost !== 'undefined') {
            setIsModalOpen(true);
        }
    }, [isOpen, totalCost]);

    // Собираем товары из cartItemsObject (ключ=ID, значение=Item)
    const cartItems = Object.entries(cartItemsObject).map(([id, item]) => ({
        id,
        ...item,
    }));

    // Находим детали товаров (price, name и т.п.) в products
    const cartItemsWithDetails = cartItems.map((cartItem) => {
        const productDetails = products.find((p) => p.id === +cartItem.id);
        return {
            ...cartItem,
            ...productDetails,
        };
    });

    // Считаем сумму
    const calculatedTotalCost = cartItemsWithDetails.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
        0
    );

    // Оформление заказа
    const handleConfirmOrder = async () => {
        try {
            const response = await confirmOrder(cartItems);
            dispatch(updateReservationResult(response.result));

            setOrderResult(response.result);
            setIsModalOpen(true);

            for (const [id, result] of Object.entries(response.result)) {
                if (result.error) {
                    if (result.error === 'Товар закончился') {
                        dispatch(removeFromCart(Number(id)));
                        dispatch(removeProduct(Number(id)));
                    }
                } else if (result.message.includes('частично')) {
                    dispatch(updateProductStock(Number(id), result.remaining || 0));
                    dispatch(updateCartItems(Number(id), result.reservedQuantity || 0));
                }
            }

            // Сохраняем заказ в localStorage (или AsyncStorage),
            // но логика та же
            const newOrder = {
                order_number: null,
                total_price: calculatedTotalCost,
                items: cartItemsWithDetails.map((item) => ({
                    product_id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    unit: item.unit,
                })),
            };

            saveOrderToLocalStorage(newOrder);
            console.log("Текущий заказ успешно заменил предыдущий в localStorage");
        } catch (error) {
            console.error('Ошибка при отправке заказа:', error);
        }
    };

    return (
        <CartContainer>
            <CartHeaderContent>
                <BackButton isCartPage={true} />
                <Text style={{ fontSize: 20, marginTop: 8 }}>Cart</Text>
                <CartDivider />
            </CartHeaderContent>

            {/* Содержимое корзины */}
            <CartContent>
                {cartItemsWithDetails.map((product) => (
                    <CartItem key={product.id} product={product} />
                ))}
            </CartContent>

            {/* Футер: кнопка подтверждения заказа */}
            <CartFooterContainer style={shadowStyle}>
                <TotalCostText>Total cost: ${calculatedTotalCost.toFixed(2)}</TotalCostText>
                <ConfirmOrderButton onConfirm={handleConfirmOrder} />
            </CartFooterContainer>

            {/* Модальное окно подтверждения (OrderConfirmationModal) */}
            <OrderConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                orderResult={orderResult}
                totalCost={typeof totalCost !== 'undefined' ? totalCost : calculatedTotalCost}
            />
        </CartContainer>
    );
};

export default CartPage;
