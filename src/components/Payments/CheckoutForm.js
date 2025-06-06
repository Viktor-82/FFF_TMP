import React, { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { saveOrderResponse } from '../../redux/actions/orderActions';
import store from '../../redux/store';
import { colors } from "../../assets/styles/colors";
import styled from "styled-components/native";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Стили для кнопки оплаты
const PaymentButton = styled(TouchableOpacity)`
  background-color: ${colors.green.grass};
  padding: 10px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const PaymentButtonText = styled.Text`
  color: ${colors.neutral.white};
  font-size: 18px;
`;

// Стили для формы оплаты
const PaymentForm = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

// Стили для ввода карты
const CardInput = styled(View)`
  width: 100%;
  max-width: 400px;
`;

const CheckoutForm = ({ totalCost, onSuccess }) => {
    const dispatch = useDispatch();
    const { confirmPayment } = useStripe();
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardDetails, setCardDetails] = useState(null);

    // Получаем данные корзины из Redux
    const cartItems = useSelector((state) => state.cart.items || {});

    // Получаем активный адрес из Redux
    const activeAddress = useSelector((state) => {
        const addresses = state.addresses.list || [];
        return addresses.find((address) => address.isActive);
    });

    // Получаем reservationResult
    const reservationResult = useSelector((state) => state.cart.reservationResult || {});

    // Преобразуем reservationResult в объект { productId: { reservedQuantity, reservationId } }
    const reservationDetails = Object.entries(reservationResult).reduce((acc, [pid, data]) => {
        acc[pid] = {
            reservedQuantity: data.reservedQuantity,
            reservationId: data.reservationId
        };
        return acc;
    }, {});

    const saveOrderToStorage = async (orderData) => {
        try {
            await AsyncStorage.setItem('unsyncedOrderData', JSON.stringify(orderData));
            console.log('Заказ сохранен в AsyncStorage');
        } catch (error) {
            console.error('Ошибка сохранения заказа в AsyncStorage:', error);
        }
    };

    const removeOrderFromStorage = async () => {
        try {
            await AsyncStorage.removeItem('unsyncedOrderData');
            console.log('Заказ удален из AsyncStorage');
        } catch (error) {
            console.error('Ошибка удаления заказа из AsyncStorage:', error);
        }
    };

    const handleSubmit = async () => {
        if (isProcessing || !cardDetails?.complete) return;
        setIsProcessing(true);

        try {
            const token = await AsyncStorage.getItem('authToken');

            // Создаем Payment Intent
            const paymentResponse = await axios.post(
                'https://marketplace-usa-backend-1.onrender.com/api/payment/create-payment-intent',
                { amount: Math.round(totalCost * 100), currency: 'usd' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const { clientSecret } = paymentResponse.data;
            console.log('ответ stripe', paymentResponse);

            // Подтверждаем платеж Stripe
            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                paymentMethodType: 'Card',
                billingDetails: {
                    email: 'user@example.com', // Замените на реальный email пользователя
                },
            });

            if (error) {
                Alert.alert('Error', <Text>{error.message}</Text>);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status.toLowerCase() === 'succeeded') {
                // Формируем данные для создания заказа
                const confirmData = {
                    items: cartItems,
                    amount: Number((Math.round(totalCost * 100) / 100).toFixed(2)),
                    currency: 'usd',
                    deliveryDetails: {
                        address: activeAddress?.address || 'No active address',
                        latitude: activeAddress?.coordinates?.lat || null,
                        longitude: activeAddress?.coordinates?.lng || null,
                    },
                    reservationDetails,
                };

                try {
                    // Сохранение заказа перед отправкой
                    await saveOrderToStorage(confirmData);

                    const orderResponse = await axios.post(
                        'https://marketplace-usa-backend-1.onrender.com/api/orders/create-order',
                        confirmData,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    console.log('Результат создания заказа:', orderResponse.data);

                    if (orderResponse.data && orderResponse.data.orderId) {
                        dispatch(saveOrderResponse(orderResponse.data));
                        // Удаляем заказ из AsyncStorage после успешного ответа сервера
                        await removeOrderFromStorage();
                    } else {
                        throw new Error('Некорректный ответ сервера');
                    }

                    // Очистка reservationResult
                    dispatch({ type: 'CLEAR_CART' });

                    // Очистка paymentIntervalId
                    const intervalId = store.getState().cart.paymentIntervalId;
                    if (intervalId) {
                        clearInterval(intervalId);
                        dispatch({ type: "SET_PAYMENT_INTERVAL_ID", payload: null });
                    }

                } catch (orderError) {
                    console.error('Ошибка при создании заказа:', orderError);
                    Alert.alert('Ошибка', 'Ошибка при создании заказа!');
                }
            }
        } catch (paymentError) {
            console.error('Ошибка при создании Payment Intent:', paymentError);
            Alert.alert('Ошибка', 'Ошибка при обработке платежа!');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <PaymentForm>
            <CardInput>
                <CardField
                    postalCodeEnabled={false}
                    placeholder={{
                        number: '4242 4242 4242 4242', // Пример номера карты
                    }}
                    cardStyle={{
                        backgroundColor: '#FFFFFF',
                        textColor: '#000000',
                    }}
                    style={{
                        width: '100%',
                        height: 50,
                        marginVertical: 10,
                    }}
                    onCardChange={(cardDetails) => {
                        setCardDetails(cardDetails);
                    }}
                />
            </CardInput>
            <PaymentButton
                onPress={handleSubmit}
                disabled={!cardDetails?.complete || isProcessing}
            >
                {isProcessing ? (
                    <ActivityIndicator color={colors.neutral.white} />
                ) : (
                    <PaymentButtonText>Pay ${totalCost.toFixed(2)}</PaymentButtonText>
                )}
            </PaymentButton>
        </PaymentForm>
    );
};

export default CheckoutForm;