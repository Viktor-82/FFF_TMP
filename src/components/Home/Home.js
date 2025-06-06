import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SliderBlock from "../Slider/SliderBlock";
import styled from "styled-components/native";
import { fetchSliderData } from "../../redux/actions/homeActions";
import { View, ScrollView } from 'react-native';

// Стили для контейнера
const HomeContainer = styled(ScrollView)`
  padding-top: 70px; /* Отступ для фиксированной шапки */
`;

const Home = () => {
    const dispatch = useDispatch();
    const sliderData = useSelector((state) => state.home?.sliderData || []);

    useEffect(() => {
        dispatch(fetchSliderData()); // Загрузка данных слайдеров
    }, [dispatch]);

    // Проверяем, есть ли данные, если нет — ничего не рендерим
    if (!sliderData || sliderData.length === 0) {
        return null; // Пустое место, если данных нет
    }

    return (
        <HomeContainer>
            {sliderData.map((block) => (
                <SliderBlock
                    key={block.id}
                    title={block.title}
                    description={block.description}
                    products={block.products}
                />
            ))}
        </HomeContainer>
    );
};

export default Home;