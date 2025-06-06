import React from "react";
import styled from "styled-components/native";
import { View, Text } from 'react-native';

/**
 * Компонент TabContent
 *
 * Что делает:
 * - Отображает содержимое активной вкладки (например, описание товара, отзывы, обсуждения).
 * - Если текста больше, чем вмещается на экране, отображает градиентный "туман" внизу.
 * - Показывает текст-заглушку, если переданный `content` пустой.
 *
 * Где используется:
 * - Под компонентом Tabs в ProductPage.
 */

// Стили для контейнера текста
const TabContentContainer = styled.View`
  padding: 20px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.6;
  max-height: 300px; /* Ограничиваем высоту */
  overflow: auto;
  position: relative;

  /* Эффект "тумана" для текста, который выходит за пределы видимой области */
  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      ${({ theme }) => theme.colors.background} 100%
    );
    pointer-events: none;
  }
`;

const TabContent = ({ content }) => {
    return (
        <TabContentContainer>
            {content || "No content"} {/* Текст по умолчанию */}
        </TabContentContainer>
    );
};

export default TabContent;
