import React, { useState, useEffect } from 'react';
import {useNavigation, useRoute} from "@react-navigation/native";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';
import { colors } from '../../assets/styles/colors';

// Стили для контейнера
const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// Стили для кнопки
const Button = styled(TouchableOpacity)`
  background-color: ${colors.green.grass};
  padding: 12px 20px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

// Текст кнопки
const ButtonText = styled(Text)`
  color: ${colors.neutral.white};
  font-size: 16px;
  font-weight: bold;
`;

// Заголовок
const Title = styled(Text)`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

// Компонент StripeConnect
const StripeConnect = () => {
    const user = useSelector(state => state.user);
    const [stripeUrl, setStripeUrl] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();
    const route = useRoute();

    const [data, setData] = useState(route.params);

    // Проверка статуса аккаунта в Stripe
    const checkStripeStatus = async () => {
        try {
            const response = await axios.get(`https://marketplace-usa-backend-1.onrender.com/stripe/status/${user.id}`);
            setStatus(response.data);

            // Если есть `accountId`, получаем ссылку для управления аккаунтом
            if (response.data.accountId) {
                console.log('сервер подтвердил существование аккаунта stripe у фермера', response.status);
                const accountLinkResponse = await axios.post("https://marketplace-usa-backend-1.onrender.com/stripe/connect", {
                    farmerId: user.id
                });
                console.log("Stripe URL:", accountLinkResponse.data.url);
                setStripeUrl(accountLinkResponse.data.url);
            }
        } catch (error) {
            console.error("Ошибка проверки статуса Stripe:", error);
            Alert.alert("Ошибка", "Не удалось проверить статус Stripe.");
        } finally {
            setLoading(false);
        }
    };


    // Запрос на создание нового аккаунта (если его нет)
    const fetchStripeUrl = async () => {
        console.log('user from StripeConnect', user);
        if (status?.accountId) {
            Alert.alert("Ошибка", "У вас уже есть аккаунт Stripe.");
            return;
        }

        try {
            const response = await axios.post("https://marketplace-usa-backend-1.onrender.com/stripe/connect", {
                farmerId: user.id,
                name: user.username,
                email: user.email,
                phone: data.phone,
                address: data.address,
                postCode: data.postCode,
                country: data.region,
                region: data.region,
                subregion: data.subregion
            });

            console.log("Созданная Stripe-ссылка:", response.data.url);
            setStripeUrl(response.data.url);
        } catch (error) {
            console.error("Ошибка при получении URL:", error);
            Alert.alert("Ошибка", "Не удалось открыть Stripe.");
        }
    };

    useEffect(() => {
        checkStripeStatus();
    }, []);

    return (
        <Container>
            <Title>Connect your Stripe account</Title>

            {loading ? (
                <ActivityIndicator size="large" color={colors.green.grass} />
            ) : (
                <>
                    {status ? (
                        <Text>Status: {status.payouts_enabled ? "Payouts Enabled" : "Pending Verification"}</Text>
                    ) : (
                        <Text>Checking account status...</Text>
                    )}

                    {stripeUrl ? (
                        <WebView source={{ uri: stripeUrl }} style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <Button onPress={fetchStripeUrl}>
                            <ButtonText>Open Stripe</ButtonText>
                        </Button>
                    )}
                </>
            )}
        </Container>
    );
};

export default StripeConnect;