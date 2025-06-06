import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import SearchBar from "../components/Shared/SearchBar";
import MyEssentials from "../components/MyEssentials/MyEssentials";
import BottomNavigation from "../components/Shared/BottomNavigation";
import BottomBar from "../components/Shared/BottomBar";

const EssentialsPageContainer = styled(View)`
  height: 100%;
`;

const BottomEssentialsView = styled.View`
  height: 140px; // В React Native обычно используются пиксели
  width: 100%;
`;

const MyEssentialsPage = () => {
    return (
        <EssentialsPageContainer>
            <SearchBar />
            <MyEssentials />
            {/*<BottomEssentialsView />*/}
            {/*<BottomBar />*/}
            <BottomNavigation />
        </EssentialsPageContainer>
    );
};

export default MyEssentialsPage;