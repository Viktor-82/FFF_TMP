import React from 'react';
import styled from 'styled-components/native';
import ProductCard from "../Products/ProductCard";
import { colors } from '../../assets/styles/colors';
import { View, Text, ScrollView } from 'react-native';

// Стили для блока с уникальным скруглением углов
const SliderBlockContainer = styled(View)`
  padding: 20px;
  margin-bottom: 20px;
  background: linear-gradient(to bottom, ${colors.neutral.white}, ${colors.brown.cream});
  position: relative;
  overflow: hidden; /* Чтобы содержимое не выходило за границы блока */
  border-radius: 50px 0 0 50px; /* Скругляем верхний левый угол */
`;

const Header = styled(View)`
  margin-bottom: 10px;
`;

const Title = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  color: ${colors.brown.earth};
  margin: 0;
`;

const Description = styled(Text)`
  font-size: 16px;
  color: ${colors.brown.earth};
  opacity: 0.8;
  margin: 5px 0 0;
`;

const Slider = styled(ScrollView)`
  display: flex;
  flex-direction: row;
  gap: 10px;
  padding: 10px 0;
`;

const SliderBlock = ({ title, description, products }) => {
    return (
        <SliderBlockContainer>
            <Header>
                <Title>{title}</Title>
                <Description>{description}</Description>
            </Header>

            <Slider horizontal showsHorizontalScrollIndicator={false}>
                {products.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </Slider>
        </SliderBlockContainer>
    );
};

export default SliderBlock;