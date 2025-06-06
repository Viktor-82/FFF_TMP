import React, { useState, useRef } from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Swiper from 'react-native-swiper';
import { colors } from '../../assets/styles/colors';

import img1 from '../../img/1.jpg';
import img2 from '../../img/2.jpg';
import img3 from '../../img/3.jpg';
import img4 from '../../img/4.jpg';
import img5 from '../../img/5.jpg';

const backgrounds = [img1, img2, img3, img4, img5];
const { width, height } = Dimensions.get('window');

const titles = [
    'Welcome!',
    'Freshness from the field to your table',
    'Support Local Farmers!',
    'Healthy Eating — Care for Yourself and Your Loved Ones',
    'Contribute to the Development of a Healthy Food Ecosystem',
];

const descriptions = [
    'Natural products from farmers in your region.',
    'Customers receive fresh products straight from fields and farms.',
    'By using this application, customers support local farmers.',
    'By buying from farmers, you choose products crafted with care.',
    'Your choice supports responsible production.',
];

const Carousel = ({ onSkip }) => {
    const [slideIndex, setSlideIndex] = useState(0);
    // Храним ссылку на Swiper
    const swiperRef = useRef(null);

    const handleNext = () => {
        // Если мы на последнем слайде, вызываем onSkip
        if (slideIndex === backgrounds.length - 1) {
            onSkip();
        } else {
            // Иначе переходим к следующему слайду
            // scrollBy() доступен на ref
            swiperRef.current?.scrollBy(1);
        }
    };

    return (
        <Swiper
            ref={swiperRef}
            loop={false}
            showsPagination
            onIndexChanged={(index) => setSlideIndex(index)}
            activeDotColor={colors.green.grass}
            dotColor="#e0e0e0"
        >
            {backgrounds.map((bgImage, index) => (
                <SlideContentWrapper key={index}>
                    <SlideContent source={bgImage} resizeMode="cover" />
                    <SlideContentDescription>
                        <TextContainer>
                            <Title>{titles[index]}</Title>
                            <Description>{descriptions[index]}</Description>
                        </TextContainer>

                        <ButtonContainer>
                            {index < backgrounds.length - 1 ? (
                                <Button onPress={handleNext}>
                                    <ButtonText>Next</ButtonText>
                                </Button>
                            ) : (
                                <Button onPress={onSkip}>
                                    <ButtonText>Finish</ButtonText>
                                </Button>
                            )}
                        </ButtonContainer>
                    </SlideContentDescription>
                </SlideContentWrapper>
            ))}
        </Swiper>
    );
};

export default Carousel;

// ---------------------- Стили ---------------------- //

const SlideContentWrapper = styled.View`
  flex: 1;
  justify-content: flex-end;
`;

const SlideContent = styled.ImageBackground`
  flex: 3;
  justify-content: flex-end;
  width: ${width}px;
  height: ${height * 0.6}px;
`;

const SlideContentDescription = styled.View`
  flex: 1;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  align-items: center;
  justify-content: space-between;
`;

const TextContainer = styled.View`
  align-items: center;
`;

const Title = styled.Text`
  font-family: 'Pacifico';
  font-size: 24px;
  color: ${colors.green.grass};
  margin-bottom: 15px;
  text-align: center;
`;

const Description = styled.Text`
  font-family: 'Open Sans';
  font-size: 16px;
  color: #555;
  max-width: 250px;
  margin: 0 auto 15px;
  text-align: center;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const Button = styled(TouchableOpacity)`
  background-color: ${colors.green.grass};
  padding: 12px 24px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
