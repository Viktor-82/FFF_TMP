import React from 'react';
import { View } from 'react-native';
import SearchBar from "../components/Shared/SearchBar";
import BottomNavigation from "../components/Shared/BottomNavigation";
import SalesStatistics from "../components/Stats/SalesStatistics";
import styled from "styled-components/native";

const PageContainer = styled.View`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Content = styled.View`
  flex: 1;
  overflow-y: auto;
`;

const SalesStatisticsPage = () => {
    return (
        <PageContainer>
            {/*<SearchBar/>*/}
            <Content>
                <SalesStatistics />
            </Content>
            {/*<BottomBar/>*/}
            <BottomNavigation/>
        </PageContainer>
    );
};

export default SalesStatisticsPage;