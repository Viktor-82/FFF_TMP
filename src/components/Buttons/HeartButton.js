import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../redux/slices/essentialsSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Используем иконки из библиотеки
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
  background-color: ${colors.neutral.white};
  width: 40px;
  height: 40px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
`;

const HeartButton = ({ productId }) => {
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.essentials.items) || [];
    const isFavorite = favorites.map(Number).includes(+productId);
    const products = useSelector((state) => state.product.items || []);
    const product = products.find((p) => +p.id === +productId);
    const productName = product ? product.name : '';

    const handleClick = () => {
        if (!productId) return; // Если productId пустой, не выполняем клик

        if (isFavorite) {
            dispatch(removeFavorite(productId));
        } else {
            dispatch(addFavorite({ productId, productName }));
        }
    };

    return (
        <View style={shadowStyle}>
            <StyledButton onPress={handleClick}>
                <Icon
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={24}
                    color={isFavorite ? 'red' : colors.green.olive}
                />
            </StyledButton>
        </View>
    );
};

export default HeartButton;
