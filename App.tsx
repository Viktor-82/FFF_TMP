import React, { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Linking } from 'react-native';
import NetworkModal from './src/components/Shared/NetworkModal';
// import { Elements } from '@stripe/stripe-react-native';

// import Header from './src/components/Shared/Header';
// import Footer from './src/components/Shared/Footer';
import WelcomeSlider from './src/components/Slider/WelcomeSlider';
import AppRoutes from './src/routes';
import SyncData from './src/components/Sync/SyncData';
import { loadProductsData } from './src/services/productService';
import TokenChecker from "./src/components/TokenChecker/TokenChecker";

import GoogleAuthHandler from './src/components/Auth/GoogleAuthHandler';
// import FacebookAuthHandler from './src/components/Auth/FacebookAuthHandler';
// import AppleAuthHandler from './src/components/Auth/AppleAuthHandler';
import { navigationRef } from './src/navigation/NavigationRef';
// import { REACT_APP_STRIPE_PUBLISHABLE_KEY } from '@env';
import { STRIPE_KEY } from './config';

// // Подключение Stripe (вставьте ваш тестовый Publishable Key)
// const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

GoogleSignin.configure({
    webClientId: '843944815761-lgtgujiaagp97548bibbaaigodphpath.apps.googleusercontent.com', // Client ID из JSON
    offlineAccess: true, // Если нужен серверный доступ
    forceCodeForRefreshToken: true, // Для обновления токена
});

const Stack = createStackNavigator();

