import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import ArrowRight12 from "../../img/right_arrow_12.svg"; // Убедитесь, что SVG поддерживается
import { colors } from "../../assets/styles/colors";

// Стили для контейнера элемента
const ItemContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  font-size: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

// Стили для иконки
const Icon = styled(View)`
  font-size: 20px;
  margin-right: 15px;
`;

// Текст элемента
const Label = styled(Text)`
  flex: 1;
  color: #333;
`;

// Иконка стрелки
const Arrow = styled(View)`
  font-size: 16px;
  color: #999;
`;

const AccountItem = ({ icon, label, onClick }) => {
    return (
        <ItemContainer onPress={onClick}>
            <Icon>{icon}</Icon>
            <Label>{label}</Label>
            <Arrow>
                <ArrowRight12 stroke={colors.green.grass} fill={colors.green.grass} width={20} height={15} />
            </Arrow>
        </ItemContainer>
    );
};

export default AccountItem;