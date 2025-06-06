import React from 'react';
import { View } from 'react-native';
import SearchBar from "../components/Shared/SearchBar";
import BottomNavigation from "../components/Shared/BottomNavigation";
import Home from "../components/Home/Home";
import styled from "styled-components/native";
import BottomBar from "../components/Shared/BottomBar";

const PageContainer = styled.View`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Content = styled.View`
  flex: 1;
  overflow-y: auto;
`;

const HomePage = () => {
    return (
        <PageContainer>
            {/*<SearchBar/>*/}
            <Content>
                <Home />
            </Content>
            {/*<BottomBar/>*/}
            <BottomNavigation/>
        </PageContainer>
    );
};

export default HomePage;