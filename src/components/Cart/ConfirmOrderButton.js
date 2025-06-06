import React from "react";
import styled from "styled-components/native";
import { TouchableOpacity, Text } from 'react-native';
import { colors } from "../../assets/styles/colors";

// Стили для кнопки
const ConfirmButton = styled(TouchableOpacity)`
  background-color: ${colors.green.grass}; /* Зеленый цвет */
  align-items: center;
  justify-content: center;
  padding: 12px 20px; /* 0.75rem = 12px, 1.25rem = 20px */
  border-radius: 10px; /* 0.625rem = 10px */
  width: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 0.25rem = 4px, 0.375rem = 6px */
`;

const ButtonText = styled(Text)`
  color: white;
  font-size: 19px; /* 1.2rem = 19px */
  font-weight: bold;
`;

// Компонент кнопки
const ConfirmOrderButton = ({ onConfirm }) => {
    return (
        <ConfirmButton onPress={onConfirm}>
            <ButtonText>Confirm Order</ButtonText>
        </ConfirmButton>
    );
};

export default ConfirmOrderButton;