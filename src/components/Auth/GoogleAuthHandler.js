import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../redux/actions/userActions';
import { fetchAddresses } from '../../redux/actions/addressActions';
import { showToast } from '../Shared/Notification';
import { initializeToken, getToken, startTokenExpirationCheck } from '../../utils/tokenManager';
import { navigationRef } from '../../navigation/NavigationRef'; // Импорт navigationRef

const GoogleAuthHandler = ({ route }) => {
    const dispatch = useDispatch();
    console.log('call from google auth handler');

    useEffect(() => {
        const { token, refreshToken, provider, id, username, email, role, exp } = route.params || {};
        console.log('Route params received:', { token, refreshToken, provider, id, username, email, role, exp });

        const handleAuth = async () => {
            try {
                if (token && id) {
                    console.log("Valid token and user ID received. Proceeding with authentication...");

                    // Initialize token
                    initializeToken(token, true, navigationRef);

                    // Save user data in AsyncStorage
                    await AsyncStorage.setItem('user', JSON.stringify({ id, username, email, role }));
                    await AsyncStorage.setItem('authToken', token);
                    if (refreshToken) {
                        await AsyncStorage.setItem('refreshToken', refreshToken);
                    }

                    // Dispatch user data to Redux
                    dispatch(setUser({ id, username, email, role }));
                    startTokenExpirationCheck(navigationRef);

                    // Fetch user addresses
                    const result = await dispatch(fetchAddresses());
                    const addresses = Array.isArray(result) ? result : [];
                    console.log('Fetched addresses:', addresses);

                    if (addresses.length > 0) {
                        console.log('Addresses found. Redirecting to Home...');
                        navigationRef.current?.navigate('Home');
                    } else {
                        console.log('No addresses found. Redirecting to LocationPermission...');
                        navigationRef.current?.navigate('LocationPermission');
                    }
                } else {
                    console.warn('Token or user ID missing. Checking stored data...');
                    const savedUser = await AsyncStorage.getItem('user');
                    const savedToken = getToken();

                    if (savedUser && savedToken) {
                        console.log('Stored user data and token found. Initializing session...');
                        initializeToken(savedToken, true, navigationRef);
                        dispatch(setUser(JSON.parse(savedUser)));
                        startTokenExpirationCheck(navigationRef);

                        const result = await dispatch(fetchAddresses());
                        const addresses = Array.isArray(result) ? result : [];
                        console.log('Fetched addresses from stored data:', addresses);

                        if (addresses.length > 0) {
                            navigationRef.current?.navigate('Home');
                        } else {
                            navigationRef.current?.navigate('LocationPermission');
                        }
                    } else {
                        console.error('Authentication failed. Redirecting to Login...');
                        showToast('Authentication failed. Please log in again.', 'error');
                        navigationRef.current?.navigate('Login');
                    }
                }
            } catch (error) {
                console.error('Error during authentication:', error);
                showToast('An error occurred during authentication. Please try again.', 'error');
                navigationRef.current?.navigate('Login');
            }
        };

        handleAuth();
    }, [dispatch, route.params]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#1d72b8" />
            <Text style={{ marginTop: 20, fontSize: 18, color: '#333' }}>Loading, please wait...</Text>
        </View>
    );
};

export default GoogleAuthHandler;
