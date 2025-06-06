import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; // Используем навигацию из React Navigation
import styled from 'styled-components/native';
import { colors } from '../../assets/styles/colors';

const SubcategoryListContainer = styled.View`
  flex: 1;
  padding: 5px 3px;
  //padding: 10px;
`;

const SubcategoryItem = styled.TouchableOpacity`
  padding: 10px 10px 10px 90px;
  margin: 5px 0;
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: ${({ isLastChild }) => (isLastChild ? '10px' : '0')};
`;

const SubcategoryText = styled.Text`
  color: ${colors.brown.earth};
  font-size: 16px;
`;

const SubcategoryList = ({ category }) => {
    const navigation = useNavigation(); // Используем хук useNavigation для навигации

    // Получаем подкатегории из Redux
    const subcategories = useSelector(
        (state) => state.product.categorySubcategoriesMap[category] || []
    );

    // Обработчик клика по подкатегории
    const handleSubcategoryClick = (subcategory) => {
        navigation.navigate('SubcategoryProducts', { subcategory }); // Переход на экран подкатегории
    };

    return (
        <SubcategoryListContainer>
            {subcategories.map((subcategory, index) => (
                <SubcategoryItem
                    key={index}
                    isLastChild={index === subcategories.length - 1}
                    onPress={() => handleSubcategoryClick(subcategory)} // Используем onPress вместо onClick
                >
                    <SubcategoryText>{subcategory}</SubcategoryText>
                </SubcategoryItem>
            ))}
        </SubcategoryListContainer>
    );
};

export default SubcategoryList;