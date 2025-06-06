import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colors } from "../../assets/styles/colors";
import CommunityButton from "../Community/CommunityButton";

// Обёртка для вкладок
const TabsContainer = styled.View`
  width: 100%;
  margin-bottom: 20px; 
`;

const TabList = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  position: relative;
`;

const TabButton = styled.TouchableOpacity`
  padding: 4px 27px;
  z-index: 2;
  background-color: ${({ isActive }) => (isActive ? '#fff' : 'transparent')};
  text-align: center;
`;

const TabButtonText = styled.Text`
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
  color: ${colors.green.grass};
`;

// Только верхние углы
const ActiveLine = styled.View`
  position: absolute;
  left: 0; /* Привязываем линию к краям */
  right: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background-color: #C4A484;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
`;

const TabContent = styled.View`
  margin-top: 12px;
`;

const TabContentText = styled.Text`
  font-size: 14px;
  color: #555;
  line-height: 20px;
`;

function Tabs({ tabs = [], activeIndex, onChange, isCommunity = false, communityType = "", history }) {
    const isControlled = typeof activeIndex === 'number' && typeof onChange === 'function';
    const [internalIndex, setInternalIndex] = useState(0);
    const currentIndex = isControlled ? activeIndex : internalIndex;
    if (!tabs.length) return null;
    const safeIndex = Math.min(currentIndex, tabs.length - 1);

    const handlePress = (index) => {
        if (isControlled) {
            onChange(index);
        } else {
            setInternalIndex(index);
        }
    };

    return (
        <TabsContainer>
            <TabList>
                {tabs.map((tab, i) => {
                    const active = i === safeIndex;
                    const buttonStyle = {
                        borderWidth: active ? 2 : 0,
                        borderColor: active ? '#C4A484' : 'transparent',
                        borderBottomWidth: active ? 0 : 2,
                        borderTopLeftRadius: active ? 40 : 0,
                        borderTopRightRadius: active ? 40 : 0,
                        borderBottomLeftRadius: 0,
                        borderBottomRightRadius: 0,
                    };
                    return (
                        <TabButton key={i} style={buttonStyle} onPress={() => handlePress(i)} isActive={i === safeIndex}>
                            <TabButtonText isActive={active}>{tab.title}</TabButtonText>
                        </TabButton>
                    );
                })}
                <ActiveLine />
            </TabList>

            {isCommunity &&
                (communityType === 'plans' || communityType === 'history' && !history) && (
                <CommunityButton communityType={communityType} />
            )}

            <TabContent>
                {typeof tabs[safeIndex].content === 'string' ? (
                    <TabContentText>{tabs[safeIndex].content}</TabContentText>
                ) : (
                    tabs[safeIndex].content
                )}
            </TabContent>
        </TabsContainer>
    );
}

export default Tabs;
