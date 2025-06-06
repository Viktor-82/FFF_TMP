import React from 'react';
import { View, TouchableOpacity, Platform, StyleSheet  } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../../redux/slices/searchSlice';
import Icon from 'react-native-vector-icons/Ionicons'; // Используем иконки из библиотеки
import { colors } from '../../assets/styles/colors';

// Стили для тени
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

// Стили кнопки
const StyledButton = styled(TouchableOpacity)`
  background-color: ${({ isCartPage }) => (isCartPage ? 'transparent' : colors.neutral.white)};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: ${({ isCartPage }) => (isCartPage ? 'flex-start' : 'center')};
`;

// Обёртка для текста, если надо использовать текст в кнопке
const ButtonText = styled.Text`
  color: ${colors.green.olive};
  font-size: 16px;
  margin-left: 5px;
`;

const BackButton = ({ isCartPage, isCurrentScreen }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleBack = () => {
        dispatch(setSearchQuery(''));
        const currentRoute = navigation.getState().routes[navigation.getState().index].name;

        if (isCurrentScreen === 'OrdersPage') {
            navigation.navigate('Home');
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.navigate('Home');
        }
    };

    return (
        <View style={shadowStyle}>
            <StyledButton onPress={handleBack} isCartPage={isCartPage}>
                <Icon name="arrow-undo-outline" size={24} color={colors.green.grass} />
            </StyledButton>
        </View>
    );
};

export default BackButton;