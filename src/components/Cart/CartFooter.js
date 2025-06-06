import React from "react";
import styled from "styled-components/native";
import { colors } from "../../assets/styles/colors";
import { View, Text, TouchableOpacity, Platform } from 'react-native'; // Добавляем TouchableOpacity для кнопки

const shadowStyle = Platform.select({
    android: {
        elevation: 5,
    },
    ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
});

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: ${colors.neutral.white};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
`;

const EstimatedCost = styled.Text`
  font-size: 18px;
  color: ${colors.brown.earth};
`;

const EstimatedCostBold = styled.Text`
  font-weight: bold;
  color: ${colors.green};
`;

const ConfirmButton = styled(TouchableOpacity)`
  padding: 10px 20px;
  background-color: ${colors.green};
  border-radius: 8px;
`;

const ConfirmButtonText = styled.Text`
  font-size: 16px;
  color: ${colors.neutral.white};
`;

const CartFooter = ({ estimatedCost, onConfirm }) => {
    return (
        <FooterContainer style={shadowStyle}>
            {/* Итоговая стоимость */}
            <EstimatedCost>
                Estimated cost: <EstimatedCostBold>€ {estimatedCost}</EstimatedCostBold>
            </EstimatedCost>

            {/* Кнопка подтверждения */}
            <ConfirmButton onPress={onConfirm}>
                <ConfirmButtonText>Confirm</ConfirmButtonText>
            </ConfirmButton>
        </FooterContainer>
    );
};

export default CartFooter;