const App = () => {
    const [showMainContent, setShowMainContent] = useState(false);

    const onRegister = () => {
        // console.log('User completed slider, showing main content');
        setShowMainContent(true);
    };

    const dispatch = useDispatch();
    const addresses = useSelector((state) => state.addresses.list);
    const activeAddress = addresses.find((address) => address.isActive);
    const userLocation = activeAddress ? activeAddress.coordinates : null;
    const radiusInMiles = 10;

    useEffect(() => {
        if (userLocation) {
            loadProductsData(dispatch, userLocation, radiusInMiles);
        }
    }, [dispatch, userLocation]);


    // useEffect(() => {
    //   const handleDeepLink = async (event) => {
    //     const url = event.url;
    //     const queryString = url.split('?')[1];
    //     const params = queryString.split('&').reduce((acc, param) => {
    //       const [key, value] = param.split('=');
    //       acc[key] = decodeURIComponent(value);
    //       return acc;
    //     }, {});
    //
    //     const token = params.token;
    //     if (token) {
    //       console.log('Token:', token);
    //       try {
    //         // Сохраняем токен в AsyncStorage
    //         await AsyncStorage.setItem('authToken', token);
    //         console.log('Token saved successfully.');
    //       } catch (error) {
    //         console.error('Error saving token:', error);
    //       }
    //       // Здесь вы можете сохранить токен, например, в AsyncStorage
    //     } else {
    //       console.error('Token not found in deep link');
    //     }
    //   };
    //
    //   Linking.addEventListener('url', handleDeepLink);
    //
    //   // Проверяем, открыто ли приложение через глубокую ссылку
    //   Linking.getInitialURL().then((url) => {
    //     if (url) {
    //       handleDeepLink({ url });
    //     }
    //   });
    //
    //   return () => {
    //     Linking.removeEventListener('url', handleDeepLink);
    //   };
    // }, []);

    // useEffect(() => {
    //   const handleDeepLink = async (event) => {
    //     try {
    //       const url = event.url;
    useEffect(() => {
        const handleDeepLink = async (event) => {
            try {
                const url = event.url;
                if (url.startsWith('farmfreshfarmer://stripe-success')) {
                    console.log('✅ Stripe onboarding successful');
                    const params = new URLSearchParams(url.split('?')[1]);
                    const accountId = params.get('accountId');
                    const status = params.get('status');

                    if (accountId && status) {
                        console.log('Stripe Data:', { accountId, status });
                        // Перенаправляем на экран с передачей данных
                        navigationRef.current?.navigate('StripeSuccess', { accountId, status });
                    }
                } else if (url.startsWith('farmfreshfarmer://stripe-refresh')) {
                    console.log('🔄 Stripe onboarding refresh');
                    const params = new URLSearchParams(url.split('?')[1]);
                    const accountId = params.get('accountId');
                    const status = params.get('status');

                    if (accountId && status) {
                        console.log('Stripe Refresh Data:', { accountId, status });
                        navigationRef.current?.navigate('StripeRefresh', { accountId, status });
                    }
                }
                const queryString = url.split('?')[1];
                const params = queryString.split('&').reduce((acc, param) => {
                    const [key, value] = param.split('=');
                    acc[key] = decodeURIComponent(value);
                    return acc;
                }, {});

                const { token, refreshToken, provider, id, username, email, role, exp } = params;

                // const queryString = url.split('?')[1];
                // const params = queryString ? new URLSearchParams(queryString) : new URLSearchParams();
                // const { token, refreshToken, provider, id, username, email, role, exp } = Object.fromEntries(params);

                if (!provider) {
                    console.error('No provider specified in deep link');
                    return;
                }

                console.log(`Handling deep link for provider: ${provider}`);

                if (token) {
                    console.log('Token:', token);
                    console.log('Provider:', provider);
                    console.log('Refresh Token:', refreshToken);

                    // Сохраняем токен в AsyncStorage
                    await AsyncStorage.setItem('authToken', token);

                    if (refreshToken) {
                        await AsyncStorage.setItem('refreshToken', refreshToken);
                    }

                    await AsyncStorage.setItem('authProvider', provider);

                    console.log('Token and related data saved successfully.');

                    // Перенаправление на соответствующий компонент
                    switch (provider) {
                        case 'google':
                            // navigationRef.current?.navigate('GoogleAuthHandler', { token, refreshToken, provider });
                            navigationRef.current?.navigate('GoogleAuthHandler', { token, refreshToken, provider, id, username, email, role, exp });
                            break;
                        // case 'facebook':
                        //   navigationRef.current?.navigate('FacebookAuthHandler', { token, refreshToken, provider });
                        //   break;
                        // case 'apple':
                        //   navigationRef.current?.navigate('AppleAuthHandler', { token, refreshToken, provider });
                        //   break;
                        default:
                            console.warn('Unhandled provider:', provider);
                    }

                } else {
                    console.error('Token not found in deep link');
                }

                // 🔥 Обработка редиректов Stripe
                // if (url.startsWith('FarmFresh_Farmer://stripe-success')) {
                if (url.startsWith('farmfreshfarmer://stripe-success')) {
                    console.log('✅ Stripe onboarding successful');
                    // navigationRef.current?.navigate('StripeSuccessScreen'); // Перенаправление на нужный экран
                    navigationRef.current?.navigate('StripeSuccess'); // Перенаправление на нужный экран
                }

                // if (url.startsWith('FarmFresh_Farmer://stripe-refresh')) {
                if (url.startsWith('farmfreshfarmer://stripe-refresh')) {
                    console.log('🔄 Stripe onboarding refresh');
                    // navigationRef.current?.navigate('StripeRefreshScreen'); // Перенаправление на экран обновления
                    navigationRef.current?.navigate('StripeRefresh'); // Перенаправление на экран обновления
                }
                // 🔥 Конец изменений

            } catch (error) {
                console.error('Error handling deep link:', error);
            }
        };

        Linking.addEventListener('url', handleDeepLink);

        // Проверяем, открыто ли приложение через глубокую ссылку
        Linking.getInitialURL().then((url) => {
            if (url) {
                handleDeepLink({ url });
            }
        });

        return () => {
            // Linking.removeEventListener('url', handleDeepLink);
            Linking.removeAllListeners('url', handleDeepLink);
        };
    }, []);


    return (
        <StripeProvider
            publishableKey={STRIPE_KEY} // Ваш Publishable Key
            // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            // merchantIdentifier="merchant.com.your-app" // required for Apple Pay
        >
            <NavigationContainer  ref={navigationRef}>
                <View style={styles.container}>
                    <SyncData
                        dataKey="unsyncedLocationData"
                        apiEndpoint="/api/save-location-customer"
                        successMessage="Location data synced successfully."
                        method="POST"
                    />
                    <SyncData
                        dataKey="unsyncedUpdatedLocationData"
                        apiEndpoint="/api/update-location"
                        successMessage="Location updated successfully."
                        method="PUT"
                    />
                    <SyncData
                        dataKey="unsyncedDeletedLocationData"
                        apiEndpoint="/api/delete-location"
                        successMessage="Location deleted successfully."
                        method="DELETE"
                    />
                    <SyncData
                        dataKey="unsyncedOrderData"
                        apiEndpoint="https://marketplace-usa-backend.onrender.com/api/orders/create-order"
                        successMessage="Order successfully synced."
                        method="POST"
                    />

                    {/* Проверка токена */}
                    <TokenChecker />

                    {showMainContent ? (
                        <>
                            <AppRoutes />
                        </>
                    ) : (
                        <WelcomeSlider onRegister={onRegister} />
                    )}
                    <NetworkModal />
                    <Toast/>
                </View>
            </NavigationContainer>
        </StripeProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default App;