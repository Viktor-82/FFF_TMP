import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../assets/styles/colors';

// Стиль для контейнера DeliverTo
const DeliverToContainer = styled(Animated.View)`
  flex-direction: row;
  //flex-shrink: 0;
  align-items: center;
  //justify-content: space-between;
  justify-content: space-around;
  background-color: ${colors.yellowOrange.golden};
  padding: 10px 6px;
  border-radius: 10px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.15);
  position: absolute;
  bottom: 60px;
  right: 3px;
  width: 31.5%;
  z-index: 1000;
`;

// Стиль для текста
const DeliverText = styled.Text`
  color: ${colors.brown.earth};
  font-size: 15px;
  max-width: 87%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  //text-align: center;
`;

// Иконка местоположения
const LocationIcon = styled.Text`
  font-size: 18px;
  //margin-right: 3px;
  color: ${colors.neutral.gray};
`;

function DeliverTo({ address }) {
    const navigation = useNavigation(); // Используем хук useNavigation для навигации
    const slideAnim = useRef(new Animated.Value(100)).current; // Начальное значение за пределами экрана

    useEffect(() => {
        // Анимация появления
        Animated.timing(slideAnim, {
            toValue: 0, // Конечное положение (0 = на экране)
            duration: 400, // Длительность анимации
            useNativeDriver: true, // Использование нативного драйвера для повышения производительности
        }).start();
    }, []);

    const handleNavigate = () => {
        navigation.navigate('MyAddress'); // Переход на экран "Мой адрес"
    };

    return (
        <Animated.View
            style={{
                transform: [{ translateY: slideAnim }], // Применяем анимацию
            }}
        >
            <TouchableOpacity onPress={handleNavigate}>
                <DeliverToContainer>
                    <LocationIcon>📍</LocationIcon>
                    <DeliverText numberOfLines={2} ellipsizeMode="tail">
                        Deliver to {"\n"}{address}
                    </DeliverText>
                </DeliverToContainer>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default DeliverTo;