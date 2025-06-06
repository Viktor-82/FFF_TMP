import React from "react";
import styled from "styled-components/native";
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from "../../assets/styles/colors";
import { getCategoryIcon } from "../../services/categoryIconChois";
// import { SvgXml } from "react-native-svg";
import ArrowRight12 from "../../img/right_arrow_12.svg"; // Импорт SVG
import ArrowDown12 from "../../img/categories_page/down_arrow_12.svg"; // Импорт SVG

// Стили для контейнера категории
const CategoryItemContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px 20px; /* 0.4375rem = 7px, 1.25rem = 20px */
  margin: 0 3px;
  margin-bottom: ${({ isActive }) => (isActive ? '0' : '10px')};
  border-width: 1px; /* 0.0625rem = 1px */
  border-color: #e0e0e0;
  border-radius: 10px; /* 0.625rem = 10px */
  background-color: ${colors.neutral.white};
`;

// Стили для иконки категории
const CategoryIcon = styled(View)`
  width: 30px; /* 1.875rem = 30px */
  height: 30px;
  justify-content: center;
  align-items: center;
  color: ${colors.green.olive};
`;

// Стили для названия категории
const CategoryName = styled(Text)`
  flex: 1;
  margin-left: 20px; /* 1.25rem = 20px */
  font-size: 16px; /* 1rem = 16px */
  color: ${colors.brown.earth};
`;

// Стили для стрелки
const CategoryArrow = styled(View)`
  justify-content: center;
  align-items: center;
`;

const CategoryItem = ({ category, isActive, onClick }) => {
    return (
        <CategoryItemContainer isActive={isActive} onPress={onClick}>
            <CategoryIcon>
                {getCategoryIcon(category.name)}
            </CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
            <CategoryArrow>
                {isActive ? (
                    <ArrowDown12 width={15} height={15} />
                ) : (
                    <ArrowRight12 width={15} height={15} style={{ marginTop: -5 }} />
                )}
            </CategoryArrow>
        </CategoryItemContainer>
    );
};

export default CategoryItem;