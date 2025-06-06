import React from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
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

const ShareButton = ({ onClick }) => {
    return (
        <View style={shadowStyle}>
            <StyledButton onPress={onClick}>
                <Text>
                    <Icon name="share" size={24} color={colors.green.olive} />
                </Text>

            </StyledButton>
        </View>
    );
};

export default ShareButton;
